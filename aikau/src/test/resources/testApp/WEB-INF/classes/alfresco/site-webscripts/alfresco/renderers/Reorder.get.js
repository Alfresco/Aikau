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
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         name: "alfresco/documentlibrary/views/AlfDocumentListView",
         config: {
            subscribeToDocRequests: true,
            currentData: {
               items: [
                  {index:0, name: "First"},
                  {index:1, name: "Middle"},
                  {index:2, name: "Last"}
               ]
            },
            widgetsForHeader: [
               {
                  name: "alfresco/documentlibrary/views/layouts/HeaderCell",
                  config: {
                     label: "Reorder"
                  }
               },
               {
                  name: "alfresco/documentlibrary/views/layouts/HeaderCell",
                  config: {
                     label: "Name"
                  }
               },
               {
                  name: "alfresco/documentlibrary/views/layouts/HeaderCell",
                  config: {
                     label: "Index"
                  }
               }
            ],
            widgets:[
               {
                  name: "alfresco/documentlibrary/views/layouts/Row",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/documentlibrary/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/renderers/Reorder",
                                    config: {
                                       propertyToRender: "name",
                                       moveUpPublishTopic: "ALF_MOVE_UP",
                                       moveUpPublishPayloadType: "PROCESS",
                                       moveUpPublishPayloadModifiers: ["processCurrentItemTokens"],
                                       moveUpPublishPayloadItemMixin: false,
                                       moveUpPublishPayload: {
                                          name: "{name}"
                                       },
                                       moveDownPublishTopic: "ALF_MOVE_DOWN",
                                       moveDownPublishPayloadType: "PROCESS",
                                       moveDownPublishPayloadModifiers: ["processCurrentItemTokens"],
                                       moveDownPublishPayloadItemMixin: false,
                                       moveDownPublishPayload: {
                                          name: "{name}"
                                       }
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
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "name"
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
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "index"
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