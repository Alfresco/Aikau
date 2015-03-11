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
      }
   ],
   widgets: [
      {
         id: "MENU_BAR",
         name: "alfresco/menus/AlfMenuBar",
         config: {
            widgets: [
               {
                  id: "PAGINATOR",
                  name: "alfresco/lists/Paginator",
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
                           name: "alfresco/lists/ResultsPerPageGroup"
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         id: "LIST",
         name: "alfresco/lists/AlfSortablePaginatedList",
         config: {
            useHash: false,
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