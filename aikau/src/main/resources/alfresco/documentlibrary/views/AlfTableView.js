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
 * 
 * @module alfresco/documentlibrary/views/AlfTableView
 * @extends module:alfresco/lists/views/AlfListView
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/lists/views/AlfListView"], 
        function(declare, AlfDocumentListView) {
   
   return declare([AlfDocumentListView], {
      
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
      
      widgetsForHeader: [
         {
            name: "alfresco/lists/views/layouts/HeaderCell",
            config: {
               label: "",
               sortable: false
            }
         },
         {
            name: "alfresco/lists/views/layouts/HeaderCell",
            config: {
               label: "",
               sortable: false
            }
         },
         {
            name: "alfresco/lists/views/layouts/HeaderCell",
            config: {
               label: "label.name",
               sortable: true,
               sortValue: "cm:name"
            }
         },
         {
            name: "alfresco/lists/views/layouts/HeaderCell",
            config: {
               label: "label.title",
               sortable: true,
               sortValue: "cm:title"
            }
         },
         {
            name: "alfresco/lists/views/layouts/HeaderCell",
            config: {
               label: "label.description",
               sortable: true,
               sortValue: "cm:description"
            }
         },
         {
            name: "alfresco/lists/views/layouts/HeaderCell",
            config: {
               label: "label.creator",
               sortable: true,
               sortValue: "cm:creator"
            }
         },
         {
            name: "alfresco/lists/views/layouts/HeaderCell",
            config: {
               label: "label.created",
               sortable: true,
               sortValue: "cm:created"
            }
         },
         {
            name: "alfresco/lists/views/layouts/HeaderCell",
            config: {
               label: "label.modifier",
               sortable: true,
               sortValue: "cm:modifier"
            }
         },
         {
            name: "alfresco/lists/views/layouts/HeaderCell",
            config: {
               label: "label.modified",
               sortable: true,
               sortValue: "cm:modified"
            }
         },
         {
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
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        additionalCssClasses: "mediumpad",
                        widgets: [
                           {
                              name: "alfresco/renderers/Selector"
                           }
                        ]
                     }
                  },
                  {
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        additionalCssClasses: "mediumpad",
                        widgets: [
                           {
                              name: "alfresco/renderers/Indicators"
                           }
                        ]
                     }
                  },
                  {
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        additionalCssClasses: "mediumpad",
                        widgets: [
                           {
                              name: "alfresco/renderers/InlineEditPropertyLink",
                              config: {
                                 propertyToRender: "node.properties.cm:name",
                                 postParam: "prop_cm_name",
                                 renderAsLink: true
                              }
                           }
                        ]
                     }
                  },
                  {
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        additionalCssClasses: "mediumpad",
                        widgets: [
                           {
                              name: "alfresco/renderers/InlineEditProperty",
                              config: {
                                 propertyToRender: "node.properties.cm:title",
                                 postParam: "prop_cm_title"
                              }
                           }
                        ]
                     }
                  },
                  {
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        additionalCssClasses: "mediumpad",
                        widgets: [
                           {
                              name: "alfresco/renderers/InlineEditProperty",
                              config: {
                                 propertyToRender: "node.properties.cm:description",
                                 postParam: "prop_cm_description"
                              }
                           }
                        ]
                     }
                  },
                  {
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        additionalCssClasses: "mediumpad",
                        widgets: [
                           {
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
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        additionalCssClasses: "mediumpad",
                        widgets: [
                           {
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
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        additionalCssClasses: "mediumpad",
                        widgets: [
                           {
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
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        additionalCssClasses: "mediumpad",
                        widgets: [
                           {
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
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        additionalCssClasses: "mediumpad",
                        widgets: [
                           {
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