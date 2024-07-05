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
         id: "TC",
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
                           id: "CREATE_TAB_WITH_PUBLICATION",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Add tab (with additional publication)",
                              publishTopic:"ALF_ADD_TAB",
                              publishPayload: {
                                 publishOnAdd: {
                                    publishTopic: "ALF_DOCLIST_RELOAD_DATA",
                                    publishScope: "LIST_2_SCOPE_"
                                 },
                                 widgets: [
                                    {
                                       id: "ADDED_LIST_2",
                                       name: "alfresco/lists/AlfList",
                                       title: "List that should reload",
                                       closable: true,
                                       selected: true,
                                       config: {
                                          pubSubScope: "LIST_2_SCOPE_",
                                          useHash: false,
                                          currentData: {
                                             items: [
                                                
                                             ]
                                          }
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