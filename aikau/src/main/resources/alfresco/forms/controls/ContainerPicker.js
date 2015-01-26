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
 * <p>Extends the standard [picker form control]{@link module:alfresco/forms/controls/Picker} to allow the user to select containers
 * (essentially folders) from the Alfresco repository.</p>
 *
 * <p>TODO: Update so that this is configurable for only selecting containers the user has write permission on</p>
 *
 * @module alfresco/forms/controls/ContainerPicker
 * @extends module:alfresco/forms/controls/Picker
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["alfresco/forms/controls/Picker",
        "dojo/_base/declare"],
        function(Picker, declare) {

   return declare([Picker], {

      /**
       * This should be overridden to define the widget model for rendering the picker that appears within the
       * dialog.
       *
       * @instance
       * @type {object}
       * @default []
       */
      configForPicker: {
         generatePubSubScope: true,
         widgetsForPickedItems: [
            {
               name: "alfresco/pickers/PickedItems",
               assignTo: "pickedItemsWidget"
            }
         ],
         widgetsForRootPicker: [
            {
               name: "alfresco/menus/AlfVerticalMenuBar",
               config: {
                  widgets: [
                     {
                        name: "alfresco/menus/AlfMenuBarItem",
                        config: {
                           label: "picker.myFiles.label",
                           publishTopic: "ALF_ADD_PICKER",
                           publishOnRender: "true",
                           publishPayload: {
                              currentPickerDepth: 0,
                              picker: [
                                 {
                                    name: "alfresco/pickers/ContainerListPicker",
                                    config: {
                                       nodeRef: "alfresco://user/home",
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
                                    name: "alfresco/pickers/ContainerListPicker",
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
                           label: "picker.repository.label",
                           publishTopic: "ALF_ADD_PICKER",
                           publishPayload: {
                              currentPickerDepth: 0,
                              picker: [
                                 {
                                    name: "alfresco/pickers/ContainerListPicker",
                                    config: {
                                       nodeRef: "alfresco://company/home",
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
                           label: "picker.recentSites.label",
                           publishTopic: "ALF_ADD_PICKER",
                           publishPayload: {
                              currentPickerDepth: 0,
                              picker: [
                                 {
                                    name: "alfresco/pickers/SingleItemPicker",
                                    config: {
                                       currentPickerDepth: 1,
                                       widgetsForSubPicker: [
                                          {
                                             name: "alfresco/pickers/ContainerListPicker",
                                             config: {
                                                siteMode: true,
                                                libraryRoot: "{siteNodeRef}",
                                                nodeRef: "{siteNodeRef}",
                                                path: "/"
                                             }
                                          }
                                       ],
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
                                       widgetsForSubPicker: [
                                          {
                                             name: "alfresco/pickers/ContainerListPicker",
                                             config: {
                                                siteMode: true,
                                                libraryRoot: "{siteNodeRef}",
                                                nodeRef: "{siteNodeRef}",
                                                path: "/"
                                             }
                                          }
                                       ],
                                       requestItemsTopic: "ALF_GET_FAVOURITE_SITES"
                                    }
                                 }
                              ]
                           }
                        }
                     }
                  ]
               }
            }
         ]
      }
   });
});