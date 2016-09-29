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
         name: "alfresco/html/Heading",
         config: {
            level: 3,
            label: "Custom properties"
         }
      },
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
         name: "alfresco/html/Heading",
         config: {
            level: 3,
            label: "Standard properties (with label)"
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
            renderOnNewLine: true,
            label: "details.description.none"
         }
      },
      {
         name: "alfresco/html/Heading",
         config: {
            level: 3,
            label: "Standard properties (missing user)"
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
         name: "alfresco/html/Heading",
         config: {
            level: 3,
            label: "Simple mode (with label)"
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
            renderOnNewLine: true,
            label: "details.description.none"
         }
      },
      {
         name: "alfresco/html/Heading",
         config: {
            level: 3,
            label: "Not available"
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
         name: "alfresco/html/Heading",
         config: {
            level: 3,
            label: "Custom Format"
         }
      },
      {
         id: "FORMATTED",
         name: "alfresco/renderers/Date",
         config: {
            currentItem: {
               date: "2000-04-11T12:42:02+00:00"
            },
            simple: true,
            propertyToRender: "date",
            renderOnNewLine: true,
            format: "shortDate"
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};