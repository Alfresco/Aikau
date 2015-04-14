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
 * <p>The default picker widget for use in [picker form controls]{@link module:alfresco/forms/controls/Picker} and can be
 * extended as necessary to customize the initial set of "root pickers" by overriding the [widgetsForRootPicker attribute]
 * {@link module:alfresco/pickers/Picker#widgetsForRootPicker}. The picked items display can also be customized by
 * overriding the [widgetsForPickedItems attribute]{@link module:alfresco/pickers/Picker#widgetsForPickedItems}.</p>
 *
 * @module alfresco/pickers/Picker
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper & David Webster
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Picker.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/core/ObjectProcessingMixin",
        "dojo/_base/lang"],
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, CoreWidgetProcessing, ObjectProcessingMixin, lang) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing, ObjectProcessingMixin], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {Array}
       */
      i18nRequirements: [{i18nFile: "./i18n/Picker.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Picker.css"}]
       */
      cssRequirements: [{cssFile:"./css/Picker.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * Keeps track of the current picker depth. When a new picker is added it will be given the current depth
       * which will then be incremented. When a picker requests a another picker be added it should include the depth
       * within the request so that deeper pickers (that are no longer relevant) are removed.
       *
       * @instance
       * @type {number}
       * @default 0
       */
      currentPickerDepth: 0,

      /**
       * Used to keep track of the current pickers that are displayed. When a new picker is added it will be added at
       * a depth that is greater than the requesting picker. This means that "deeper" pickers must be destroyed and
       * this is the object that will be referenced to determine which pickers are destroyed
       *
       * @instance
       * @type {object[]}
       * @default null
       */
      currentPickers: null,

      /**
       * This boolean variable should be set to true when the picked items model should be shown and
       * set to false when it shouldn't. Showing picked items is useful for documents but not necessarily
       * for selecting a single folder. It will ensure that the [widgetsForPickedItems]{@link module:alfresco/pickers/Picker#widgetsForPickedItems}
       * model is rendered.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      showPickedItems: true,

      /**
       * This boolean variable is set to true when the picked items model is being rendered and is set
       * back to false once the rendering is complete. This is done so that the pickedItems is only
       * processed once and the root picked item widget is not added to the list of sub-pickers.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      _processsingPickedItems: false,

      /**
       * Override the default widget behaviour to generate a pubSubScope.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      generatePubSubScope: true,

      /**
       * This should be set to the NodeRef to be used to represent the root of the Repository. By default
       * this is "alfresco://company/home" but can be configured to be any other value. This value is used
       * as the root location for the Repository root picker.
       *
       * @instance
       * @type {string}
       * @default "alfresco://company/home"
       */
      repoNodeRef: "alfresco://company/home",

      /**
       *
       *
       * @instance
       */
      postCreate: function alfresco_pickers_Picker__postCreate() {
         // this.pubSubScope = this.generateUuid() + "_";
         this.currentPickers = [];
         this.alfSubscribe("ALF_ADD_PICKER", lang.hitch(this, this.addPicker));

         // If requested, show picked items...
         if (this.showPickedItems === true)
         {
            this._processsingPickedItems = true;
            this.processWidgets(lang.clone(this.widgetsForPickedItems), this.pickedItemsNode);
            if (this.pickedItemsLabel) {
               this.pickedItemsLabelNode.innerHTML = this.message(this.pickedItemsLabel);
            }
         }

         if (this.widgetsForRootPicker !== null)
         {
            var clonedWidgetsForRootPicker = lang.clone(this.widgetsForRootPicker);
            this.processObject(["processInstanceTokens"], clonedWidgetsForRootPicker);
            this.processWidgets(clonedWidgetsForRootPicker, this.subPickersNode);
            if (this.subPickersLabel) {
               this.subPickersLabelNode.innerHTML = this.message(this.subPickersLabel);
            }
         }
      },

      /**
       * Handles a request to add another picker.
       *
       * @instance
       * @param {object} payload
       */
      addPicker: function alfresco_pickers_Picker__addPicker(payload) {

         // Remove any pickers that are "deeper" than the picker requesting the new picker...
         if (payload.currentPickerDepth === undefined)
         {
            this.alfLog("warn", "No 'currentPickerDepth' was provided in a request to add a new picker, so the picker will be appended", payload, this);
         }
         else
         {
            var pickerDepth = payload.currentPickerDepth + 1;
            for (var i=pickerDepth; i < this.currentPickers.length; i++)
            {
               var picker = this.currentPickers[i];
               if (picker !== null && typeof picker.destroyRecursive === "function")
               {
                  picker.destroyRecursive();
               }
            }
            // Remove the elements from the array that have now been destroyed...
            this.currentPickers.splice(pickerDepth, this.currentPickers.length - pickerDepth);
            this.currentPickerDepth = payload.currentPickerDepth;
         }

         // Add the new picker...
         if (payload.picker !== null && payload.picker !== undefined)
         {
            if (payload.picker.config === null || payload.picker.config === undefined)
            {
               payload.picker.config = {};
            }
            payload.picker.config.pickerDepth = this.currentPickerDepth;
            this.processWidgets(payload.picker, this.subPickersNode);
            this.currentPickerDepth++;
         }
         else
         {
            this.alfLog("error", "Error creating a picker: the payload picker is missing a picker object: ", payload);
         }
      },

      /**
       * Publish a request to resize dialogs after new widgets are processed. There is no guarantee that this instance
       * will be in a dialog but if it is then this will ensure that the dialog is resized to contain the new pickers.
       * TODO: Should this be a more abstract "resize" topic?
       *
       * @instance
       * @param {object[]} widgets The instantiated widgets.
       */
      allWidgetsProcessed: function alfresco_pickers_Picker__allWidgetsProcessed(widgets) {

         if (this._processsingPickedItems === true)
         {
            // Reset the _processsingPickedItems flag now that the picked items model has
            // been rendered...
            this._processsingPickedItems = false;
            this.pickedItemsWidget.setPickedItems(this.value);
         }
         else if (widgets === null || widgets.length !== 1)
         {
            this.alfLog("warn", "A single picker widget was expected but " + widgets.length + " were created", widgets, this);
         }
         else
         {
            // Add the picker to the list
            this.currentPickers.push(widgets[0]);
         }

         this.alfPublish("ALF_RESIZE_DIALOG", {});
      },

      /**
       * It is necessary to provide a name attribute so that the data returned from [getValue]{@link module:alfresco/pickers/Picker#getValue}
       * will be mapped to an attribute when used in a [form]{@link module:alfresco/forms/Form}.
       *
       * @instance
       * @type {string}
       * @default "pickedItems"
       */
      name: "pickedItems",

      /**
       * Returns an array of the selected item objects.
       *
       * @instance
       * @returns {object[]} The picked items
       */
      getValue: function alfresco_pickers_Picker__getValue() {
         var value = [];
         if (this.showPickedItems === true)
         {
            if (this.pickedItemsWidget !== null)
            {
               value = this.pickedItemsWidget.currentData.items;
            }
         }
         return value;
      },

      /**
       * The default widgets for the picker. This can be overridden at instantiation based on what is required to be
       * displayed in the picker.
       *
       * @instance
       * @type {object}
       */
      widgetsForRootPicker: [
         {
            name: "alfresco/menus/AlfVerticalMenuBar",
            config: {
               widgets: [
                  {
                     name: "alfresco/menus/AlfMenuBarItem",
                     config: {
                        label: "picker.recentSites.label",
                        publishTopic: "ALF_ADD_PICKER",
                        publishPayload: {
                           currentPickerDepth: 0,
                           picker: [
                              {
                                 name: "alfresco/pickers/SingleItemPicker",
                                 config: {
                                    currentPickerDepth: 1,
                                    requestItemsTopic: "ALF_GET_RECENT_SITES"
                                 }
                              }
                           ]
                        }
                     }
                  },
                  {
                     name: "alfresco/menus/AlfMenuBarItem",
                     config: {
                        label: "picker.favouriteSites.label",
                        publishTopic: "ALF_ADD_PICKER",
                        publishPayload: {
                           currentPickerDepth: 0,
                           picker: [
                              {
                                 name: "alfresco/pickers/SingleItemPicker",
                                 config: {
                                    currentPickerDepth: 1,
                                    requestItemsTopic: "ALF_GET_FAVOURITE_SITES"
                                 }
                              }
                           ]
                        }
                     }
                  },
                  {
                     name: "alfresco/menus/AlfMenuBarItem",
                     config: {
                        label: "picker.allSites.label",
                        publishTopic: "ALF_ADD_PICKER",
                        publishPayload: {
                           currentPickerDepth: 0,
                           picker: [
                              {
                                 name: "alfresco/pickers/SingleItemPicker",
                                 config: {
                                    currentPickerDepth: 1,
                                    requestItemsTopic: "ALF_GET_SITES"
                                 }
                              }
                           ]
                        }
                     }
                  },
                  {
                     name: "alfresco/menus/AlfMenuBarItem",
                     config: {
                        label: "picker.repository.label",
                        publishTopic: "ALF_ADD_PICKER",
                        publishPayload: {
                           currentPickerDepth: 0,
                           picker: [
                              {
                                 name: "alfresco/pickers/DocumentListPicker",
                                 config: {
                                    nodeRef: "{repoNodeRef}",
                                    path: "/"
                                 }
                              }
                           ]
                        }
                     }
                  },
                  {
                     name: "alfresco/menus/AlfMenuBarItem",
                     config: {
                        label: "picker.sharedFiles.label",
                        publishTopic: "ALF_ADD_PICKER",
                        publishPayload: {
                           currentPickerDepth: 0,
                           picker: [
                              {
                                 name: "alfresco/pickers/DocumentListPicker",
                                 config: {
                                    nodeRef: "alfresco://company/shared",
                                    filter: {
                                       path: "/"
                                    }
                                 }
                              }
                           ]
                        }
                     }
                  },
                  {
                     name: "alfresco/menus/AlfMenuBarItem",
                     config: {
                        label: "picker.myFiles.label",
                        publishOnRender: true, // Topic will be published when the item is rendered.
                        publishPayload: {
                           currentPickerDepth: 0,
                           picker: [
                              {
                                 name: "alfresco/pickers/DocumentListPicker",
                                 config: {
                                    nodeRef: "alfresco://user/home",
                                    path: "/"
                                 }
                              }
                           ]
                        }
                     }
                  }
               ]
            }
         }
      ],

      /**
       * This is the widget model for displaying picked items. It will only be displayed when
       * requested.
       *
       * @instance
       * @type {object}
       * @default
       */
      widgetsForPickedItems: [
         {
            name: "alfresco/pickers/PickedItems",
            assignTo: "pickedItemsWidget"
         }
      ],

      /**
       * This is the label to display above the picker.
       *
       * @instance
       * @type {string}
       * @default "picker.subPickers.label"
       */
      subPickersLabel: "picker.subPickers.label",

      /**
       * This is the label to display above the picked items.
       *
       * @instance
       * @type {string}
       * @default "picker.pickedItems.label"
       */
      pickedItemsLabel: "picker.pickedItems.label"
   });
});