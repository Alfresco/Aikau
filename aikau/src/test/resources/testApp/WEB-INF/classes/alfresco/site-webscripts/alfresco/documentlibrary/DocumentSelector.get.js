model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true,
               warn: true,
               error: true
            }
         }
      }
   ],
   widgets: [
      {
         name: "alfresco/layout/VerticalWidgets",
         config: {
            widgets: [
               {
                  id: "TOOLBAR",
                  name: "alfresco/documentlibrary/AlfToolbar",
                  config: {
                     widgets: [
                        {
                           id: "MENUBAR",
                           name: "alfresco/menus/AlfMenuBar",
                           align: "left",
                           config: {
                              widgets: [
                                 {
                                    id: "SELECTED_ITEMS",
                                    name: "alfresco/documentlibrary/AlfSelectDocumentListItems"
                                 }
                              ]
                           }
                        }
                     ]
                  }
               },
               {
                  id: "DOCLIST",
                  name: "alfresco/lists/AlfList",
                  config: {
                     useHash: false,
                     currentData: {
                        items: [
                           {
                              name: "Not a container",
                              node: {
                                 displayName: "Not a container",
                                 isContainer: false,
                                 nodeRef: "workspace://SpacesStore/7bb7bfa8-997e-4c55-8bd9-2e5029653bc8"
                              }
                           },
                           {
                              name: "Container",
                              node: {
                                 displayName: "Container",
                                 isContainer: true,
                                 nodeRef: "some://node/2"
                              }
                           },
                           {
                              name: "Another Container",
                              node: {
                                 displayName: "Another Container",
                                 isContainer: true,
                                 nodeRef: "some://node/3"
                              }
                           }
                        ]
                     },
                     widgets: [
                        {
                           id: "VIEW",
                           name: "alfresco/lists/views/AlfListView",
                           config: {
                              additionalCssClasses: "bordered",
                              widgetsForHeader: [
                                    {
                                       name: "alfresco/lists/views/layouts/HeaderCell",
                                       config: {
                                          id: "ID",
                                          label: "Selector"
                                       }
                                    },
                                    {
                                       name: "alfresco/lists/views/layouts/HeaderCell",
                                       config: {
                                          id: "NAME",
                                          label: "Name"
                                       }
                                    },
                                    {
                                       name: "alfresco/lists/views/layouts/HeaderCell",
                                       config: {
                                          id: "OPTION",
                                          label: "Thumbnail (selection only)"
                                       }
                                    },
                                    {
                                       name: "alfresco/lists/views/layouts/HeaderCell",
                                       config: {
                                          id: "OPTION",
                                          label: "Thumbnail (selection plus regular action)"
                                       }
                                    },
                                    {
                                       name: "alfresco/lists/views/layouts/HeaderCell",
                                       config: {
                                          id: "OPTION",
                                          label: "Thumbnail (regular action only)"
                                       }
                                    }
                                 ],
                                 widgets: [
                                 {
                                    id: "ROW",
                                    name: "alfresco/lists/views/layouts/Row",
                                    config: {
                                       widgets: [
                                          {
                                             id: "COL1",
                                             name: "alfresco/lists/views/layouts/Cell",
                                             config: {
                                                widgets:[
                                                   {
                                                      id: "SELECTOR",
                                                      name: "alfresco/renderers/Selector"
                                                   }
                                                ]
                                             }
                                          },
                                          {
                                             id: "COL2",
                                             name: "alfresco/lists/views/layouts/Cell",
                                             config: {
                                                widgets:[
                                                   {
                                                      id: "NAME",
                                                      name: "alfresco/renderers/Property",
                                                      config: {
                                                         propertyToRender: "name"
                                                      }
                                                   }
                                                ]
                                             }
                                          },
                                          {
                                             id: "COL3",
                                             name: "alfresco/lists/views/layouts/Cell",
                                             config: {
                                                widgets:[
                                                   {
                                                      id: "SELECT_THUMBNAIL",
                                                      name: "alfresco/renderers/Thumbnail",
                                                      config: {
                                                         updateOnSelection: true,
                                                         selectOnClick: true,
                                                         onlySelectOnClick: true
                                                      }
                                                   }
                                                ]
                                             }
                                          },
                                          {
                                             id: "COL4",
                                             name: "alfresco/lists/views/layouts/Cell",
                                             config: {
                                                widgets:[
                                                   {
                                                      id: "MIXED_THUMBNAIL",
                                                      name: "alfresco/renderers/Thumbnail",
                                                      config: {
                                                         updateOnSelection: true,
                                                         selectOnClick: true
                                                      }
                                                   }
                                                ]
                                             }
                                          },
                                          {
                                             id: "COL5",
                                             name: "alfresco/lists/views/layouts/Cell",
                                             config: {
                                                widgets:[
                                                   {
                                                      id: "NON_SELECT_THUMBNAIL",
                                                      name: "alfresco/renderers/Thumbnail",
                                                      config: {
                                                         updateOnSelection: false,
                                                         selectOnClick: false
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
                     ]
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/ThumbnailsMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};