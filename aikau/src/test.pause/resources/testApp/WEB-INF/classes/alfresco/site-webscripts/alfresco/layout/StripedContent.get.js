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
            contentWidth: "950px",
            widgets: [
               {
                  name: "alfresco/logo/Logo",
                  stripeClass: "header"
               },
               {
                  name: "alfresco/html/Label",
                  stripeClass: "sub-header",
                  config: {
                     label: "This is the sub-header",
                     additionalCssClasses: "bold"
                  }
               },
               {
                  name: "alfresco/html/Label",
                  stripeClass: "menu",
                  config: {
                     label: "This is the menu row"
                  }
               },
               {
                  name: "alfresco/html/Label",
                  stripeStyle: "background: #fee; padding: 30px 0;",
                  config: {
                     label: "Content goes here..."
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