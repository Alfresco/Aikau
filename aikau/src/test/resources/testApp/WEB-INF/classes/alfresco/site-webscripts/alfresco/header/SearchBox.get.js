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
         id: "SB1",
         name: "alfresco/header/SearchBox",
         config: {
            site: page.url.templateArgs.site,
            alignRight: false
         }
      },
      {
         name: "aikauTesting/mockservices/SearchBoxMockXhr"
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};