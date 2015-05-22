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
      {
         name: "aikauTesting/mockservices/PaginationService",
         config: {
            loadDataSubscriptionTopic: "ALF_RETRIEVE_DOCUMENTS_REQUEST"
         }
      },
      "alfresco/services/NavigationService"
   ],
   widgets: [
      {
         id: "HASH_CUSTOM_PAGE_SIZES",
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Custom page sizes",
            pubSubScope: "HASH_CUSTOM_",
            widgets: [
               {
                  id: "HASH_MENU_BAR",
                  name: "alfresco/menus/AlfMenuBar",
                  config: {
                     widgets: [
                        {
                           id: "HASH_CUSTOM_PAGE_SIZE_PAGINATOR",
                           name: "alfresco/lists/Paginator",
                           config: {
                              useHash: true,
                              documentsPerPage: 10,
                              hidePageSizeOnWidth: 100,
                              pageSizes: [5,10,20]
                           }
                        }
                     ]
                  }
               },
               {
                  id: "HASH_LIST",
                  name: "alfresco/lists/AlfSortablePaginatedList",
                  config: {
                     useHash: true,
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
         name: "alfresco/logging/DebugLog"
      }
   ]
};