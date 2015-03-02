/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * <p>This extends the standard [Row widget]{@link module:alfresco/lists/views/layouts/Row} to provide the ability to
 * toggle between the standard mode (for reading data) and an edit mode.</p>
 * <p>It is expected that edit mode will be able to handle user input and during this mode the normal list keyboard
 * navigation behaviour (e.g. the ability to use the cursor keys to navigate up and down the list) will be suspended
 * until edit mode is exited. When a row has focus in read mode the user can use a combination of the CONTROL and "E"
 * keys to enter edit mode, and in edit mode they can use the ESCAPE key to cancel.</p>
 * <p>Developers should include widgets for entering and existing edit mode (e.g. they could include a 
 * [PublishAction widget]{@link module:alfresco/renderers/PublishAction} in the read view to enter edit mode and a
 * [button]{@link module:alfresco/buttons/AlfButton} to exit edit mode).</p>
 * <p>A typical usage might be to create a [form]{@link module:alfresco/forms/Form} as the edit mode. In this scenario
 * it would be expected to set the [okButtonPublishTopic]{@link module:alfresco/forms/Form#okButtonPublishTopic}
 * to use the [readModeSavePublishTopic]{@link module:alfresco/lists/views/layouts/EditableRow#readModeSavePublishTopic}
 * and the [cancelButtonPublishTopic]{@link module:alfresco/forms/Form#cancelButtonPublishTopic} to use the
 * [readModeCancelPublishTopic]{@link module:alfresco/lists/views/layouts/EditableRow#readModeCancelPublishTopic}. An even
 * better approach would be to go via an intermediary service so that edit mode is only exited on successful update
 * of data to the repository.</p>
 * 
 * @module alfresco/lists/views/layouts/EditableRow
 * @extends module:alfresco/lists/views/layouts/Row
 * @mixes module:alfresco/core/ObjectProcessingMixin
 * @mixes module:alfresco/lists/KeyboardNavigationSuppressionMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/lists/views/layouts/Row",
        "alfresco/core/ObjectProcessingMixin",
        "alfresco/lists/KeyboardNavigationSuppressionMixin",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/on"], 
        function(declare, Row, ObjectProcessingMixin, KeyboardNavigationSuppressionMixin,
                 lang, array, domConstruct, domClass, domStyle, on) {

   return declare([Row, ObjectProcessingMixin, KeyboardNavigationSuppressionMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/EditableRow.css"}]
       */
      cssRequirements: [{cssFile:"./css/EditableRow.css"}],
   
      /**
       * This is the default topic that will be subscribed to once edit mode has been entered (e.g.
       * during the [createEditModeWidgets]{@link module:alfresco/lists/views/layouts/EdiableRow#createEditModeWidgets}
       * function. This value can be overridden through configuration if required.
       *
       * @instance
       * @type {string}
       * @default "ALF_EDITABLE_ROW_READ_MODE"
       */
      readModeSavePublishTopic: "ALF_EDITABLE_ROW_READ_MODE_SAVE",

      /**
       * This is the default topic that will be subscribed to once edit mode has been entered (e.g.
       * during the [createEditModeWidgets]{@link module:alfresco/lists/views/layouts/EdiableRow#createEditModeWidgets}
       * function. This value can be overridden through configuration if required.
       *
       * @instance
       * @type {string}
       * @default "ALF_EDITABLE_ROW_READ_MODE"
       */
      readModeCancelPublishTopic: "ALF_EDITABLE_ROW_READ_MODE_CANCEL",

      /**
       * This is the default topic that will be subscribed to in order to process requests to enter 
       * edit mode. This value can be overrridden through configuration if required.
       *
       * @instance
       * @type {string}
       * @default "ALF_EDITABLE_ROW_EDIT_MODE"
       */
      editModePublishTopic: "ALF_EDITABLE_ROW_EDIT_MODE",

      /**
       *
       * @instance
       */
      postCreate: function alfresco_lists_views_layouts_EditableRow__postCreate() {
         // Generate a new pubSubScope to ensure that each row only responds to requests to enter
         // edit mode from widgets within itself...
         if (!this.pubSubScope)
         {
            this.pubSubScope = this.generateUuid();
         }

         domClass.add(this.domNode, this.additionalCssClasses ? this.additionalCssClasses : "");
         domClass.add(this.domNode, "alfresco-lists-views-layouts-EditableRow");

         // NOTE: We don't rely on the inherited widget capabilities for creating the initial widgets because
         // it doesn't clone the model. We need to ensure that the model is cloned so that variable substitution
         // behaves correctly each time we enter the read mode (e.g. after making changes to data)...
         this.createReadModeWidgets();

         // Use the onKeyPress function from the KeyboardNavigationSuppressionMixin to capture CTRL-E events
         // to enter edit mode...
         on(this.domNode, "keypress", lang.hitch(this, this.onKeyPress));

         if (this.widgetsForEditMode)
         {
            this.alfSubscribe(this.editModePublishTopic, lang.hitch(this, this.onEditMode));
         }
         else
         {
            this.alfLog("warn", "No widgets were provided for editing the row", this);
         }
      },

      /**
       * Used to indicate whether or not the the [widgetsForEditMode]{@link module:alfresco/lists/views/layouts/EditableRow#widgetsForEditMode}
       * should be processed.
       *
       * @instance
       * @type {Boolean}
       * @default  true
       */
      _alfEditModeProcessing: false,

      /**
       * This is an extension point for handling the completion of calls to 
       * [processWidgets]{@link module:alfresco/core/Core#processWidgets}. After processing the 
       * initial (read display) widgets the [_alfEditModeProcessing]{@link module:alfresco/lists/views/layouts/EdiableRow#_alfEditModeProcessing}
       * attribute is set to true to indicate that the next iteration will represent the completion
       * of the creation of the edit display widgets.
       *
       * @instance
       * @param {Array} widgets An array of all the widgets that have been processed
       */
      allWidgetsProcessed: function alfresco_lists_views_layouts_EditableRow__allWidgetsProcessed(widgets) {
         if (!this._alfEditModeProcessing)
         {
            // Need to count the number of cells, so we can figure out the colspan for our edit cell...
            // The assumption here is that there is one cell per widget...
            this._requiredColspan = widgets.length;

            this._readWidgets = widgets;

            // Set this after creating the basic row widgets, next time we enter this function we
            this._alfEditModeProcessing = true;
         }
         else
         {
            this._editWidgets = widgets;
         }
      },

      /**
       * Cleans up the mode by destroying the widgets, emptying the node and then recreating them.
       *
       * @instance
       * @param {array} widgets The widgets to destroy
       * @param {object} node The DOM node to empty.
       */
      cleanUpMode: function alfresco_lists_views_layouts_EditableRow__cleanUpMode(widgets, node) {
         if (widgets)
         {
            array.forEach(widgets, function(widget) {
               if (typeof widget.destroy === "function")
               {
                  widget.destroy(false);
               }
            });
            domConstruct.empty(node);
         }
      },

      /**
       * Handles save events. Just because edit mode is exited does not mean that any data needs to be updated (e.g. the user
       * could have requested to cancel editing). However when a save is required this function will be used to update the
       * currentItem with the updated data.
       * 
       * @instance
       * @param {object} payload The payload containing the updated data for the currentItem
       */
      onSave: function alfresco_lists_views_layouts_EditableRow__onSave(payload) {
         // Update the current item value...
         lang.mixin(this.currentItem, payload);

         // Re-build the read display...
         this.cleanUpMode(this._readWidgets, this.containerNode);
         this._alfEditModeProcessing = false;
         this.createReadModeWidgets();

         // Switch back into read mode to reveal the updated data...
         this.onReadMode();
      },

      /**
       * Handles requests to enter edit mode for the row.
       * 
       * @param {object} payload The payload on the request to enter read mode.
       */
      onReadMode: function alfresco_lists_views_layouts_EditableRow__onReadMode(/* jshint unused:false */ payload) {
         this.suppressContainerKeyboardNavigation(false);

         // Show read mode and hide edit mode...
         domStyle.set(this.domNode, "display", "table-row");
         domStyle.set(this.editModeCell, "display", "none");

         // Destroy the edit widgets...
         this.cleanUpMode(this._editWidgets, this.editWidgetsNode);
      },

      /**
       * Delegate edit clicks (issued from the [KeyboardNavigationSuppressionMixin]{@link module:alfresco/lists/KeyboardNavigationSuppressionMixin})
       * to the [onEditMode]{@link module:alfresco/lists/views/layouts/EdiableRow#onEditMode} function.
       *
       * @instance
       */
      onEditClick: function alfresco_lists_views_layouts_EditableRow__onEditClick() {
         this.onEditMode();
      },

      /**
       * Handles requests to enter edit mode for the row.
       * 
       * @param {object} payload The payload on the request to enter edit mode.
       */
      onEditMode: function alfresco_lists_views_layouts_EditableRow__onEditMode(/* jshint unused:false */ payload) {
         this.suppressContainerKeyboardNavigation(true);
         if (!this._editModeInitialised)
         {
            // Create nodes for edit mode and process widgets...
            this.createEditModeWidgets();
            this.alfSubscribe(this.readModeSavePublishTopic, lang.hitch(this, this.onSave));
            this.alfSubscribe(this.readModeCancelPublishTopic, lang.hitch(this, this.onReadMode));
            this._editModeInitialised = true;
         }

         // Create the edit mode widgets...
         var widgets = lang.clone(this.widgetsForEditMode);
         this.processObject(["processCurrentItemTokens"], widgets);
         this.processWidgets(widgets, this.editWidgetsNode);

         domStyle.set(this.domNode, "display", "none");
         domStyle.set(this.editModeCell, "display", "table-row");
      },

      /** 
       * Creates the widgets for the read display.
       * 
       * @instance
       */
      createReadModeWidgets: function alfresco_lists_views_layouts_EditableRow__createReadModeWidgets() {
         if (this.widgets)
         {
            var widgets = lang.clone(this.widgets);
            if (this.widgetModelModifiers !== null)
            {
               this.processObject(this.widgetModelModifiers, widgets);
            }
            this.processWidgets(widgets, this.containerNode);
         }
      },

      /**
       * Used to create the DOM elements to display the edit mode. This is called the first time that the
       * [onEditMode]{@link module:alfresco/lists/views/layouts/EdiableRow#onEditMode} is executed.
       *
       * @instance
       */
      createEditModeWidgets: function alfresco_lists_views_layouts_EditableRow__createEditModeWidgets() {
         // We need to construct some elements for the edit mode widgets to go into. All the 
         // edit mode widgets will live under a single cell that is not displayed in read mode.
         this.editRowNode = domConstruct.create("tr", {
            "class": "editRowNode"
         }, this.domNode, "after");
         this.editModeCell = domConstruct.create("td", {
            colspan: this._requiredColspan
         }, this.editRowNode, "last");

         // Setup event handler so prevent the outer list from swallowing keyboard activity when in
         // edit mode...
         on(this.editModeCell, "keypress", lang.hitch(this, this.onValueEntryKeyPress));
         on(this.editModeCell, "click", lang.hitch(this, this.suppressFocusRequest));

         this.editWidgetsNode = domConstruct.create("div", {}, this.editModeCell);
      },

      /**
       * The JSON model describing the widgets to use to create the edit mode. This needs to be
       * configured in order to edit mode to work at all.
       *
       * @instance
       * @type {array}
       * @default null
       */
      widgetsForEditMode: null
   });
});