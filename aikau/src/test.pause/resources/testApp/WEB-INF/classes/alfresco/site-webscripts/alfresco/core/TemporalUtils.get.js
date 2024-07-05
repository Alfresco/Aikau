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
      },
      "alfresco/services/ErrorReporter",
      "aikauTesting/mixins/TemporalUtils"
   ],
   widgets:[
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};