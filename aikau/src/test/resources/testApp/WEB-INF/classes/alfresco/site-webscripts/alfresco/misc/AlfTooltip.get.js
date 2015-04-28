model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true
            }
         }
      },
      "alfresco/services/DocumentService"
   ],
   widgets: [
      {
         id: "WINDOW",
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Single tooltip",
            widgets: [
               {
                  id: "SINGLE_ITEM",
                  name: "alfresco/misc/AlfTooltip",
                  config: {
                     widgets: [
                        {
                           id: "LOGO1",
                           name: "alfresco/logo/Logo"
                        }
                     ],
                     widgetsForTooltip: [
                        {
                           id: "LABEL1",
                           name: "alfresco/html/Label",
                           config: {
                              label: "This is the tooltip content"
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         id: "LIST_WINDOW",
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "List of tooltips",
            widgets: [
               {
                  id: "LIST1",
                  name: "alfresco/lists/AlfList",
                  config: {
                     currentData: {
                        items: [
                           {
                              name: "one",
                              description: "the first"
                           },
                           {
                              name: "two",
                              description: "the second"
                           }
                        ]
                     },
                     widgets: [
                        {
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
                                                      name: "alfresco/misc/AlfTooltip",
                                                      config: {
                                                         widgets: [
                                                            {
                                                               name: "alfresco/renderers/Property",
                                                               config: {
                                                                  propertyToRender: "name"
                                                               }
                                                            }
                                                         ],
                                                         widgetsForTooltip: [
                                                            {
                                                               name: "alfresco/renderers/Property",
                                                               config: {
                                                                  propertyToRender: "description"
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
               }
            ]
         }
      },
      {
         id: "LIST_WITH_XHR",
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "List of tooltips that make XHR request for data",
            widgets: [
               {
                  id: "LIST2",
                  name: "alfresco/lists/AlfList",
                  config: {
                     currentData: {
                        items: [
                           {
                              name: "one",
                              nodeRef: "workspace://SpacesStore/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4"
                           }
                        ]
                     },
                     widgets: [
                        {
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
                                                      name: "alfresco/misc/AlfTooltip",
                                                      config: {
                                                         widgets: [
                                                            {
                                                               name: "alfresco/renderers/Property",
                                                               config: {
                                                                  propertyToRender: "name"
                                                               }
                                                            }
                                                         ],
                                                         widgetsForTooltip: [
                                                            {
                                                               name: "alfresco/documentlibrary/AlfDocument",
                                                               config: {
                                                                  xhrRequired: true,
                                                                  rawData: false,
                                                                  widgets: [
                                                                     {
                                                                        name: "alfresco/renderers/Property",
                                                                        config: {
                                                                           propertyToRender: "displayName",
                                                                           renderOnNewLine: true
                                                                        }
                                                                     },
                                                                     {
                                                                        name: "alfresco/renderers/Thumbnail",
                                                                        config: {
                                                                           renditionName: "imgpreview",
                                                                           width: "300px"
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
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/PreviewMockXhr"
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};