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
 * The simple view takes up less vertical height than the details view but provides
 * less information on each node.
 *
 * @module alfresco/documentlibrary/views/AlfSimpleView
 * @extends module:alfresco/lists/views/AlfDocumentListView
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/lists/views/AlfDocumentListView"],
        function(declare, AlfDocumentListView) {

   return declare([AlfDocumentListView], {

      /**
       * By default the detailed view should have no borders
       *
       * @instance
       * @type {string}
       * @default
       */
      additionalCssClasses: "no-borders",

      /**
       * Returns the name of the view that is used when saving user view preferences.
       *
       * @instance
       * @returns {string} "simple"
       */
      getViewName: function alfresco_documentlibrary_views_AlfSimpleView__getViewName() {
         return "simple";
      },

      /**
       * The configuration for selecting the view (configured the menu item)
       * @instance
       * @type {object}
       * @property {string|null} label The label or message key for the view (as appears in the menus)
       * @property {string|null} iconClass The class to place next to the label
       */
      viewSelectionConfig: {
         label: "doclist.view.simple.label",
         iconClass: "alf-simplelist-icon"
      },

      /**
       * The definition of how a single item is represented in the view.
       *
       * @instance
       * @type {object[]}
       */
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
                              id: "SIMPLE_VIEW_SELECTOR",
                              name: "alfresco/renderers/Selector",
                              config: {
                                 itemKey: "node.nodeRef"
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
                              id: "SIMPLE_VIEW_INDICATORS",
                              name: "alfresco/renderers/Indicators"
                           }
                        ]
                     }
                  },
                  {
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        widgets: [
                           {
                              id: "SIMPLE_VIEW_THUMBNAIL",
                              name: "alfresco/renderers/SmallThumbnail"
                           }
                        ]
                     }
                  },
                  {
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/lists/views/layouts/Column",
                              config: {
                                 widgets: [
                                    {
                                       name: "alfresco/lists/views/layouts/Cell",
                                       config: {
                                          widgets: [
                                             {
                                                id: "SIMPLE_VIEW_NAME",
                                                name: "alfresco/renderers/InlineEditPropertyLink",
                                                config: {
                                                   propertyToRender: "node.properties.cm:name",
                                                   permissionProperty: "node.permissions.user.Write",
                                                   postParam: "prop_cm_name",
                                                   renderSize: "large"
                                                }
                                             },
                                             {
                                                id: "SIMPLE_VIEW_TITLE",
                                                name: "alfresco/renderers/InlineEditProperty",
                                                config: {
                                                   propertyToRender: "node.properties.cm:title",
                                                   permissionProperty: "node.permissions.user.Write",
                                                   postParam: "prop_cm_title",
                                                   renderSize: "small",
                                                   renderedValuePrefix: "(",
                                                   renderedValueSuffix: ")",
                                                   warnIfNotAvailable: true,
                                                   warnIfNotAvailableMessage: "no.title.message"
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
                                                id: "SIMPLE_VIEW_DATE",
                                                name: "alfresco/renderers/Date"
                                             },
                                             {
                                                id: "SIMPLE_VIEW_SIZE",
                                                name: "alfresco/renderers/Size"
                                             },
                                             {
                                                id: "SIMPLE_VIEW_FAVOURITE",
                                                name: "alfresco/renderers/Favourite"
                                             },
                                             {
                                                name: "alfresco/renderers/Separator"
                                             },
                                             {
                                                id: "SIMPLE_VIEW_LIKE",
                                                name: "alfresco/renderers/Like"
                                             },
                                             {
                                                name: "alfresco/renderers/Separator"
                                             },
                                             {
                                                id: "SIMPLE_VIEW_COMMENTS",
                                                name: "alfresco/renderers/Comments"
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
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        widgets: [
                           {
                              id: "SIMPLE_VIEW_ACTIONS",
                              name: "alfresco/renderers/Actions"
                           }
                        ]
                     }
                  }
               ]
            }
         }
      ]
   });
});