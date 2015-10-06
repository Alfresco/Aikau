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
      "alfresco/services/SiteService",
      "alfresco/services/DialogService"
   ],
   widgets:[
      {
         id: "MENUBAR",
         name: "alfresco/menus/AlfMenuBar",
         config: {
            widgets: [
               {
                  id: "MENUBAR_POPUP",
                  name: "alfresco/menus/AlfMenuBarPopup",
                  config: {
                     label: "Delete Site Actions",
                     widgets: [
                        {
                           id: "DELETE_WITH_REDIRECT",
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              label: "Delete site (redirect)",
                              iconClass: "alf-delete-20-icon",
                              publishTopic: "ALF_DELETE_SITE",
                              publishPayload: {
                                 shortName: "site1",
                                 redirect: {
                                    url: "user/guest/dashboard",
                                    type: "PAGE_RELATIVE",
                                    target: "CURRENT"
                                 }
                              }
                           }
                        },
                        {
                           id: "DELETE_WITH_RELOAD",
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              label: "Delete site (reload)",
                              iconClass: "alf-delete-20-icon",
                              publishTopic: "ALF_DELETE_SITE",
                              publishPayload: {
                                 shortName: "site1"
                              }
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/SiteMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};