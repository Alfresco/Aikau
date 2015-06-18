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
         name: "alfresco/documentlibrary/AlfDocumentList",
         config: {
            siteId: "site1", 
            containerId: "documentlibrary", 
            rootNode: null, 
            widgets: [
               {
                  name: "alfresco/lists/views/AlfListView",
                  config: {
                     widgetsForHeader: [
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              label: "REST API Action Only"
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              label: "Custom Actions Only"
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              label: "REST API Actions merged with Custom Actions (filtered)"
                           }
                        }
                     ],
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
                                             id: "REST_ACTIONS",
                                             name: "alfresco/renderers/Actions"
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             id: "CUSTOM_ACTIONS",
                                             name: "alfresco/renderers/Actions",
                                             config: {
                                               customActions: [
                                                   {
                                                      id: "CUSTOM1",
                                                      label: "Custom Action 1",
                                                      icon: "document-delete",
                                                      index: "10",
                                                      publishTopic: "DELETE_ACTION_TOPIC",
                                                      type: "javascript"
                                                   },
                                                   {
                                                      id: "CUSTOM2",
                                                      label: "Custom Action 2",
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
                                 },
                                 {
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             id: "MERGED_ACTIONS",
                                             name: "alfresco/renderers/Actions",
                                             config: {
                                                filterActions: true,
                                                mergeActions: true,
                                                allowedActions: [
                                                   "folder-manage-rules",
                                                   "folder-download",
                                                   "folder-view-details",
                                                   "CUSTOM3"
                                                ],
                                                customActions: [
                                                   {
                                                      id: "CUSTOM3",
                                                      label: "Custom Action 3",
                                                      icon: "document-delete",
                                                      index: "10",
                                                      publishTopic: "DELETE_ACTION_TOPIC",
                                                      type: "javascript"
                                                   }
                                                ],
                                                widgetsForActions: [
                                                   {
                                                      name: "alfresco/renderers/actions/ManageAspects"
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
         name: "aikauTesting/mockservices/FullDocLibMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};