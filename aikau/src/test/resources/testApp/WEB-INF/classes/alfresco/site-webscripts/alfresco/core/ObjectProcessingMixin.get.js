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
         name: "aikauTesting/widgets/ObjectProcessingMixinButton",
         id: "PROCESS_RECURSIVE"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};