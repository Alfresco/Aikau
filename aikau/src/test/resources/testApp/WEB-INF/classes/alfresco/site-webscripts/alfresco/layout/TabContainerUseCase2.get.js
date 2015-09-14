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
      }
   ],
   widgets:[ 
      {
         name: "alfresco/layout/AlfTabContainer",
         config: {
            tabSelectionTopic: "ALF_SELECT_TAB",
            tabDisablementTopic: "ALF_DISABLE_TAB",
            tabAdditionTopic: "ALF_ADD_TAB",
            tabDeletionTopic: "ALF_DELETE_TAB",
            widgets: [
               {
                  id: "DEBUG_TAB",
                  name: "alfresco/logging/DebugLog",
                  title: "Debug Log"
               },
               {
                  id: "SEARCH_LIST",
                  title: "Search",
                  name: "alfresco/layout/FixedHeaderFooter",
                  config: {
                     height: "auto",
                     widgets: [
                        {
                           id: "RELOAD_BUTTON",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Reload",
                              publishTopic: "RELOAD"
                           }
                        },
                        {
                           id: "CREATE_TAB",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Add tab",
                              publishTopic:"ALF_ADD_TAB",
                              publishPayload: {
                                 widgets: [
                                    {
                                       id: "ADDED_FIXED_HEADER_FOOTER",
                                       name: "alfresco/layout/FixedHeaderFooter",
                                       title: "Added Tab",
                                       closable: true,
                                       selected: true,
                                       config: {
                                          pubSubScope: "ADDED_TAB_SCOPE",
                                          widgetsForHeader: [
                                             {
                                                name: "alfresco/html/Label",
                                                config: {
                                                   label: "List should be displayed below..."
                                                }
                                             }
                                          ],
                                          widgets: [
                                             {
                                                id: "ADDED_LIST",
                                                name: "alfresco/lists/AlfList",
                                                config: {
                                                   useHash: false,
                                                   currentData: {
                                                      items: [
                                                         {
                                                            name: "one",
                                                            displayName: "bob"
                                                         },
                                                         {
                                                            name: "two",
                                                            displayName: "ted"
                                                         },
                                                         {
                                                            name: "three",
                                                            displayName: "geoff"
                                                         },
                                                         {
                                                            name: "four",
                                                            displayName: "trevor"
                                                         }
                                                      ]
                                                   },
                                                   widgets: [
                                                      {
                                                         id: "ADDED_LIST_VIEW",
                                                         name: "alfresco/lists/views/HtmlListView"
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
                        },
                        {
                           // name: "alfresco/lists/AlfList",
                           name: "alfresco/search/AlfSearchList",
                           config: {
                              useHash: false,
                              loadDataImmediately: false,
                              reloadDataTopic: "RELOAD",
                              widgets: [
                                 {
                                    name: "alfresco/lists/views/HtmlListView"
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
};