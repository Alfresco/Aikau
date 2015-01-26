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
      "alfresco/services/DocumentService",
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         id: "MENU_BAR",
         name: "alfresco/menus/AlfMenuBar",
         config: {
            widgets: [
               {
                  id: "PAGINATOR",
                  name: "alfresco/documentlibrary/AlfDocumentListPaginator",
                  config: {
                     hidePageSizeOnWidth: 100
                  }
               },
               {
                  id: "MENU_BAR_POPUP",
                  name: "alfresco/menus/AlfMenuBarPopup",
                  config: {
                     label: "Popup",
                     widgets: [
                        {
                           name: "alfresco/documentlibrary/AlfResultsPerPageGroup"
                        }
                     ]
                  }
               }
            ]
         },
      },
      {
         id: "LIST",
         name: "alfresco/lists/AlfSortablePaginatedList",
         config: {
            useHash: false,
            currentData: {
               items: [
                  {
                     id: "A",
                     displayName: "A"
                  },
                  {
                     id: "B",
                     displayName: "B"
                  },
                  {
                     id: "C",
                     displayName: "C"
                  }
               ]
            },
            widgets: [
               {
                  name: "alfresco/documentlibrary/views/AlfDocumentListView",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/documentlibrary/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/documentlibrary/views/layouts/Cell",
                                    config: {
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
         name: "aikauTesting/mockservices/PaginationMockXhr"
      },
      {
         name: "alfresco/logging/SubscriptionLog",
         config: {
            topicsToIgnore: [
               "ALF_RETRIEVE_DOCUMENTS_REQUEST_SUCCESS",
               "ALF_DOCLIST_DOCUMENTS_LOADED"
            ]
         }
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};