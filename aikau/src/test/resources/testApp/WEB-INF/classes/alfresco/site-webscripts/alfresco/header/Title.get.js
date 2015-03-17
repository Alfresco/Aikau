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
         name: "alfresco/layout/VerticalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/header/Title",
                  config: {
                     label: "This is a title"
                  }
               },
               {
                  name: "alfresco/header/Title",
                  config: {
                     label: "ThisIsAReallyLongTitleWithoutAnySpacesInIt",
                     maxWidth: "300px"
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};