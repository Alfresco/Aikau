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
      "alfresco/services/InfiniteScrollService",
      {
         name: "aikauTesting/mockservices/PaginationService",
         config: {
            loadDataSubscriptionTopic: "ALF_RETRIEVE_DOCUMENTS_REQUEST"
         }
      }
   ],
   widgets: [
      {
         id: "SIMULATE_REQUEST_IN_PROGRESS",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Simulate Request In Progress",
            publishTopic: "BLOCK_REQUESTS",
            publishPayload: {
               value: true
            }
         }
      },
      {
         id: "UNBLOCK_REQUESTS",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Stop Blocking",
            publishTopic: "BLOCK_REQUESTS",
            publishPayload: {
               value: false
            }
         }
      },
      {
         name: "alfresco/html/Label",
         config: {
            label: "Blocking requests: "
         }
      },
      {
         name: "alfresco/html/Label",
         config: {
            label: "false",
            subscriptionTopic: "BLOCK_REQUESTS",
            subscriptionPayloadProperty: "value"
         }
      },
      {
         id: "DEFAULT_CONFIG",
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Default page settings",
            widgets: [
               {
                  id: "LIST",
                  name: "aikauTesting/widgets/lists/BlockableSortablePaginatedList",
                  config: {
                     useHash: false,
                     useInfiniteScroll: true,
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
                        }
                     ]
                  }
               }
            ]
         }
      }
   ]
};