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
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  id: "DEFAULT_CONFIG",
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Default page settings",
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
                        }
                     ]
                  }
               },
               {
                  id: "CUSTOM_PAGE_SIZES",
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Custom page sizes",
                     pubSubScope: "CUSTOM_",
                     widgets: [
                        {
                           id: "MENU_BAR",
                           name: "alfresco/menus/AlfMenuBar",
                           config: {
                              widgets: [
                                 {
                                    id: "CUSTOM_PAGE_SIZE_PAGINATOR",
                                    name: "alfresco/lists/Paginator",
                                    config: {
                                       documentsPerPage: 10,
                                       hidePageSizeOnWidth: 100,
                                       pageSizes: [5,10,20]
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
      }
   ]
};