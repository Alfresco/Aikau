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
         name: "alfresco/lists/utilities/FilterSummary",
         config: {
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};