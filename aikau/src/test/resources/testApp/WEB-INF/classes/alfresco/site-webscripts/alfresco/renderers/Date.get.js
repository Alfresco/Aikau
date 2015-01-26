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
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         id: "CUSTOM_PROPS",
         name: "alfresco/renderers/Date",
         config: {
            currentItem: {
               modifiedOn: "2000-04-11T12:42:02+00:00",
               modifiedBy: "Brian Griffin"
            },
            modifiedDateProperty: "modifiedOn",
            modifiedByProperty: "modifiedBy"
         }
      },
      {
         id: "STANDARD_PROPS",
         name: "alfresco/renderers/Date",
         config: {
            currentItem: {
               jsNode: {
                  properties: {
                     modified: {
                        iso8601: "2000-04-11T12:42:02+00:00"
                     },
                     modifier: {
                        displayName: "Chris Griffin"
                     }
                  }
               }
            }
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