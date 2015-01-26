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
 * <p>A form control for allowing the user to select documents from the Alfresco repository. It extends the
 * standard [picker form control]{@link module:alfresco/forms/controls/Picker} to show the document
 * picked item display along with the standard document pickers.</p>
 *
 * @module alfresco/forms/controls/DocumentPicker
 * @extends module:alfresco/forms/controls/Picker
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["alfresco/forms/controls/Picker",
        "dojo/_base/declare"],
        function(Picker, declare) {

   return declare([Picker], {

      /**
       * Overrides the default itemKey to be "nodeRef" as this is likely to be the most important attribute
       * when selecting a Document.
       *
       * @instance
       * @type {string}
       * @default "nodeRef"
       */
      itemKey: "nodeRef",

      /**
       * Currently defines exactly the same default widget model as the standard [picker form control]{@link module:alfresco/forms/controls/Picker}
       * so this could be removed, but has been left in case the default picker model should ever change.
       *
       * @instance
       * @type {object}
       * @default
       */
      widgetsForControl: [
         {
            name: "alfresco/layout/VerticalWidgets",
            assignTo: "verticalWidgets",
            config: {
               widgets: [
                  {
                     name: "alfresco/pickers/PickedItems",
                     assignTo: "pickedItemsWidget",
                     config: {
                        pubSubScope: "{itemSelectionPubSubScope}"
                     }
                  },
                  {
                     name: "alfresco/buttons/AlfButton",
                     assignTo: "formDialogButton",
                     config: {
                        label: "picker.add.label",
                        publishTopic: "ALF_CREATE_DIALOG_REQUEST",
                        publishPayload: {
                           dialogTitle: "picker.select.title",
                           handleOverflow: false,
                           widgetsContent: [
                              {
                                 name: "alfresco/pickers/Picker"
                              }
                           ],
                           widgetsButtons: [
                              {
                                 name: "alfresco/buttons/AlfButton",
                                 config: {
                                    label: "picker.ok.label",
                                    publishTopic: "ALF_ITEMS_SELECTED",
                                    pubSubScope: "{itemSelectionPubSubScope}"
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
                        label: "picker.removeAll.label",
                        additionalCssClasses: "cancelButton",
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
      ]
   });
});