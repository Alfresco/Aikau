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
         name: "alfresco/buttons/AlfButton",
         id: "CANT_BUILD_VALUE",
         config: {
            label: "No we can't",
            publishTopic: "SET_FORM_VALUE",
            publishPayload: {
               canbuild: false
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "RUGBY_UNION_VALUE",
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
         name: "alfresco/forms/Form",
         config: {
            id: "RADIO_FORM",
            okButtonPublishTopic: "POST_FORM",
            setValueTopic: "SET_FORM_VALUE",
            pubSubScope: "SCOPED_",
            widgets: [
               {
                  name: "alfresco/forms/controls/RadioButtons",
                  id: "CAN_BUILD",
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
                  name: "alfresco/forms/controls/RadioButtons",
                  id: "PROPER_FOOTBALL",
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