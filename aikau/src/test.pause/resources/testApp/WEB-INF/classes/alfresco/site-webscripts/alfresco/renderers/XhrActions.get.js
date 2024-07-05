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
   widgets:[
      {
         name: "alfresco/lists/views/AlfListView",
         config: {
            subscribeToDocRequests: true,
            currentData: {
               items: [
                  {col1:"Test1", nodeRef:"workspace://SpacesStore/f8394454-0651-48a5-b583-d067c7d03339"},
                  {col1:"Test2", nodeRef:"23456"},
                  {col1:"Test3", nodeRef:"34567"}
               ]
            },
            widgets:[
               {
                  name: "alfresco/lists/views/layouts/Row",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/lists/views/layouts/Cell",
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
                           name: "alfresco/lists/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    id: "XHR_ACTIONS",
                                    name: "alfresco/renderers/XhrActions"
                                 }
                              ]
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    id: "MERGED_XHR_ACTIONS",
                                    name: "alfresco/renderers/XhrActions",
                                    config: {
                                       filterActions: true,
                                       mergeActions: true,
                                       allowedActions: [
                                          "document-delete",
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
      },
      {
         name: "aikauTesting/mockservices/PdfJsMockXhr",
         config: {
            
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};