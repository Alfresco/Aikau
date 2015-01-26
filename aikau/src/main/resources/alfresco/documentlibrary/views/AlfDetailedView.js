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
 * @module alfresco/documentlibrary/views/AlfDetailedView
 * @extends module:alfresco/documentlibrary/views/AlfDocumentListView
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/documentlibrary/views/AlfDocumentListView"], 
        function(declare, AlfDocumentListView, template) {
   
   return declare([AlfDocumentListView], {
      
      /**
       * By default the detailed view should have no borders
       *
       * @instance
       * @type {string}
       * @default "no-borders"
       */
      additionalCssClasses: "no-borders",

      /**
       * The configuration for selecting the view (configured the menu item)
       * @instance
       * @type {object}
       * @property {string|null} label The label or message key for the view (as appears in the menus)
       * @property {string|null} iconClass The class to place next to the label
       */
      viewSelectionConfig: {
         label: "doclist.view.detailed.label",
         iconClass: "alf-detailedlist-icon"
      },
      
      /**
       * Returns the name of the view that is used when saving user view preferences.
       * 
       * @instance
       * @returns {string} "detailed"
       */
      getViewName: function alfresco_documentlibrary_views_AlfDocumentListView__getViewName() {
         return "detailed";
      },
      
      /**
       * The definition of how a single item is represented in the view. 
       * 
       * @instance
       * @type {object[]}
       */
      widgets: [
         {
            name: "alfresco/documentlibrary/views/layouts/Row",
            config: {
               generatePubSubScope: true,
               widgets: [
                  {
                     name: "alfresco/documentlibrary/views/layouts/Cell",
                     config: {
                        width: "16px",
                        widgets: [
                           {
                              name: "alfresco/renderers/Selector",
                              config: {
                                 publishGlobal: false,
                                 publishToParent: true
                              }
                           }
                        ]
                     }
                  },
                  {
                     name: "alfresco/documentlibrary/views/layouts/Cell",
                     config: {
                        width: "16px",
                        widgets: [
                           {
                              name: "alfresco/renderers/Indicators"
                           }
                        ]
                     }
                  },
                  {
                     name: "alfresco/documentlibrary/views/layouts/Cell",
                     config: {
                        width: "100px",
                        widgets: [
                           {
                              name: "alfresco/renderers/Thumbnail",
                              config: {
                                 showDocumentPreview: true,
                                 publishGlobal: false,
                                 publishToParent: true
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
                              name: "alfresco/documentlibrary/views/layouts/Column",
                              config: {
                                 widgets: [
                                    {
                                       name: "alfresco/documentlibrary/views/layouts/Cell",
                                       config: {
                                          widgets: [
                                             {
                                                name: "alfresco/renderers/LockedBanner"
                                             }
                                          ]
                                       }
                                    },
                                    {
                                       name: "alfresco/documentlibrary/views/layouts/Cell",
                                       config: {
                                          widgets: [
                                             {
                                                name: "alfresco/renderers/InlineEditPropertyLink",
                                                config: {
                                                   propertyToRender: "node.properties.cm:name",
                                                   postParam: "prop_cm_name",
                                                   renderSize: "large"
                                                }
                                             },
                                             {
                                                name: "alfresco/renderers/InlineEditProperty",
                                                config: {
                                                   propertyToRender: "node.properties.cm:title",
                                                   postParam: "prop_cm_title",
                                                   renderedValuePrefix: "(",
                                                   renderedValueSuffix: ")",
                                                   renderFilter: [
                                                      {
                                                         property: "node.properties.cm:title",
                                                         values: [""],
                                                         negate: true
                                                      }
                                                   ]
                                                }
                                             },
                                             {
                                                name: "alfresco/renderers/Version",
                                                config: {
                                                   onlyShowOnHover: true,
                                                   renderFilter: [
                                                      {
                                                         property: "node.isContainer",
                                                         values: [false]
                                                      },
                                                      {
                                                         property: "workingCopy.isWorkingCopy",
                                                         values: [false],
                                                         renderOnAbsentProperty: true
                                                      }
                                                   ]
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
                                                name: "alfresco/renderers/Date"
                                             },
                                             {
                                                name: "alfresco/renderers/Size",
                                                config: {
                                                   renderFilter: [
                                                      {
                                                         property: "node.isContainer",
                                                         values: [false]
                                                      }
                                                   ]
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
                                                name: "alfresco/renderers/InlineEditProperty",
                                                config: {
                                                   propertyToRender: "node.properties.cm:description",
                                                   postParam: "prop_cm_description",
                                                   warnIfNotAvailable: true,
                                                   warnIfNoteAvailableMessage: "no.description.message"
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
                                                name: "alfresco/renderers/Tags",
                                                config: {
                                                   propertyToRender: "node.properties.cm:taggable",
                                                   postParam: "prop_cm_taggable",
                                                   warnIfNotAvailable: true,
                                                   warnIfNoteAvailableMessage: "no.tags.message",
                                                   renderFilter: [
                                                      {
                                                         property: "workingCopy.isWorkingCopy",
                                                         values: [false],
                                                         renderOnAbsentProperty: true
                                                      }
                                                   ]
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
                                                name: "alfresco/renderers/Category",
                                                config: {
                                                   renderFilter: [
                                                      {
                                                         property: "node.properties.cm:categories",
                                                         renderOnAbsentProperty: true,
                                                         values: [],
                                                         negate: true
                                                      }
                                                   ]
                                                }
                                             }
                                          ]
                                       }
                                    },
                                    {
                                       name: "alfresco/documentlibrary/views/layouts/Cell",
                                       config: {
                                          renderFilter: [
                                             {
                                                property: "workingCopy.isWorkingCopy",
                                                values: [false],
                                                renderOnAbsentProperty: true
                                             }
                                          ],
                                          widgets: [
                                             {
                                                name: "alfresco/renderers/Favourite"
                                             },
                                             {
                                                name: "alfresco/renderers/Separator"
                                             },
                                             {
                                                name: "alfresco/renderers/Like"
                                             },
                                             {
                                                name: "alfresco/renderers/Separator"
                                             },
                                             {
                                                name: "alfresco/renderers/Comments",
                                                config: {
                                                   subscriptionTopic: "ALF_COMMENTS_LOADED",
                                                   publishTopic: "ALF_REVEAL_COMMENTS",
                                                   publishPayload: {
                                                   }
                                                }
                                             },
                                             {
                                                name: "alfresco/renderers/Separator",
                                                config: {
                                                   renderFilter: [
                                                      {
                                                         property: "node.isContainer",
                                                         values: [false]
                                                      }
                                                   ]
                                                }
                                             },
                                             {
                                                name: "alfresco/renderers/QuickShare",
                                                config: {
                                                   renderFilter: [
                                                      {
                                                         property: "node.isContainer",
                                                         values: [false]
                                                      }
                                                   ]
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
                                                name: "alfresco/layout/VerticalReveal",
                                                config: {
                                                   subscriptionTopic: "ALF_REVEAL_COMMENTS",
                                                   widgets: [
                                                      {
                                                         name: "alfresco/renderers/CommentsList"
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
                        ]
                     }
                  },
                  {
                     name: "alfresco/documentlibrary/views/layouts/Cell",
                     config: {
                        width: "100px",
                        widgets: [
                           {
                              name: "alfresco/renderers/Actions",
                              config: {
                                 publishGlobal: false,
                                 publishToParent: true
                              }
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