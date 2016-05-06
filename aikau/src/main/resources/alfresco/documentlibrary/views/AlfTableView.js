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
 * @module alfresco/documentlibrary/views/AlfTableView
 * @extends module:alfresco/lists/views/AlfListView
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/lists/views/AlfListView"], 
        function(declare, AlfListView) {
   
   return declare([AlfListView], {
      
      /**
       * Returns the name of the view that is used when saving user view preferences.
       * 
       * @instance
       * @returns {string} "simple"
       */
      getViewName: function alfresco_documentlibrary_views_AlfTableView__getViewName() {
         return "table";
      },

      /**
       * The configuration for selecting the view (configured the menu item)
       * @instance
       * @type {object}
       * @property {string|null} label The label or message key for the view (as appears in the menus)
       * @property {string|null} icon"class" The "class" to place next to the label
       */
      viewSelectionConfig: {
         label: "doclist.view.table.label",
         iconClass: "alf-tableview-icon"
      },
      
      /**
       * The view model.
       * 
       * @instance
       * @type {opject}
       */
      widgetsForHeader: [
         {
            id: "TABLE_VIEW_SELECTOR_HEADING",
            name: "alfresco/lists/views/layouts/HeaderCell",
            config: {
               label: "",
               sortable: false
            }
         },
         {
            id: "TABLE_VIEW_INDICATORS_HEADING",
            name: "alfresco/lists/views/layouts/HeaderCell",
            config: {
               label: "",
               sortable: false
            }
         },
         {
            id: "TABLE_VIEW_NAME_HEADING",
            name: "alfresco/lists/views/layouts/HeaderCell",
            config: {
               label: "label.name",
               sortable: true,
               sortValue: "cm:name",
               useHash: "{useHash}"
            }
         },
         {
            id: "TABLE_VIEW_TITLE_HEADING",
            name: "alfresco/lists/views/layouts/HeaderCell",
            config: {
               label: "label.title",
               sortable: true,
               sortValue: "cm:title",
               useHash: "{useHash}"
            }
         },
         {
            id: "TABLE_VIEW_DESCRIPTION_HEADING",
            name: "alfresco/lists/views/layouts/HeaderCell",
            config: {
               label: "label.description",
               sortable: true,
               sortValue: "cm:description",
               useHash: "{useHash}"
            }
         },
         {
            id: "TABLE_VIEW_CREATOR_HEADING",
            name: "alfresco/lists/views/layouts/HeaderCell",
            config: {
               label: "label.creator",
               sortable: true,
               sortValue: "cm:creator",
               useHash: "{useHash}"
            }
         },
         {
            id: "TABLE_VIEW_CREATED_HEADING",
            name: "alfresco/lists/views/layouts/HeaderCell",
            config: {
               label: "label.created",
               sortable: true,
               sortValue: "cm:created",
               useHash: "{useHash}"
            }
         },
         {
            id: "TABLE_VIEW_MODIFIER_HEADING",
            name: "alfresco/lists/views/layouts/HeaderCell",
            config: {
               label: "label.modifier",
               sortable: true,
               sortValue: "cm:modifier",
               useHash: "{useHash}"
            }
         },
         {
            id: "TABLE_VIEW_MODIFIED_HEADING",
            name: "alfresco/lists/views/layouts/HeaderCell",
            config: {
               label: "label.modified",
               sortable: true,
               sortValue: "cm:modified",
               useHash: "{useHash}"
            }
         },
         {
            id: "TABLE_VIEW_ACTIONS_HEADING",
            name: "alfresco/lists/views/layouts/HeaderCell",
            config: {
               label: "",
               sortable: false
            }
         }
      ],


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
                     id: "TABLE_SELECTOR_CELL",
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        additionalCssClasses: "mediumpad",
                        widgets: [
                           {
                              id: "TABLE_SELECTOR",
                              name: "alfresco/renderers/Selector",
                              config: {
                                 itemKey: "node.nodeRef"
                              }
                           }
                        ]
                     }
                  },
                  {
                     id: "TABLE_INDICATORS_CELL",
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        additionalCssClasses: "mediumpad",
                        widgets: [
                           {
                              id: "TABLE_INDICATORS",
                              name: "alfresco/renderers/Indicators"
                           }
                        ]
                     }
                  },
                  {
                     id: "TABLE_NAME_CELL",
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        additionalCssClasses: "mediumpad",
                        widgets: [
                           {
                              id: "TABLE_NAME",
                              name: "alfresco/renderers/InlineEditPropertyLink",
                              config: {
                                 propertyToRender: "node.properties.cm:name",
                                 permissionProperty: "node.permissions.user.Write",
                                 postParam: "prop_cm_name",
                                 renderAsLink: true
                              }
                           }
                        ]
                     }
                  },
                  {
                     id: "TABLE_TITLE_CELL",
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        additionalCssClasses: "mediumpad",
                        widgets: [
                           {
                              id: "TABLE_TITLE",
                              name: "alfresco/renderers/InlineEditProperty",
                              config: {
                                 propertyToRender: "node.properties.cm:title",
                                 permissionProperty: "node.permissions.user.Write",
                                 postParam: "prop_cm_title",
                                 warnIfNotAvailable: true,
                                 warnIfNotAvailableMessage: "no.title.message"
                              }
                           }
                        ]
                     }
                  },
                  {
                     id: "TABLE_DESCRIPTION_CELL",
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        additionalCssClasses: "mediumpad",
                        widgets: [
                           {
                              id: "TABLE_DESCRIPTION",
                              name: "alfresco/renderers/InlineEditProperty",
                              config: {
                                 propertyToRender: "node.properties.cm:description",
                                 permissionProperty: "node.permissions.user.Write",
                                 postParam: "prop_cm_description",
                                 warnIfNotAvailable: true,
                                 warnIfNotAvailableMessage: "no.description.message"
                              }
                           }
                        ]
                     }
                  },
                  {
                     id: "TABLE_CREATOR_CELL",
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        additionalCssClasses: "mediumpad",
                        widgets: [
                           {
                              id: "TABLE_CREATOR",
                              name: "alfresco/renderers/PropertyLink",
                              config: {
                                 propertyToRender: "node.properties.cm:creator",
                                 postParam: "prop_cm_creator",
                                 publishTopic: "ALF_NAVIGATE_TO_PAGE",
                                 publishPayloadType: "PROCESS",
                                 publishPayloadModifiers: ["processCurrentItemTokens"],
                                 useCurrentItemAsPayload: false,
                                 publishPayload: {
                                    url: "user/{node.properties.cm:creator.userName}/profile",
                                    type: "PAGE_RELATIVE",
                                    target: "CURRENT"
                                 }
                              }
                           }
                        ]
                     }
                  },
                  {
                     id: "TABLE_CREATED_CELL",
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        additionalCssClasses: "mediumpad",
                        widgets: [
                           {
                              id: "TABLE_CREATED",
                              name: "alfresco/renderers/Property",
                              config: {
                                 propertyToRender: "node.properties.cm:created",
                                 postParam: "prop_cm_created"
                              }
                           }
                        ]
                     }
                  },
                  {
                     id: "TABLE_MODIFIER_CELL",
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        additionalCssClasses: "mediumpad",
                        widgets: [
                           {
                              id: "TABLE_MODIFIER",
                              name: "alfresco/renderers/PropertyLink",
                              config: {
                                 propertyToRender: "node.properties.cm:modifier",
                                 postParam: "prop_cm_modifier",
                                 publishTopic: "ALF_NAVIGATE_TO_PAGE",
                                 publishPayloadType: "PROCESS",
                                 publishPayloadModifiers: ["processCurrentItemTokens"],
                                 useCurrentItemAsPayload: false,
                                 publishPayload: {
                                    url: "user/{node.properties.cm:creator.userName}/profile",
                                    type: "PAGE_RELATIVE",
                                    target: "CURRENT"
                                 }
                              }
                           }
                        ]
                     }
                  },
                  {
                     id: "TABLE_MODIFIED_CELL",
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        additionalCssClasses: "mediumpad",
                        widgets: [
                           {
                              id: "TABLE_MODIFIED",
                              name: "alfresco/renderers/Property",
                              config: {
                                 propertyToRender: "node.properties.cm:modified",
                                 postParam: "prop_cm_modified"
                              }
                           }
                        ]
                     }
                  },
                  {
                     id: "TABLE_ACTIONS_CELL",
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        additionalCssClasses: "mediumpad",
                        widgets: [
                           {
                              id: "TABLE_ACTIONS",
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