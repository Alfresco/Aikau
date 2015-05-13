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
 * An Alfresco styled dialog. Extends the default Dojo dialog by adding support for a row of buttons defined
 * by the [widgetButtons]{@link module:alfresco/dialogs/AlfDialog#widgetButtons} attribute. The main body
 * of the dialog can either be defined as simple text assigned to the
 * [content]{@link module:alfresco/dialogs/AlfDialog#content} attribute or as a JSON model assigned to
 * the [widgetsContent]{@link module:alfresco/dialogs/AlfDialog#widgetsContent} attribute (widgets take
 * precedence over text - it is not possible to mix both).
 * 
 * @module alfresco/dialogs/AlfDialog
 * @extends external:dijit/Dialog
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */

/**
 * AlfDialog is based on dijit/Dialog.
 *
 * @external dijit/Dialog
 * @see http://dojotoolkit.org/reference-guide/1.9/dijit/Dialog.html
 */

define(["dojo/_base/declare",
        "dijit/Dialog",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/core/ResizeMixin",
        "dijit/_FocusMixin",
        "dojo/_base/lang",
        "dojo/sniff",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/dom-geometry",
        "dojo/html",
        "dojo/aspect",
        "jquery",
        "alfresco/layout/SimplePanel"], 
        function(declare, Dialog, AlfCore, CoreWidgetProcessing, ResizeMixin, _FocusMixin, lang, sniff, array,
                 domConstruct, domClass, domStyle, domGeom, html, aspect, $) {
   
   return declare([Dialog, AlfCore, CoreWidgetProcessing, ResizeMixin, _FocusMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AlfDialog.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfDialog.css"}],
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfDialog.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfDialog.properties"}],
      
      /**
       * Basic text content to be added to the dialog.
       * 
       * @instance
       * @type {String}
       * @default ""
       */
      content: "",
      
      /**
       * Widgets to be processed into the main node
       * 
       * @instance
       * @type {Object[]}
       * @default null 
       */
      widgetsContent: null,
      
      /**
       * Widgets to be processed into the button bar
       * 
       * @instance
       * @type {Object[]}
       * @default null 
       */
      widgetsButtons: null,

      /**
       * In some cases the content placed within the dialog will handle overflow itself, in that
       * case this should be set to false. However, in most cases the dialog will want to manage
       * overflow itself. Effectively this means that scroll bars will be added as necessary to 
       * ensure that the user can see all of the dialog content.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      handleOverflow: true,

      /**
       * Extends the default constructor to adjust for changes between 1.9.x and 1.10.x versions
       * of the dijit/Dialog. This has been done to keep AlfDialog configuration backwards compatible.
       *
       * @instance
       * @param  {object} args The constructor arguments
       */
      constructor: function alfresco_dialogs_AlfDialog__constructor(args) {
         if (!args.content && args.textContent)
         {
            args.content = args.textContent;
            delete args.textContent;
         }
         declare.safeMixin(args);
      },

      /**
       * Extends the superclass implementation to set the dialog as not closeable (by clicking an "X"
       * in the corner).
       * 
       * @instance
       */
      postMixInProperties: function alfresco_dialogs_AlfDialog__postMixInProperties() {
         this.inherited(arguments);
         // TODO: Had to use an existing NLS message for point of fix during dev-cycle - needs own widget NLS prop
         this.buttonCancel = this.message("button.close");
      },

      /**
       * If this is set to true then the dialog will retain it's opening width regardless of what happens
       * to it's contents. This is especially useful when the dialog contains widgets that resize themselves
       * that could result in the dialog shrinking (this can occur when using
       * [HorizontalWidgets]{@link module:alfresco/layout/HorizontalWidgets}.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      fixedWidth: false,
      
      /**
       * Extends the superclass implementation to process the widgets defined by 
       * [widgetButtons]{@link module:alfresco/dialogs/AlfDialog#widgetButtons} into the buttons bar
       * and either the widgets defined by [widgetsContent]{@link module:alfresco/dialogs/AlfDialog#widgetsContent}
       * or the text string set as [content]{@link module:alfresco/dialogs/AlfDialog#content} into
       * the main body of the dialog.
       * 
       * @instance
       */
      postCreate: function alfresco_dialogs_AlfDialog__postCreate() {
         this.inherited(arguments);

         // Listen for requests to resize the dialog...
         this.alfSubscribe("ALF_RESIZE_DIALOG", lang.hitch(this, "onResizeRequest"));

         domClass.add(this.domNode, "alfresco-dialog-AlfDialog");

         // Add in any additional CSS classes...
         if (this.additionalCssClasses)
         {
            domClass.add(this.domNode, this.additionalCssClasses);
         }

         // Set a width for the dialog
         if (this.dialogWidth)
         {
            domStyle.set(this.domNode, {
               width: this.dialogWidth
            });
         }

         domConstruct.empty(this.containerNode);
         this.bodyNode = domConstruct.create("div", {
            "class" : "dialog-body"
         }, this.containerNode, "last");

         // Set the dimensions of the body if required...
         domStyle.set(this.bodyNode, {
            width: this.contentWidth ? this.contentWidth: null,
            height: this.contentHeight ? this.contentHeight: null
         });

         if (sniff("ie") === 8 || sniff("ie") === 9)
         {
            // Add specific classes for IE8 and 9 to undo the CSS calculations and selectors
            // that make the footer always visible (because they don't support CSS calc)...
            domClass.add(this.domNode, "iefooter");
         }

         // It is important to create the buttons BEFORE creating the main body. This is especially important
         // for when the buttons will respond to initial setup events from a form placed inside the body (e.g.
         // so that the buttons are disabled initially if required)
         if (this.widgetsButtons)
         {
            this.creatingButtons = true;
            this.buttonsNode = domConstruct.create("div", {
               "class" : "footer"
            }, this.containerNode, "last");
            this.processWidgets(this.widgetsButtons, this.buttonsNode);
            this.creatingButtons = false;
         }

         if (this.widgetsContent)
         {
            // Workout a maximum height for the dialog as it should always fit in the window...
            var docHeight = $(document).height(),
                clientHeight = $(window).height();
            var h = (docHeight < clientHeight) ? docHeight : clientHeight;

            // Add widget content to the container node...
            var widgetsNode = domConstruct.create("div", {
               style: "max-height:" + (h - 200) + "px"
            }, this.bodyNode, "last");
            var bodyModel = [{
               name: "alfresco/layout/SimplePanel",
               assignTo: "_dialogPanel",
               config: {
                  height: this.contentHeight,
                  widgets: this.widgetsContent
               }
            }];
            this.processWidgets(bodyModel, widgetsNode);
         }
         else if (this.content)
         {
            // Add basic text content into the container node. An example of this would be for
            // setting basic text content in an confirmation dialog...
            html.set(this.bodyNode, this.encodeHTML(this.content));
         }
      },
      
      /**
       * Called when the dialog is shown.
       * Disable the outer page scrolling ability by the user when a dialog is showing.
       *
       * @instance
       */
      onShow: function alfresco_dialogs_AlfDialog__onShow() {
         this.inherited(arguments);
         domStyle.set(document.documentElement, "overflow", "hidden");
      
         // Publish events if the dialog moves
         if(this._moveable) {
            aspect.after(this._moveable, "onMoveStart", lang.hitch(this, function(returnVal, originalArgs) {
               this.alfPublish("ALF_DIALOG_MOVE_START", null, true);
               return returnVal;
            }));
            aspect.after(this._moveable, "onMoveStop", lang.hitch(this, function(returnVal, originalArgs) {
               this.alfPublish("ALF_DIALOG_MOVE_STOP", null, true);
               return returnVal;
            }));
         }
      },
      
      /**
       * Called when the dialog is hidden.
       * Enable the outer page scrolling - disabled in onShow().
       *
       * @instance
       */
      onHide: function alfresco_dialogs_AlfDialog__onHide() {
         this.inherited(arguments);
         domStyle.set(document.documentElement, "overflow", "");
         domClass.remove(this.domNode, "dialogDisplayed");
         domClass.add(this.domNode, "dialogHidden");
      },

      /**
       * This is called once the dialog gets focus and at that point it is necessary to resize 
       * it's contents as this is the final function that is called after the dialog is displayed
       * and therefore we know it will have dimensions to size against.
       *
       * @instance
       */
      _onFocus: function alfresco_dialogs_AlfDialog___onFocus() {
         this.inherited(arguments);

         var computedStyle = domStyle.getComputedStyle(this.containerNode);
         var output = domGeom.getMarginBox(this.containerNode, computedStyle);

         if (this.handleOverflow === true)
         {
            domClass.add(this.domNode, "handleOverflow");
         }

         if (this.fixedWidth === true)
         {
            // Fix the width of the dialog - this has been done to prevent the dialog from shrinking
            // as its contents are resized on window resize events. The issue here is that the dialog
            // may become too big for the initial window, but that's preferable to shrinkage...
            domStyle.set(this.domNode, "width", output.w + "px");
         }

         this.alfPublishResizeEvent(this.domNode);
         domClass.remove(this.domNode, "dialogHidden");
         domClass.add(this.domNode, "dialogDisplayed");
         // TODO: We could optionally reveal the dialog after resizing to prevent any resizing jumping?
      },

      /**
       * Calls the resize() function
       *
       * @instance
       * @param {object} payload
       */
      onResizeRequest: function alfresco_dialogs_AlfDialog__onResizeRequest(payload) {
         // jshint unused:false
         if (this.domNode)
         {
            this.resize();
         }
      },

      /**
       * Iterates over any buttons that are created and calls the [attachButtonHandler]{@link module:alfresco/dialogs/AlfDialog#attachButtonHandler} 
       * function with each of them to ensure that clicking a button always results in the dialog being hidden. It is up to the 
       * buttons defined to publish a request to perform the appropriate action.
       * 
       * @instance
       * @param {Object[]}
       */
      allWidgetsProcessed: function alfresco_dialogs_AlfDialog__allWidgetsProcessed(widgets) {
         if (this.creatingButtons === true)
         {
            // When creating the buttons, attach the handler to each created...
            this._buttons = [];
            array.forEach(widgets, lang.hitch(this, this.attachButtonHandler));
         }
         else
         {
            // Once all the content is created the widget instances are added to the publish payload
            // of all the buttons. This is done so that the dialog content is always included in publish
            // requests. It is important NOT to override the default payload...
            array.forEach(this._buttons, function(button) {
               if (!button.publishPayload)
               {
                  button.publishPayload = {};
               }
               // The dialog content is expected to be found in the SimplePanel that is the main content
               // widget. It's array of processed widgets represent the dialog content that should be worked with
               if (widgets && widgets[0] && widgets[0]._processedWidgets)
               {
                  button.publishPayload.dialogContent = widgets[0]._processedWidgets;
               }
               else
               {
                  button.publishPayload.dialogContent = [];
               }
               button.publishPayload.dialogRef = this; // Add a reference to the dialog itself so that it can be destroyed
            });
         }
      },
      
      /**
       * This field is used to keep track of the buttons that are created.
       * 
       * @instance
       * @type {object[]}
       * @default null
       */
      _buttons: null,

      /**
       * An optional array of CSS classes to check buttons for that will suppress dialog closure when
       * the button is clicked. This has been added to allow button actions to be carried out to a 
       * successful conclusion before the dialog is closed. This means that button action failures
       * will leave the dialog visible. In particular this addresses the use case of form dialogs
       * not being closed if the form submission fails.
       *
       * @instance
       * @type {array}
       * @default null
       */
      suppressCloseClasses: null,

      /**
       * Hitches each button click to the "hide" method so that whenever a button is clicked the dialog will be hidden.
       * It's assumed that the buttons will take care of their own business.
       * 
       * @instance
       * @param {Object} widget The widget update
       * @paran {number} index The index of the widget in the widget array
       */
      attachButtonHandler: function alfresco_dialogs_AlfDialog__attachButtonHandler(widget, index) {
         // jshint unused:false
         
         var disableClose = false;
         if (this.suppressCloseClasses)
         {
            disableClose = array.some(this.suppressCloseClasses, function(className) {
               return domClass.contains(widget.domNode, className);
            }, this);
         }

         if (widget)
         {
            this._buttons.push(widget); // Add the button so we can add the content to them later...
            if (!disableClose)
            {
               if (sniff("ie") === 8)
               {
                  // Need to use "after" rather than "before" for IE8...
                  aspect.after(widget, "onClick", lang.hitch(this, this.hide));
               }
               else
               {
                  aspect.before(widget, "onClick", lang.hitch(this, this.hide));
               }
            }
         }
      }
   });
});