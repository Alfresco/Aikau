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
      "alfresco/services/SiteService"
   ],
   widgets: [
      {
         id: "SITES_LIST",
         name: "alfresco/documentlibrary/AlfSitesList",
         config: {
            useHash: false,
            sortAscending: true,
            sortField: "title",
            usePagination: true,
            dataRequestTopic: "ALF_GET_SITES_ADMIN",
            currentPage: 2,
            currentPageSize: 1,
            widgets: [
               {
                  name: "alfresco/lists/views/AlfListView",
                  config: {
                     additionalCssClasses: "bordered",
                     noItemsMessage: "No Sites",
                     itemKey: "shortName",
                     widgets: [
                        {
                           name: "alfresco/lists/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       additionalCssClasses: "siteName mediumpad",
                                       widgets: [
                                          {
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "title"
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
         id: "SITES_LIST_PAGINATION_MENU",
         name: "alfresco/lists/Paginator"
      },
      {
         name: "aikauTesting/mockservices/SitesPaginationMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};