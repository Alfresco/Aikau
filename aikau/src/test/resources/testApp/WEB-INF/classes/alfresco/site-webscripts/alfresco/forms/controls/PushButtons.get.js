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
      "aikauTesting/mockservices/PushButtonsMockService",
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
            id: "TEST_FORM",
            okButtonPublishTopic: "POST_FORM",
            setValueTopic: "SET_FORM_VALUE",
            pubSubScope: "SCOPED_",
            value: {
               canbuild: true,
               properfootball: ["rugby_football", "union_football"]
            },
            widgets: [
               {
                  name: "alfresco/forms/controls/PushButtons",
                  id: "CAN_BUILD",
                  config: {
                     name: "canbuild",
                     label: "Can build",
                     description: "Can we build it?",
                     width: 500,
                     optionsConfig: {
                        fixed: [
                           {
                              label: "Yes",
                              value: true
                           },
                           {
                              label: "No",
                              value: false
                           }
                        ]
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/PushButtons",
                  id: "PROPER_FOOTBALL",
                  config: {
                     name: "properfootball",
                     label: "Proper football",
                     description: "What are the only proper forms of football?",
                     width: 600,
                     multiMode: true,
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