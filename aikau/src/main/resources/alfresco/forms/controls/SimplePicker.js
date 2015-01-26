/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * PLEASE NOTE: This is a BETA quality widget, not intended for production use.
 * 
 * @module alfresco/forms/controls/SimplePicker
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @author Dave Draper
 */
define(["alfresco/forms/controls/BaseFormControl",
        "dojo/_base/declare",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/core/ObjectProcessingMixin",
        "dojo/_base/lang",
        "alfresco/pickers/Picker",
        "alfresco/pickers/PropertyPicker",
        "alfresco/pickers/PickedItems"], 
        function(BaseFormControl, declare, CoreWidgetProcessing, ObjectProcessingMixin, lang, Picker, PropertyPicker, PickedItems) {
   
   return declare([BaseFormControl, CoreWidgetProcessing, ObjectProcessingMixin], {
      
      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_SimplePicker__getWidgetConfig() {
         // Return the configuration for the widget
         return {
            id : this.generateUuid(),
            name: this.name,
            value: this.value
         };
      },
      
      /**
       * @instance
       */
      createFormControl: function alfresco_forms_controls_SimplePicker__createFormControl(config, domNode) {
         this.lastValue = this.value != null ? this.value : [];

         // Create a specific item selection scope to ensure that the picker publications don't interfere
         // with the surrounding forms...
         this.itemSelectionPubSubScope = this.generateUuid();

         var widgetsForControl = null;
         if (this.widgetsForControl == null)
         {
            // Get the widgets for displaying the available items...
            // TODO: Do we need a null check here?
            var widgetsForAvailableItemsView = lang.clone(this.widgetsForAvailableItemsView);
            this.processObject(["processInstanceTokens"], widgetsForAvailableItemsView);

            // Get the widgets for displaying the picked items...
            var widgetsForPickedItemsView = lang.clone(this.widgetsForPickedItemsView);
            this.processObject(["processInstanceTokens"], widgetsForPickedItemsView);

            if (this.reorderable === false || this.singleItemMode === true)
            {
               widgetsForPickedItemsView[0].config.widgets.shift();
            }

            widgetsForControl = [
               {
                  name: "alfresco/pickers/Picker",
                  config: {
                     generatePubSubScope: false,
                     pubSubScope: this.itemSelectionPubSubScope,
                     subPickersLabel: this.availableItemsLabel,
                     pickedItemsLabel: this.pickedItemsLabel,
                     widgetsForRootPicker: [
                        {
                           name: "alfresco/pickers/PropertyPicker",
                           config: {
                              itemsProperty: this.itemsProperty,
                              currentData: this.currentData,
                              loadDataPublishTopic: this.loadDataPublishTopic,
                              loadDataPublishPayload: this.loadDataPublishPayload,
                              publishPickedItemsToParent: false,
                              noDataMessage: this.noItemsMessage != null ? this.noItemsMessage : "alflist.no.data.message",
                              widgets: widgetsForAvailableItemsView
                           }
                        }
                     ],
                     widgetsForPickedItems: [
                        {
                           name: "alfresco/pickers/PickedItems",
                           assignTo: "pickedItemsWidget",
                           config: {
                              itemKey: this.itemKey,
                              widgets: widgetsForPickedItemsView,
                              singleItemMode: this.singleItemMode
                           }
                        }
                     ]
                  }
               }
            ];
         }
         else
         {
            // If widgetsForControl has been defined then use it...
            widgetsForControl = lang.clone(this.widgetsForControl);
            this.processObject(["processInstanceTokens"], widgetsForControl);
         }
         return this.processWidgets(widgetsForControl, this._controlNode);
      },

      /**
       * The picker widgets. Setting this to any value will effectively override the 
       * [widgetsForAvailableItemsView]{@link module:alfresco/forms/controls/SimplePicker#widgetsForAvailableItemsView}
       * and [widgetsForPickedItemsView]{@link module:alfresco/forms/controls/SimplePicker#widgetsForPickedItemsView}
       * configuration.
       * 
       * @instance
       * @type {array}
       * @default null
       */
      widgetsForControl: null,

      /**
       * This is the label to display above the available items.
       *
       * @instance
       * @type {string}
       * @default ""
       */
      availableItemsLabel: "",

      /**
       * This is the label to display above the picked items.
       *
       * @instance
       * @type {string}
       * @default ""
       */
      pickedItemsLabel: "",

      /**
       * This is the value that will be assigned as the value of the [itemsProperty]{@link module:alfresco/lists/AlfList#itemsProperty}
       * of the [list]{@link module:alfresco/lists/AlfList} used to display the items available to be picked.
       *
       * @instance
       * @type {string}
       * @default "items"
       */
      itemsProperty: "items",

      /**
       * This is the message that will be displayed if no items are available for selection. It is set as the [noItemsMessage]
       * {@link module:alfresco/documentlibrary/views/AlfDocumentListView#noItemsMessage} value in the main [view]
       * {@link module:alfresco/documentlibrary/views/AlfDocumentListView} of the [list]{@link module:alfresco/lists/AlfList}
       * of available items.
       *
       * @instance
       * @type {string}
       * @default null
       */
      noItemsMessage: null,

      /**
       * This is the dot-notation attribute within each available item that uniquely identifies it. It is assigned as the value
       * of the [picked items key]{@link module:alfresco/pickers/PickedItems#itemKey} as well as being used in the definition
       * of the dynamic visibility rules for each available option.
       *
       * @instance
       * @type {string}
       * @default "name"
       */
      itemKey: "name",

      /**
       * This is the dot-notation attribute within each available item to be used as a label. It is assigned as the value of
       * the [propertyToRender]{@link module:alfresco/renderers/Property#propertyToRender} in the [list of picked items]
       * {@link module:alfresco/pickers/PickedItems} and the [list]{@link module:alfresco/lists/AlfList} of available items.
       *
       * @instance
       * @type {string}
       * @default "name"
       */
      propertyToRender: "name",

      /**
       * This indicates whether the picker should only allow one item to be picked at a time (selecting a new item when one
       * is already picked will result in the previously picked item being remmoved).
       * 
       * @instance
       * @type {boolean}
       * @default false
       */
      singleItemMode: false,

      /**
       * This is the topic that will be published in order to retrieve the items that are available to be picked.
       *
       * @instance
       * @type {string}
       * @default null
       */
      loadDataPublishTopic: null,

     /**
       * This is the payload  that will be published on the [loadDataPublishTopic]{@link module:alfresco/forms/controls/SimplePicker#loadDataPublishTopic]
       * in order to retrieve the items that are available to be picked.
       *
       * @instance
       * @type {object}
       * @default null
       */
      loadDataPublishPayload: null,

       /**
       * This is the data object containing a list of items that can be picked. It should be used as an alternative to
       * [loadDataPublishTopic]{@link module:alfresco/forms/controls/SimplePicker#loadDataPublishTopic].
       * 
       *
       * @instance
       * @type {string}
       * @default null
       */
      currentData: null,

      /**
       * Indicates whether or not to show the re-ordering controls in the list of picked items.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      reorderable: false,

      /**
       * This is the model to use for rendering the items that are available for selection.
       *
       * @instance
       * @type {object}
       */
      widgetsForAvailableItemsView: [
         {
            name: "alfresco/documentlibrary/views/AlfDocumentListView",
            config: {
               widgets: [
                  {
                     name: "alfresco/documentlibrary/views/layouts/Row",
                     config: {
                        visibilityConfig: {
                           rules: [
                              {
                                 topic: "ALF_ITEM_REMOVED",
                                 attribute: "{itemKey}",
                                 is: ["{itemKey}"],
                                 useCurrentItem: true,
                                 strict: false
                              }
                           ]
                        },
                        invisibilityConfig: {
                           rules: [
                              {
                                 topic: "ALF_ITEM_SELECTED",
                                 attribute: "{itemKey}",
                                 is: ["{itemKey}"],
                                 useCurrentItem: true,
                                 strict: false
                              }
                           ]
                        },
                        widgets: [
                           {
                              name: "alfresco/documentlibrary/views/layouts/Cell",
                              config: {
                                 widgets: [
                                    {
                                       name: "alfresco/renderers/Property",
                                       config: {
                                          propertyToRender: "{propertyToRender}"
                                       }
                                    }
                                 ]
                              }
                           },
                           {
                              name: "alfresco/documentlibrary/views/layouts/Cell",
                              config: {
                                 width: "20px",
                                 widgets: [
                                    {
                                       name: "alfresco/renderers/PublishAction",
                                       config: {
                                          publishPayloadType: "CURRENT_ITEM",
                                          publishGlobal: false,
                                          publishToParent: false
                                       }
                                    }
                                 ]
                              }
                           }
                        ]
                     }
                  }
               ]
            }
         }
      ],

      /**
       * This is the model to use for rendering the items that have been picked.
       *
       * @instance
       * @type {object}
       */
      widgetsForPickedItemsView: [
         {
            name: "alfresco/documentlibrary/views/layouts/Row",
            config: {
               widgets: [
                  {
                     name: "alfresco/documentlibrary/views/layouts/Cell",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/renderers/Reorder",
                              config: {
                                 propertyToRender: "{propertyToRender}",
                                 moveUpPublishTopic: "ALF_ITEM_MOVED_UP",
                                 moveUpPublishPayloadType: "CURRENT_ITEM",
                                 moveDownPublishTopic: "ALF_ITEM_MOVED_DOWN",
                                 moveDownPublishPayloadType: "CURRENT_ITEM"
                              }
                           }
                        ]
                     }
                  },
                  {
                     name: "alfresco/documentlibrary/views/layouts/Cell",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/renderers/Property",
                              config: {
                                 propertyToRender: "{propertyToRender}"
                              }
                           }
                        ]
                     }
                  },
                  {
                     name: "alfresco/documentlibrary/views/layouts/Cell",
                     config: {
                        width: "20px",
                        widgets: [
                           {
                              name: "alfresco/renderers/PublishAction",
                              config: {
                                 iconClass: "delete-16",
                                 publishTopic: "ALF_ITEM_REMOVED",
                                 publishPayloadType: "CURRENT_ITEM"
                              }
                           }
                        ]
                     }
                  }
               ]
            }
         }
      ],
      
      /**
       * Overrides the default change events to use blur events on the text box. This is done so that we can validate
       * on every single keypress. However, we need to keep track of old values as this information is not readily
       * available from the text box itself.
       * 
       * @instance
       */
      setupChangeEvents: function alfresco_forms_controls_SimplePicker__setupChangeEvents() {
         this.alfSubscribe(this.itemSelectionPubSubScope+"ALF_ITEMS_SELECTED", lang.hitch(this, this.onItemsSelected),true);
      },

      /**
       *
       * 
       * @instance
       * @param {object} payload
       */
      onItemsSelected: function alfresco_forms_controls_SimplePicker__onItemsSelected(payload) {
         this.value = lang.clone(payload.pickedItems);
         this.onValueChangeEvent(this.name, this.lastValue, this.value);
         this.lastValue = this.value;
      },

      /**
       * Overides the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#processValidationRules}
       * since the only validation for a picker is if a value is required the length of the value array must
       * not be 0.
       *
       * @instance
       * @returns {boolean} True if not required or is required and value has length greater than zero
       */
      processValidationRules: function alfresco_forms_controls_SimplePicker__processValidationRules() {
         var valid = true;
         if (this._required === true && this.value.length === 0)
         {
            valid = false;
         }
         return valid;
      },

      /**
       * Overides the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#getValue}
       * to get the current picked items value.
       * 
       * @instance
       * @param {object} payload
       */
      getValue: function alfresco_forms_controls_SimplePicker__getValue() {
         return this.value;
      },

      /**
       * Overides the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#setValue}
       * to set the current picked items.
       * 
       * @instance
       * @param {object} payload
       */
      setValue: function alfresco_forms_controls_SimplePicker__setValue(value) {
         this.alfPublish(this.itemSelectionPubSubScope+"ALF_SET_PICKED_ITEMS", {
            pickedItems: value
         }, true);
      }
   });
});