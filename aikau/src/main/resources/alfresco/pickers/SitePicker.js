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
 * @module alfresco/pickers/SitePicker
 * @extends module:alfresco/pickers/Picker
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/pickers/Picker",
        "alfresco/core/topics"],
        function(declare, Picker, topics) {

   var sitesView = {
      name: "alfresco/lists/views/AlfListView",
      config: {
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
                                    propertyToRender: "title"
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
   };

   return declare([Picker], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {Array}
       */
      i18nRequirements: [{i18nFile: "./i18n/SitePicker.properties"}],

      /**
       * Whether to select multiple sites in the picker or just one
       *
       * @instance
       * @type {boolean}
       * @default
       */
      singleItemMode: true,

      /**
       *
       * @instance
       */
      postCreate: function alfresco_pickers_SitePicker__postCreate() {
         // Instantiate this widget block after create so we can pass through the singleItemMode
         this.widgetsForPickedItems = [{
            name: "alfresco/pickers/PickedItems",
            assignTo: "pickedItemsWidget",
            config: {
               singleItemMode: this.singleItemMode,
               itemKey: "shortName",
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
         }];
         this.pickedItemsLabel = this.singleItemMode ? "sitePicker.pickedItems.single" : "sitePicker.pickedItems.multi";
         this.subPickersLabel = "sitePicker.category";
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
                     config: {
                        label: "picker.recentSites.label",
                        publishTopic: "ALF_ADD_PICKER",
                        publishPayload: {
                           currentPickerDepth: 0,
                           pickerLabel: "RecentSites",
                           picker: [
                              {
                                 name: "alfresco/lists/AlfSortablePaginatedList",
                                 config: {
                                    noDataMessage: "sitePicker.list.noSitesFound",
                                    dataFailureMessage: "sitePicker.list.errorLoadingSites",
                                    itemsProperty: "",
                                    loadDataPublishTopic: topics.GET_RECENT_SITES,
                                    waitForPageWidgets: false,
                                    widgets: [sitesView]
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
                           pickerLabel: "FavouriteSites",
                           picker: [
                              {
                                 name: "alfresco/lists/AlfSortablePaginatedList",
                                 config: {
                                    noDataMessage: "sitePicker.list.noSitesFound",
                                    dataFailureMessage: "sitePicker.list.errorLoadingSites",
                                    itemsProperty: "",
                                    loadDataPublishTopic: topics.GET_FAVOURITE_SITES,
                                    waitForPageWidgets: false,
                                    widgets: [sitesView]
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
                           pickerLabel: "AllSites",
                           picker: [
                              {
                                 name: "alfresco/lists/AlfSortablePaginatedList",
                                 config: {
                                    noDataMessage: "sitePicker.list.noSitesFound",
                                    dataFailureMessage: "sitePicker.list.errorLoadingSites",
                                    itemsProperty: "",
                                    loadDataPublishTopic: "ALF_GET_SITES",
                                    waitForPageWidgets: false,
                                    widgets: [sitesView]
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