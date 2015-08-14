var view = {
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
};

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
         name: "alfresco/layout/HorizontalWidgets",
         config: {
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
                              widgets: [view]
                           }
                        }
                     ]
                  }
               },
               {
                  id: "INFINITE_SCROLL_AREA",
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Infinite Scroll Area",
                     pubSubScope: "INFINITE_SCROLL_AREA_",
                     widgets: [
                        {
                           name: "alfresco/layout/FixedHeaderFooter",
                           config: {
                              height: "200px",
                              widgetsForHeader: [
                                 {
                                    id: "SIMULATE_FILTER",
                                    name: "alfresco/buttons/AlfButton",
                                    config: {
                                       label: "Simulate filter",
                                       publishTopic: "FILTER_THIS",
                                       publishPayload: {
                                          name: "simulated"
                                       }
                                    }
                                 },
                                 {
                                    id: "SIMULATE_RELOAD",
                                    name: "alfresco/buttons/AlfButton",
                                    config: {
                                       label: "Simulate reload",
                                       publishTopic: "ALF_DOCLIST_RELOAD_DATA"
                                    }
                                 }
                              ],
                              widgets: [
                                 {
                                    name: "alfresco/layout/InfiniteScrollArea",
                                    config: {
                                       scrollTolerance: 300,
                                       widgets: [
                                          {
                                             id: "INFINITE_SCROLL_LIST",
                                             name: "alfresco/lists/AlfSortablePaginatedList",
                                             config: {
                                                useHash: false,
                                                useInfiniteScroll: true,
                                                currentPageSize: 10,
                                                pageSizePreferenceName: "custom.pageSize.preference",
                                                filteringTopics: ["FILTER_THIS"],
                                                widgets: [view]
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
                  id: "INFINITE_SCROLL_AREA_WITH_DOCLIST",
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Infinite Scroll Area (Document List)",
                     pubSubScope: "DOCUMENT_LIST_",
                     widgets: [
                        {
                           name: "alfresco/layout/FixedHeaderFooter",
                           config: {
                              height: 200,
                              widgetsForHeader: [
                                 {
                                    id: "SIMULATE_PATH_CHANGE",
                                    name: "alfresco/buttons/AlfButton",
                                    config: {
                                       label: "Simulate Path Change",
                                       publishTopic: "ALF_DOCUMENTLIST_PATH_CHANGED",
                                       publishPayload: {
                                          path: "simulated"
                                       }
                                    }
                                 },
                                 {
                                    id: "SIMULATE_CATEGORY_CHANGE",
                                    name: "alfresco/buttons/AlfButton",
                                    config: {
                                       label: "Simulate Category Change",
                                       publishTopic: "ALF_DOCUMENTLIST_CATEGORY_CHANGED",
                                       publishPayload: {
                                          path: "simulated"
                                       }
                                    }
                                 },
                                 {
                                    id: "SIMULATE_TAG_CHANGE",
                                    name: "alfresco/buttons/AlfButton",
                                    config: {
                                       label: "Simulate Tag Change",
                                       publishTopic: "ALF_DOCUMENTLIST_TAG_CHANGED",
                                       publishPayload: {
                                          value: "simulated"
                                       }
                                    }
                                 },
                                 {
                                    id: "SIMULATE_FILTER_CHANGE",
                                    name: "alfresco/buttons/AlfButton",
                                    config: {
                                       label: "Simulate Filter Change",
                                       publishTopic: "ALF_DOCLIST_FILTER_SELECTION",
                                       publishPayload: {
                                          value: "simulated"
                                       }
                                    }
                                 }
                              ],
                              widgets: [
                                 {
                                    name: "alfresco/layout/InfiniteScrollArea",
                                    config: {
                                       scrollTolerance: 300,
                                       widgets: [
                                          {
                                             id: "DOCUMENT_LIST",
                                             name: "alfresco/documentlibrary/AlfDocumentList",
                                             config: {
                                                useHash: false,
                                                useInfiniteScroll: true,
                                                currentPageSize: 10,
                                                widgets: [view]
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