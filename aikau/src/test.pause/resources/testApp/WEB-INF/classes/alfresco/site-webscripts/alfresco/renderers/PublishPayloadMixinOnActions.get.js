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
      }
   ],
   widgets:[
      {
         name: "alfresco/lists/views/AlfListView",
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
                  name: "alfresco/lists/views/layouts/HeaderCell",
                  config: {
                     label: "Heading 1"
                  }
               },
               {
                  name: "alfresco/lists/views/layouts/HeaderCell",
                  config: {
                     label: "Heading 2"
                  }
               }
            ],
            widgets:[
               {
                  id: "ROW",
                  name: "alfresco/lists/views/layouts/Row",
                  config: {
                     widgets: [
                        {
                           id: "CELL1",
                           name: "alfresco/lists/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    id: "PROPERTY",
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
                           id: "CELL2",
                           name: "alfresco/lists/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    id: "ACTIONS",
                                    name: "alfresco/renderers/Actions",
                                    config: {
                                       filterActions: false,
                                       customActions: [
                                          {
                                             id: "DELETE",
                                             label: "Delete action",
                                             icon: "document-delete",
                                             index: "10",
                                             publishTopic: "DELETE_ACTION_TOPIC",
                                             type: "javascript"
                                          },
                                          {
                                             id: "MANAGE",
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
         name: "alfresco/logging/DebugLog"
      }
   ]
};