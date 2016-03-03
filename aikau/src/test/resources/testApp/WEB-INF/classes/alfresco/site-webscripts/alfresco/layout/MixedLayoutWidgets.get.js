model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true
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
         id: "TC",
         name: "alfresco/layout/AlfTabContainer",
         config: {
            widgets: [
               {
                  id: "LOGO1",
                  name: "alfresco/logo/Logo",
                  title: "Logo"
               },
               {
                  id: "SIDEBAR",
                  title: "Sidebar",
                  name: "alfresco/layout/AlfSideBarContainer",
                  config: {
                     footerHeight: 10,
                     widgets: [
                        {
                           id: "LOGO2",
                           name: "alfresco/logo/Logo",
                           align: "sidebar"
                        },
                        {
                           id: "FIXED_HEADER_FOOTER",
                           name: "alfresco/layout/FixedHeaderFooter",
                           config: {
                              height: "auto",
                              recalculateAutoHeightOnResize: true,
                              widgetsForFooter: [
                                 {
                                    id: "LOGO3",
                                    name: "alfresco/logo/Logo"
                                 }
                              ],
                              widgets: [
                                 {
                                    id: "LIST",
                                    name: "alfresco/documentlibrary/AlfDocumentList",
                                    align: "main",
                                    config: {
                                       useHash: false,
                                       currentPageSize: 10,
                                       widgets: [
                                          {
                                             name: "alfresco/lists/views/AlfListView",
                                             config: {
                                                itemKey: "index",
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
                  id: "DEBUG_TAB",
                  name: "alfresco/logging/DebugLog",
                  title: "Debug Log"
               }
            ]
         }
      }
   ]
};