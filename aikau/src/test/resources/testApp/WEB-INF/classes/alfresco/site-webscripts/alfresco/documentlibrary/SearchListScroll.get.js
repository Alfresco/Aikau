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
      "alfresco/services/NavigationService",
      "alfresco/services/SearchService",
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/search/AlfSearchList",
         config: {
            useHash: true,
            useInfiniteScroll: true,
            widgets: [
               {
                  name: "alfresco/search/AlfSearchListView",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/lists/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       width: "16px",
                                       widgets: [
                                          {
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "displayName"
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
         name: "alfresco/documentlibrary/AlfDocumentListInfiniteScroll"
      },
      {
         name: "aikauTesting/mockservices/SearchScrollMockXhr"
      },
      {
         name: "alfresco/logging/SubscriptionLog",
         config: {
            topicsToIgnore: ["ALF_RETRIEVE_DOCUMENTS_REQUEST_SUCCESS"]
         }
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};