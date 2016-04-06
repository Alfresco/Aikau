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
         name: "alfresco/renderers/DateLink",
         config: {
            currentItem: {
               modifiedOn: "2000-04-11T12:42:02+00:00",
               modifiedBy: "TestSök <img ='><svg onload=\"window.hacked=true\"'>"
            },
            modifiedDateProperty: "modifiedOn",
            modifiedByProperty: "modifiedBy",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            useCurrentItemAsPayload: false,
            publishPayloadType: "CONFIGURED",
            publishPayload: {
               url: "/1/2/3/4/5",
               type: "PAGE_RELATIVE"
            },
            publishGlobal: true,
            publishToParent: true
         }
      },
      {
         id: "STANDARD_PROPS",
         name: "alfresco/renderers/DateLink",
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
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            useCurrentItemAsPayload: false,
            publishPayloadType: "CONFIGURED",
            publishPayload: {
               url: "/5/4/3/2/1",
               type: "PAGE_RELATIVE"
            },
            publishGlobal: null,
            publishToParent: null
         }
      },
      {
         id: "BROKEN_1",
         name: "alfresco/renderers/DateLink",
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
            publishTopic: "",
            useCurrentItemAsPayload: false,
            publishPayloadType: "CONFIGURED",
            publishPayload: {
               url: "/5/4/3/2/1",
               type: "PAGE_RELATIVE"
            }
         }
      },
      {
         id: "BROKEN_2",
         name: "alfresco/renderers/DateLink",
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
            publishTopic: null,
            useCurrentItemAsPayload: false,
            publishPayloadType: "CONFIGURED",
            publishPayload: {
               url: "/5/4/3/2/1",
               type: "PAGE_RELATIVE"
            }
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};