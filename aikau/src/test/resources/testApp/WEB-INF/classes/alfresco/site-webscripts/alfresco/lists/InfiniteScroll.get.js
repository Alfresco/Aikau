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
         id: "DEFAULT_CONFIG",
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Default page settings",
            widgets: [
               {
                  id: "LIST",
                  name: "alfresco/lists/AlfSortablePaginatedList",
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