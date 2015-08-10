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
         id: "TABS",
         name: "alfresco/layout/AlfTabContainer",
         config: {
            widgets: [
               {
                  id: "SIDEBAR",
                  title: "Sidebar",
                  name: "alfresco/layout/AlfSideBarContainer",
                  config: {
                     footerHeight: 10,
                     widgets: [
                        {
                           id: "LOGO",
                           name: "alfresco/logo/Logo",
                           align: "sidebar"
                        },
                        {
                           id: "LIST",
                           name: "alfresco/documentlibrary/AlfDocumentList",
                           align: "main",
                           config: {
                              useHash: true,
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
               },
               {
                  name: "alfresco/logging/DebugLog",
                  title: "Debug Log"
               }
            ]
         }
      }
   ]
};