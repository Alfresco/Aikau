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
      "aikauTesting/mockservices/RadioButtonsMockService",
      "alfresco/services/DialogService",
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         id: "CANT_BUILD_VALUE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "No we can't",
            publishTopic: "SET_FORM_VALUE",
            publishPayload: {
               canbuild: false
            }
         }
      },
      {
         id: "RUGBY_UNION_VALUE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Rugby Union",
            publishTopic: "SET_FORM_VALUE",
            publishPayload: {
               properfootball: "rugby_union"
            }
         }
      },
      {
         name: "alfresco/html/Spacer",
         config: {
            height: "30px"
         }
      },
      {
         id: "RADIO_FORM",
         name: "alfresco/forms/Form",
         config: {
            okButtonPublishTopic: "POST_FORM",
            setValueTopic: "SET_FORM_VALUE",
            pubSubScope: "SCOPED_",
            widgets: [
               {
                  id: "CAN_BUILD",
                  name: "alfresco/forms/controls/RadioButtons",
                  config: {
                     name: "canbuild",
                     label: "Can build",
                     description: "Can we build it?",
                     optionsConfig: {
                        fixed: [
                           {
                              label: "Yes",
                              value: true,
                              description: "Affirmative"
                           },
                           {
                              label: "No",
                              value: false,
                              description: "Negative"
                           }
                        ]
                     }
                  }
               },
               {
                  id: "PROPER_FOOTBALL",
                  name: "alfresco/forms/controls/RadioButtons",
                  config: {
                     name: "properfootball",
                     label: "Proper football",
                     description: "What is the only proper form of football?",
                     optionsConfig: {
                        publishTopic: "GET_FOOTBALL_OPTIONS",
                        publishGlobal: true
                     }
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/html/Spacer",
         config: {
            height: "30px"
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};