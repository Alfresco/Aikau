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
      "alfresco/services/DocumentService"
   ],
   widgets: [
      {
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "List that fails to load data",
            widgets: [
               {
                  id: "PAGINATOR",
                  name: "alfresco/lists/Paginator",
                  config: {
                     documentsPerPage: 10,
                     pageSizes: [5,10,20]
                  }
               },
               {
                  id: "LIST",
                  name: "alfresco/lists/AlfSortablePaginatedList",
                  config: {
                     currentPageSize: 10,
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
      },
      {
         // Note: just using any mock xhr service that will fail...
         name: "aikauTesting/mockservices/DocumentLibraryMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};