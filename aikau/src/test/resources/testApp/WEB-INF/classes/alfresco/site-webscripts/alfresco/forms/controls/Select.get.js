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
      "aikauTesting/mockservices/DojoSelectTestOptions",
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/forms/Form",
         config: {
            id: "FORM",
            pubSubScope: "UNIT_TEST_",
            widgets: [
               {
                  id: "NO_CONFIG",
                  name: "alfresco/forms/controls/DojoSelect",
                  config: null
               },
               {
                  id: "INVALID_CONFIG",
                  name: "alfresco/forms/controls/DojoSelect",
                  config: {
                     optionsConfig: {
                        fixed: 1
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/DojoSelect",
                  config: {
                     id: "FIXED_INVALID_CHANGES_TO",
                     fieldId: "Select1",
                     label: "Fixed 1",
                     value: "2",
                     optionsConfig: {
                        changesTo: "INVALID_DATA",
                        updateTopics: "INVALID_DATA",
                        fixed: [
                           {label:"One",value:"1"},
                           {label:"Two",value:"2"},
                           {value:"NO LABEL"},
                           {INVALID:"DATA"}
                        ]
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/DojoSelect",
                  config: {
                     id: "HAS_UPDATE_TOPICS",
                     fieldId: "Select2",
                     label: "Update Topics",
                     optionsConfig: {
                        updateTopics: [
                           {
                              topic: "GLOBAL_UPDATE_TOPIC",
                              global: true
                           },
                           {
                              topic: "SCOPED_UPDATE_TOPIC",
                              global: false
                           },
                           {
                              topic: "UNSCOPED_UPDATE_TOPIC"
                           },
                           {
                              INVALID: "DATA"
                           }
                        ],
                        publishTopic: "GET_OPTIONS_FOR_SELECT_2"
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/DojoSelect",
                  config: {
                     id:"BASIC_FIXED_OPTIONS",
                     fieldId: "Select3",
                     label: "Fixed 2",
                     optionsConfig: {
                        fixed: [
                           {label:"Three",value:"3"},
                           {label:"Four",value:"4"}
                        ]
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/DojoSelect",
                  config: {
                     id: "HAS_CHANGES_TO",
                     fieldId: "Select4",
                     label: "ChangesTo_PubSub",
                     optionsConfig: {
                        changesTo: [
                           {
                              targetId:"Select1"
                           },
                           {
                              targetId:"Select3",
                              global: false
                           },
                           {
                              INVALID: "DATA"
                           }
                        ],
                        publishTopic: "GET_OPTIONS_FOR_SELECT_4"
                     }
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "REQUEST_GLOBAL_UPDATE",
            label: "Update Select 2 (Global)",
            publishTopic: "GLOBAL_UPDATE_TOPIC"
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "REQUEST_SCOPED_UPDATE_GLOBALLY",
            label: "Fail To Update Select 2 (Scoped Topic/Global Publish)",
            publishTopic: "SCOPED_UPDATE_TOPIC"
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "REQUEST_SCOPED_UPDATE",
            label: "Succeed Updating Select 2 (Scoped)",
            publishTopic: "UNIT_TEST_SCOPED_UPDATE_TOPIC"
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