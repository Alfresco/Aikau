/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
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
 * <p>A form control for allowing the user to select sites from the Alfresco repository.</p>
 *
 * @example <caption>Sample usage:</caption>
 * {
 *    name: "alfresco/forms/Form",
 *    config: {
 *       okButtonPublishTopic: "SITES_PICKED",
 *       okButtonLabel: "OK",
 *       widgets: [
 *          {
 *             name: "alfresco/forms/controls/SitePicker",
 *             config: {
 *                id: "SITE_PICKER",
 *                name: "site",
 *                description: "Pick a site, any site",
 *                label: "Site",
 *                singleItemMode: true
 *             }
 *          }
 *       ]
 *    }
 * }
 *
 * @module alfresco/forms/controls/SitePicker
 * @extends module:alfresco/forms/controls/Picker
 * @author Dave Draper
 */
define(["alfresco/forms/controls/Picker",
        "dojo/_base/declare"],
        function(Picker, declare) {

   return declare([Picker], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {Object[]}
       */
      i18nRequirements: [{i18nFile: "./i18n/SitePicker.properties"}],

      /**
       * Overrides the default itemKey to be "shortName"
       *
       * @instance
       * @type {string}
       * @default
       */
      itemKey: "shortName",

      /**
       * Whether to select multiple sites in the picker or just one
       *
       * @instance
       * @type {boolean}
       * @default
       */
      singleItemMode: true,

      /**
       * Overridden widgets model for this control.
       * 
       * @instance
       * @type {object}
       * @default
       * @since 1.0.102
       */
      widgetsForControl : [
         {
            name: "alfresco/layout/VerticalWidgets",
            assignTo: "verticalWidgets",
            config: {
               widgets: [
                  {
                     name: "alfresco/pickers/PickedItems",
                     assignTo: "pickedItemsWidget",
                     config: {
                        pubSubScope: "{itemSelectionPubSubScope}",
                        itemKey: "{itemKey}",
                        widgets: [
                           {
                              name: "alfresco/lists/views/layouts/Row",
                              config: {
                                 widgets: [
                                    {
                                       name: "alfresco/lists/views/layouts/Cell",
                                       config: {
                                          widgets: [
                                             {
                                                name: "alfresco/renderers/Property",
                                                config: {
                                                   propertyToRender: "title",
                                                   renderAsLink: false
                                                }
                                             }
                                          ]
                                       }
                                    },
                                    {
                                       name: "alfresco/lists/views/layouts/Cell",
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
                        ]
                     }
                  },
                  {
                     name: "alfresco/buttons/AlfButton",
                     assignTo: "formDialogButton",
                     config: {
                        additionalCssClasses: "alfresco-forms-controls-Picker__add-button",
                        label: "{selectButtonLabel}",
                        publishTopic: "ALF_CREATE_DIALOG_REQUEST",
                        publishPayload: {
                           dialogTitle: "{selectDialogTitle}",
                           handleOverflow: false,
                           widgetsContent: [
                              {
                                 name: "alfresco/pickers/SitePicker",
                                 config: {
                                    singleItemMode: "{singleItemMode}"
                                 }
                              }
                           ],
                           widgetsButtons: [
                              {
                                 name: "alfresco/buttons/AlfButton",
                                 config: {
                                    label: "picker.ok.label",
                                    publishTopic: "ALF_ITEMS_SELECTED",
                                    pubSubScope: "{itemSelectionPubSubScope}",
                                    additionalCssClasses: "call-to-action"
                                 }
                              },
                              {
                                 name: "alfresco/buttons/AlfButton",
                                 config: {
                                    label: "picker.cancel.label",
                                    publishTopic: "NO_OP"
                                 }
                              }
                           ]
                        },
                        publishGlobal: true
                     }
                  },
                  {
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        label: "{removeButtonLabel}",
                        additionalCssClasses: "cancelButton alfresco-forms-controls-Picker__remove-button",
                        publishTopic: "ALF_ITEMS_SELECTED",
                        publishPayload: {
                           pickedItems: []
                        },
                        pubSubScope: "{itemSelectionPubSubScope}"
                     }
                  }
               ]
            }
         }
      ],
      
      /**
       * The label for the select button of this control.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.102
       */
      selectButtonLabel : null,
      
      /**
       * The title for the pop-up selection dialog of this control.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.102
       */
      selectDialogTitle : null,
      
      /**
       * The label for the remove button of this control.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.102
       */
      removeButtonLabel : null,
      
      /**
       * Processes the singleItemMode and defaults various UI labels in case they have not been configured externally.
       * 
       * @instance
       */
      postMixInProperties : function alfresco_forms_controls_SitePicker__postMixInProperties()
      {
          this.inherited(arguments);
          
          this.selectButtonLabel = this.selectButtonLabel || (this.singleItemMode ? "sitePicker.launchPicker.single" : "sitePicker.launchPicker.multi");
          this.selectDialogTitle = this.selectDialogTitle || (this.singleItemMode ? "sitePicker.pickerTitle.single" : "sitePicker.pickerTitle.multi");
          this.removeButtonLabel = this.removeButtonLabel || (this.singleItemMode ? "sitePicker.removeAll.single" : "sitePicker.removeAll.multi");
      }
   });
});