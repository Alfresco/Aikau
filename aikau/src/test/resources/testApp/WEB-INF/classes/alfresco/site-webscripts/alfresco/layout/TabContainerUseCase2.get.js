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