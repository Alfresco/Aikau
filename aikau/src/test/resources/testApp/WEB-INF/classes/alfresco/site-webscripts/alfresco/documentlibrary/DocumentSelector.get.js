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
      },
      "alfresco/services/ErrorReporter"
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
                              jsNode: {
                                 isContainer: false
                              }
                           },
                           {
                              name: "Container",
                              jsNode: {
                                 isContainer: true
                              }
                           },
                           {
                              name: "Another Container",
                              jsNode: {
                                 isContainer: true
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
                              widgets: [
                                 {
                                    name: "alfresco/lists/views/layouts/Row",
                                    config: {
                                       widgets: [
                                          {
                                             name: "alfresco/lists/views/layouts/Cell",
                                             config: {
                                                widgets:[
                                                   {
                                                      name: "alfresco/renderers/Selector"
                                                   },
                                                   {
                                                      name: "alfresco/renderers/Property",
                                                      config: {
                                                         propertyToRender: "name"
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
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};