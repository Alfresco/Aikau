model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            pubSubScope: "SCOPE1_",
            loggingPreferences: {
               enabled: true,
               all: true,
               warn: true,
               error: true
            },
            suppressUserPreferences: true
         }
      },
      {
         name: "alfresco/services/LoggingService",
         config: {
            pubSubScope: "SCOPE2_",
            loggingPreferences: {
               enabled: true,
               all: true,
               warn: true,
               error: true
            }
         }
      }
   ],
   widgets:[
      {
         name: "alfresco/html/Label",
         config: {
            label: "This page is used for testing the LoggingService configuration"
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};