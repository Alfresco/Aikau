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
         name: "alfresco/lists/Paginator",
         config: {
            documentsLoadedTopic: "ALF_RETRIEVE_DOCUMENTS_REQUEST_SUCCESS",
            totalResultsProperty: "response.numberFound",
            startIndexProperty: "response.startIndex",
            documentsPerPage: 10,
            pageSizes: [5, 10, 20]
         }
      },
      {
         name: "alfresco/search/AlfSearchList",
         config: {
            useHash: true,
            useInfiniteScroll: false,
            currentPageSize: 10,
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
         name: "aikauTesting/mockservices/PaginatedSearchListMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};