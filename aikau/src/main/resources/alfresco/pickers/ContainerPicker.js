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
 *
 * @module alfresco/pickers/ContainerPicker
 * @extends module:alfresco/pickers/Picker
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/pickers/Picker",
        "alfresco/core/topics"],
        function(declare, Picker, topics) {

   var recentSitesPayload = {
      currentPickerDepth: 0,
      pickerLabel: "Sites",
      picker: [
         {
            name: "alfresco/pickers/SingleItemPicker",
            config: {
               currentPickerDepth: 1,
               widgetsForSubPicker: [
                  {
                     name: "alfresco/navigation/PathTree",
                     config: {
                        showRoot: false,
                        rootNode: "{siteNodeRef}",
                        filterPaths: ["^/documentLibrary/(.*)$"],
                        publishTopic: "ALF_ITEM_SELECTED"
                     }
                  }
               ],
               requestItemsTopic: topics.GET_RECENT_SITES
            }
         }
      ]
   };

   return declare([Picker], {

      /**
       * An array of publications that will be published when the picker is ready. By default there
       * are none specified.
       * 
       * @instance
       * @type {object}
       * @default
       * @since 1.0.85
       */
      publishOnReady: [{
         publishTopic: "ALF_ADD_PICKER",
         publishPayload: recentSitesPayload
      }],

      /**
       * Removes the hidden menu bar items from the widgetForRootPicker
       *
       * @private
       */
      _removeHiddenViewModes: function alfresco_pickers_ContainerPicker__filterViewModes() {
         var hiddenViewModes,
            menuBarItemWidgets = this.widgetsForRootPicker[0].config.widgets;

         /* global Alfresco */
         if (Alfresco && Alfresco.constants && Alfresco.constants.HIDDEN_PICKER_VIEW_MODES) {
            hiddenViewModes = Alfresco.constants.HIDDEN_PICKER_VIEW_MODES;
         } else {
            hiddenViewModes = [];
         }

         if (hiddenViewModes.length > 0) {
            menuBarItemWidgets = menuBarItemWidgets.filter(function (menuBarItemWidget) {
               return hiddenViewModes.indexOf(menuBarItemWidget.viewMode) === -1;
            });
         }

         this.widgetsForRootPicker[0].config.widgets = menuBarItemWidgets;
      },

      /**
       *
       * @instance
       */
      postCreate: function alfresco_pickers_ContainerPicker__postCreate() {
         // Instantiate this widget block after create so we can pass through the singleItemMode
         this.widgetsForPickedItems = [{
            name: "alfresco/pickers/PickedItems",
            assignTo: "pickedItemsWidget",
            config: {
               singleItemMode: this.singleItemMode,
               widgets: [
                  {
                     name: "alfresco/lists/views/layouts/Row",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/lists/views/layouts/Cell",
                              config: {
                                 width: "20px",
                                 widgets: [
                                    {
                                       name: "alfresco/renderers/FileType",
                                       config: {
                                          size: "small",
                                          renderAsLink: false,
                                          currentItem: {
                                             node: {
                                                type: "cm:folder",
                                                nodeRef: "dummy://data/value"
                                             }
                                          }
                                       }
                                    }
                                 ]
                              }
                           },
                           {
                              name: "alfresco/lists/views/layouts/Cell",
                              config: {
                                 widgets: [
                                    {
                                       name: "alfresco/renderers/Property",
                                       config: {
                                          propertyToRender: "name",
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
         }];

         // Remove the menu bar items that should be hidden from the widgetsForRootPicker
         this._removeHiddenViewModes();

         this.inherited(arguments);
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
                     viewMode: "VIEW_MODE_RECENT_SITES",
                     config: {
                        label: "picker.recentSites.label",
                        publishTopic: "ALF_ADD_PICKER",
                        publishPayload: recentSitesPayload
                     }
                  },
                  {
                     name: "alfresco/menus/AlfMenuBarItem",
                     viewMode: "VIEW_MODE_FAVOURITE_SITES",
                     config: {
                        label: "picker.favouriteSites.label",
                        publishTopic: "ALF_ADD_PICKER",
                        publishPayload: {
                           currentPickerDepth: 0,
                           pickerLabel: "Sites",
                           picker: [
                              {
                                 name: "alfresco/pickers/SingleItemPicker",
                                 config: {
                                    currentPickerDepth: 1,
                                    widgetsForSubPicker: [
                                       {
                                          name: "alfresco/navigation/PathTree",
                                          config: {
                                             showRoot: false,
                                             rootNode: "{siteNodeRef}",
                                             filterPaths: ["^/documentLibrary/(.*)$"],
                                             publishTopic: "ALF_ITEM_SELECTED"
                                          }
                                       }
                                    ],
                                    requestItemsTopic: topics.GET_FAVOURITE_SITES
                                 }
                              }
                           ]
                        }
                     }
                  },
                  {
                     name: "alfresco/menus/AlfMenuBarItem",
                     viewMode: "VIEW_MODE_SITE",
                     config: {
                        label: "picker.allSites.label",
                        publishTopic: "ALF_ADD_PICKER",
                        publishPayload: {
                           currentPickerDepth: 0,
                           pickerLabel: "Sites",
                           picker: [
                              {
                                 name: "alfresco/pickers/SingleItemPicker",
                                 config: {
                                    currentPickerDepth: 1,
                                    widgetsForSubPicker: [
                                       {
                                          name: "alfresco/navigation/PathTree",
                                          config: {
                                             showRoot: false,
                                             rootNode: "{siteNodeRef}",
                                             filterPaths: ["^/documentLibrary/(.*)$"],
                                             publishTopic: "ALF_ITEM_SELECTED"
                                          }
                                       }
                                    ],
                                    requestItemsTopic: "ALF_GET_SITES"
                                 }
                              }
                           ]
                        }
                     }
                  },
                  {
                     name: "alfresco/menus/AlfMenuBarItem",
                     viewMode: "VIEW_MODE_SHARED",
                     config: {
                        label: "picker.sharedFiles.label",
                        publishTopic: "ALF_ADD_PICKER",
                        publishPayload: {
                           currentPickerDepth: 0,
                           pickerLabel: "Path",
                           picker: [
                              {
                                 name: "alfresco/navigation/PathTree",
                                 config: {
                                    showRoot: true,
                                    rootLabel: "picker.sharedFiles.label",
                                    rootNode: "alfresco://company/shared",
                                    publishTopic: "ALF_ITEM_SELECTED"
                                 }
                              }
                           ]
                        }
                     }
                  },
                  {
                     name: "alfresco/menus/AlfMenuBarItem",
                     viewMode: "VIEW_MODE_REPOSITORY",
                     config: {
                        label: "picker.repository.label",
                        publishTopic: "ALF_ADD_PICKER",
                        publishPayload: {
                           currentPickerDepth: 0,
                           pickerLabel: "Path",
                           picker: [
                              {
                                 name: "alfresco/navigation/PathTree",
                                 config: {
                                    showRoot: true,
                                    rootLabel: "picker.repository.label",
                                    rootNode: "{repoNodeRef}",
                                    publishTopic: "ALF_ITEM_SELECTED"
                                 }
                              }
                           ]
                        }
                     }
                  },
                  {
                     name: "alfresco/menus/AlfMenuBarItem",
                     viewMode:"VIEW_MODE_USERHOME",
                     config: {
                        label: "picker.myFiles.label",
                        publishTopic: "ALF_ADD_PICKER",
                        publishPayload: {
                           currentPickerDepth: 0,
                           pickerLabel: "Path",
                           picker: [
                              {
                                 name: "alfresco/navigation/PathTree",
                                 config: {
                                    showRoot: true,
                                    rootLabel: "picker.myFiles.label",
                                    rootNode: "alfresco://user/home",
                                    publishTopic: "ALF_ITEM_SELECTED"
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
       * @default []
       */
      widgetsForPickedItems: []
   });
});