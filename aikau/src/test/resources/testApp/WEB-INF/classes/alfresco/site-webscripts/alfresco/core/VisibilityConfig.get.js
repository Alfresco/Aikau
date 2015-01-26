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
         id: "HIDE_LOGO_1",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Hide Logo 1",
            publishTopic: "LOGO1",
            publishPayload: {
               value: "HIDE"
            }
         }
      },
      {
         id: "SHOW_LOGO_1",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show Logo 1",
            publishTopic: "LOGO1",
            publishPayload: {
               value: "SHOW"
            }
         }
      },
      {  
         id: "HIDE_LOGO_2",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Hide Logo 2",
            publishTopic: "LOGO2",
            publishPayload: {
               value: {
                  data: "OBSCURE"
               }
            }
         }
      },
      {
         id: "SHOW_LOGO_2_A",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show Logo 2",
            publishTopic: "LOGO2",
            publishPayload: {
               value: {
                  data: "SHOW"
               }
            }
         }
      },
      {
         id: "SHOW_LOGO_2_B",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show Logo 2",
            publishTopic: "LOGO2",
            publishPayload: {
               value: {
                  data: "DISPLAY"
               }
            }
         }
      },
      {
         id: "LOGO1",
         name: "alfresco/logo/Logo",
         config: {
            logoClasses: "alfresco-logo-only",
            visibilityConfig: {
               initialValue: true,
               rules: [
                  {
                     topic: "LOGO1",
                     attribute: "value",
                     isNot: ["HIDE"]
                  }
               ]
            }
         }
      },
      {
         id: "LOGO2",
         name: "alfresco/logo/Logo",
         config: {
            logoClasses: "surf-logo-small",
            visibilityConfig: {
               initialValue: false,
               rules: [
                  {
                     topic: "LOGO2",
                     attribute: "value.data",
                     is: ["SHOW","DISPLAY"]
                  }
               ]
            }
         }
      },
      {
         id: "BAD_DATA_1",
         name: "alfresco/logo/Logo",
         config: {
            logoClasses: "surf-logo-large",
            visibilityConfig: {
               rules: [
                  {
                     attribute: "value.data"
                  }
               ]
            }
         }
      },
      {
         id: "BAD_DATA_2",
         name: "alfresco/logo/Logo",
         config: {
            logoClasses: "alfresco-logo-3d",
            visibilityConfig: {
               rules: [
                  {
                     topic: "LOGO2"
                  }
               ]
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