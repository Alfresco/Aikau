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
         name: "alfresco/buttons/AlfButton",
         id: "VB_VALUE",
         config: {
            label: "VisualBasic",
            publishTopic: "SET_FORM_VALUE",
            publishPayload: {
               bestlanguage: "vb"
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
               properfootball: ["rugby_football", "union_football"],
               bestlanguage: "javascript"
            },
            widgets: [
               {
                  name: "alfresco/forms/controls/PushButtons",
                  id: "CAN_BUILD",
                  config: {
                     name: "canbuild",
                     label: "Can we build it?",
                     description: "Config options: noWrap=true, percentGap=5",
                     noWrap: true,
                     percentGap: 5,
                     optionsConfig: {
                        fixed: [
                           {
                              label: "Yes we can",
                              value: true
                           },
                           {
                              label: "No we can't",
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
                     additionalCssClasses: "grey-gradient",
                     name: "properfootball",
                     label: "Only proper form of football?",
                     description: "Config options: width=400, multiMode=true",
                     width: 400,
                     multiMode: true,
                     optionsConfig: {
                        publishTopic: "GET_FOOTBALL_OPTIONS",
                        publishGlobal: true
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/PushButtons",
                  id: "BEST_LANGUAGE",
                  config: {
                     additionalCssClasses: "grey-gradient",
                     name: "bestlanguage",
                     label: "What's the best language?",
                     description: "Config options: width=300, maxLineLength=3",
                     width: 300,
                     maxLineLength: 3,
                     optionsConfig: {
                        fixed: [
                           {
                              label: "PHP",
                              value: "php"
                           },
                           {
                              label: "JavaScript",
                              value: "javascript"
                           },
                           {
                              label: "VisualBasic",
                              value: "vb"
                           },
                           {
                              label: "Java",
                              value: "java"
                           },
                           {
                              label: "C",
                              value: "c"
                           },
                           {
                              label: "Ruby",
                              value: "ruby"
                           },
                           {
                              label: "Scala",
                              value: "scale"
                           },
                           {
                              label: "Go",
                              value: "go"
                           }
                        ]
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