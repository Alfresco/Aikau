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
      "alfresco/services/NotificationService",
      "alfresco/services/DialogService"
   ],
   widgets: [
      {
         name: "aikauTesting/core/NotificationUtilsInstance"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};