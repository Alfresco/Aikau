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
         name: "alfresco/layout/DynamicGrid",
         config: {
            
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};