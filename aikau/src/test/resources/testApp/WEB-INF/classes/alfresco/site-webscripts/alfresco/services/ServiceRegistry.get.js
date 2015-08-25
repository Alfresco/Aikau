model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true,
               warn: true,
               error: true
            }
         }
      },
      "alfresco/services/NavigationService",
      "alfresco/services/NavigationService",
      {
         name: "alfresco/services/NavigationService",
         config: {
            pubSubScope: "SCOPE1_"
         }
      },
      {
         name: "alfresco/services/NavigationService",
         config: {
            pubSubScope: "SCOPE1_"
         }
      },
      {
         name: "alfresco/services/NavigationService",
         config: {
            pubSubScope: "SCOPE2_"
         }
      },
      {
         name: "alfresco/services/NavigationService",
         config: {
            pubSubScope: "SCOPE2_"
         }
      }
   ],
   widgets:[
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};