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
            modifiedByProperty: "modifiedBy",
            renderOnNewLine: true
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
            },
            renderOnNewLine: true
         }
      },
      {
         id: "SIMPLE_MODE",
         name: "alfresco/renderers/Date",
         config: {
            currentItem: {
               date: "2000-04-11T12:42:02+00:00"
            },
            simple: true,
            propertyToRender: "date",
            renderOnNewLine: true
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};