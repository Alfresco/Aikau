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
   widgets: [
      {
         name: "alfresco/layout/StripedContent",
         config: {
            contentWidth: "960px",
            widgets: [
               {
                  name: "alfresco/layout/FixedHeaderFooter",
                  stripeStyle: "margin: 50px 0;",
                  config: {
                     height: "300px",
                     widgetsForHeader: [
                        {
                           name: "alfresco/logo/Logo"
                        }
                     ],
                     widgets: [
                        {
                           name: "alfresco/logo/Logo"
                        },
                        {
                           name: "alfresco/logo/Logo"
                        },
                        {
                           name: "alfresco/logo/Logo"
                        },
                        {
                           name: "alfresco/logo/Logo"
                        },
                        {
                           name: "alfresco/logo/Logo"
                        },
                        {
                           name: "alfresco/logo/Logo"
                        }
                     ],
                     widgetsForFooter: [
                        {
                           name: "alfresco/logo/Logo"
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