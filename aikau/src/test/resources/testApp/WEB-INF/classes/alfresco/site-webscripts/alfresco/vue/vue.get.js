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
         name: "aikau/vue/Test",
         config: {
            widgets: [
               {
                  name: "aikau/vue/Test2"
               }
            ]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};