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
               modifiedBy: "TestSök <img ='><svg onload=\"window.hacked=true\"'>"
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
         id: "STANDARD_PROPS_MISSING_USER",
         name: "alfresco/renderers/Date",
         config: {
            currentItem: {
               jsNode: {
                  properties: {
                     modified: {
                        iso8601: "2000-04-11T12:42:02+00:00"
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
         id: "NOT_AVAILABLE",
         name: "alfresco/renderers/Date",
         config: {
            currentItem: {},
            simple: true,
            propertyToRender: "foo",
            warnIfNotAvailable: true,
            warnIfNotAvailableMessage: "Not available",
            renderOnNewLine: true
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};