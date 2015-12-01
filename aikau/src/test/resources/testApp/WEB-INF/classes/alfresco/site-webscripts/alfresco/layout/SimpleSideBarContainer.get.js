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
         name: "alfresco/layout/AlfSideBarContainer",
         config: {
            isResizable: false,
            initialSidebarWidth: 250,
            footerHeight: 10,
            widgets: [
               {
                  name: "alfresco/layout/HorizontalWidgets",
                  align: "sidebar",
                  config: {
                     widgets: [
                        {
                           id: "SIDEBAR_LOGO",
                           name: "alfresco/logo/Logo",
                           config: {
                              logoClasses: "alfresco-logo-only"
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/layout/SimplePanel",
                  config: {
                     additionalStyles: {
                        border: "1px solid #999",
                        padding: "10px"
                     },
                     height: "500px",
                     widgets: [
                        {
                           name: "alfresco/logging/DebugLog"
                        }
                     ]
                  }
               }
            ]
         }
      }
   ]
};