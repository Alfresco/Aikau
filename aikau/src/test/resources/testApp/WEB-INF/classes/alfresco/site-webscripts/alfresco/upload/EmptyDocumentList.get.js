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
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgetMarginLeft: 10,
            widgetMarginRight: 10,
            widgets: [
               {
                  name: "alfresco/layout/VerticalWidgets",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/html/Heading",
                           config: {
                              level: 3,
                              label: "Empty list (can upload)"
                           }
                        },
                        {
                           name: "alfresco/html/HR",
                           config: {
                              style: "background: #ccc; margin: 0 0 20px; width: 99%;"
                           }
                        },
                        {
                           name: "alfresco/documentlibrary/AlfDocumentList",
                           config: {
                              currentData: [],
                              pubSubScope: "EMPTY_LIST_UPLOAD_",
                              widgets: [
                                 {
                                    name: "alfresco/documentlibrary/views/AlfSimpleView",
                                    config: {
                                       _currentNode: {
                                          parent: {
                                             permissions: {
                                                user: {
                                                   CreateChildren: true
                                                }
                                             }
                                          }
                                       }
                                    }
                                 }
                              ]
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/layout/VerticalWidgets",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/html/Heading",
                           config: {
                              level: 3,
                              label: "Empty list (cannot upload)"
                           }
                        },
                        {
                           name: "alfresco/html/HR",
                           config: {
                              style: "background: #ccc; margin: 0 0 20px; width: 99%;"
                           }
                        },
                        {
                           name: "alfresco/documentlibrary/AlfDocumentList",
                           config: {
                              currentData: [],
                              pubSubScope: "EMPTY_LIST_NO_UPLOAD_",
                              widgets: [
                                 {
                                    name: "alfresco/documentlibrary/views/AlfSimpleView"
                                 }
                              ]
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/layout/VerticalWidgets",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/html/Heading",
                           config: {
                              level: 3,
                              label: "Short list"
                           }
                        },
                        {
                           name: "alfresco/html/HR",
                           config: {
                              style: "background: #ccc; margin: 0 0 20px; width: 99%;"
                           }
                        },
                        {
                           name: "alfresco/documentlibrary/AlfDocumentList",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/documentlibrary/views/AlfSimpleView"
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
         name: "alfresco/testing/NodesMockXhr",
         config: {
            totalItems: 1
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};