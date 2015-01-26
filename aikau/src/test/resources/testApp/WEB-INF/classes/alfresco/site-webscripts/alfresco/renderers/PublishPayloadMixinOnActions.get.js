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
                  {col1:"Test1", variable1:"red", variable2:"orange"},
                  {col1:"Test2", variable1:"yellow", variable2:"green"},
                  {col1:"Test3", variable1:"blue", variable2:"indigo"}
               ]
            },
            widgetsForHeader: [
               {
                  name: "alfresco/documentlibrary/views/layouts/HeaderCell",
                  config: {
                     label: "Heading 1"
                  }
               },
               {
                  name: "alfresco/documentlibrary/views/layouts/HeaderCell",
                  config: {
                     label: "Heading 2"
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
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "col1",
                                       renderAsLink: false
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
                                    name: "alfresco/renderers/Actions",
                                    config: {
                                       filterActions: false,
                                       customActions: [
                                          {
                                             label: "Delete action",
                                             icon: "document-delete",
                                             index: "10",
                                             publishTopic: "DELETE_ACTION_TOPIC",
                                             type: "javascript"
                                          },
                                          {
                                             label: "Manage action",
                                             icon: "folder-manage-permissions",
                                             index: "10",
                                             publishTopic: "MANAGE_ACTION_TOPIC",
                                             publishPayloadType: "BUILD",
                                             publishPayload: {
                                                payloadVariable1: {
                                                   alfType: "item",
                                                   alfProperty: "variable2"
                                                },
                                                payloadVariable2: {
                                                   alfType: "item",
                                                   alfProperty: "variable1"
                                                }
                                             },
                                             type: "javascript"
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