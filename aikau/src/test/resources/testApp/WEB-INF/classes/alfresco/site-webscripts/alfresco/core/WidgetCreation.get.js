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
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/logo/Logo",
         config: {
            logoClasses: "alfresco-logo-only"
         }
      },
      {
         id: "USE_MODEL_ID_IN_DOM",
         name: "alfresco/logo/Logo",
         config: {
            logoClasses: "alfresco-logo-3d"
         }
      },
      {
         id: "OVERRIDE_ID_IN_DOM",
         name: "alfresco/logo/Logo",
         config: {
            id: "SPECIFIC_DOM_ID",
            logoClasses: "surf-logo-large"
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