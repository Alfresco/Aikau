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
      "alfresco/services/DocumentService",
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/layout/VerticalWidgets",
                  config: {
                     widgets: [
                        {
                           id: "MENU_BAR",
                           name: "alfresco/menus/AlfMenuBar",
                           config: {
                              widgets: [
                                 {
                                    id: "POPUP_MENU",
                                    name: "alfresco/menus/AlfMenuBarPopup",
                                    config: {
                                       iconClass: "alf-configure-icon",
                                       widgets: [
                                          {
                                             id: "VIEW_SELECTION_GROUP",
                                             name: "alfresco/documentlibrary/AlfViewSelectionGroup"
                                          }
                                       ]
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           id: "DOCLIST",
                           name: "alfresco/documentlibrary/AlfDocumentList",
                           config: {
                              waitForPageWidgets: false,
                              useInfiniteScroll: true,
                              currentPageSize: 5,
                              useHash: true,
                              widgets: [
                                 {
                                    id: "FILMSTRIP_VIEW",
                                    name: "alfresco/documentlibrary/views/AlfFilmStripView"
                                 }
                              ]
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/layout/VerticalWidgets",
                  config: {
                     pubSubScope: "PAGED_",
                     widgets: [
                        {
                           name: "alfresco/layout/HorizontalWidgets",
                           config: {
                              widgets: [
                                 {
                                    id: "PAGED_MENU_BAR",
                                    name: "alfresco/menus/AlfMenuBar",
                                    widthPx: 100,
                                    config: {
                                       widgets: [
                                          {
                                             id: "POPUP_MENU",
                                             name: "alfresco/menus/AlfMenuBarPopup",
                                             config: {
                                                iconClass: "alf-configure-icon",
                                                widgets: [
                                                   {
                                                      id: "PAGED_VIEW_SELECTION_GROUP",
                                                      name: "alfresco/documentlibrary/AlfViewSelectionGroup"
                                                   }
                                                ]
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    id: "PAGED_PAGINATOR",
                                    name: "alfresco/lists/Paginator",
                                    config: {
                                       useHash: false,
                                       documentsPerPage: 10,
                                       pageSizes: [5,10,20]
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           id: "PAGED_DOCLIST",
                           name: "alfresco/documentlibrary/AlfDocumentList",
                           config: {
                              waitForPageWidgets: false,
                              currentPageSize: 10,
                              widgets: [
                                 {
                                    id: "PAGED_FILMSTRIP_VIEW",
                                    name: "alfresco/documentlibrary/views/AlfFilmStripView"
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
         name: "aikauTesting/mockservices/NodesMockXhr",
         config: {
            totalItems: 11
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};