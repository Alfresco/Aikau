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
      "alfresco/services/NotificationService",
      "aikauTesting/mockservices/DisablingSubmitMockService"
   ],
   widgets: [
      {
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/forms/Form",
                  id: "FORM_WITH_REENABLE_TOPICS",
                  config: {
                     okButtonPublishTopic: "MY_NAME_IS",
                     okButtonPublishGlobal: true,
                     okButtonDisableOnPublish: true,
                     okButtonEnablementTopics: ["ENABLE_OK_BUTTON"],
                     widgets: [
                        {
                           name: "alfresco/forms/controls/TextBox",
                           id: "NAME_TEXTBOX",
                           config: {
                              name: "name",
                              label: "What's your name?",
                              description: "Uses topic to re-enable",
                              requirementConfig: {
                                 initialValue: true
                              }
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/forms/Form",
                  id: "FORM_WITH_CONDITIONAL_REENABLEMENT",
                  config: {
                     okButtonPublishTopic: "ODD_OR_EVEN",
                     okButtonPublishGlobal: true,
                     okButtonDisableOnPublish: true,
                     okButtonEnablementTopics: [
                        {
                           topic: "ENABLE_OK_BUTTON_IF",
                           attribute: "enable",
                           is: [true]
                        },
                        "ENABLE_OK_BUTTON_ALWAYS"
                     ],
                     widgets: [
                        {
                           name: "alfresco/buttons/AlfButton",
                           id: "REENABLE_OK_BUTTON_BUTTON",
                           config: {
                              label: "Re-enable OK button",
                              publishTopic: "ENABLE_OK_BUTTON_ALWAYS"
                           }
                        },
                        {
                           name: "alfresco/html/Spacer",
                           config: {
                              height: "20px"
                           }
                        },
                        {
                           name: "alfresco/forms/controls/TextBox",
                           id: "CONDITIONAL_REENABLE_INPUT",
                           config: {
                              name: "testValue",
                              label: "Supply even number to re-enable",
                              description: "Uses topic to conditionally re-enable"
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/forms/Form",
                  id: "DEFAULT_FORM",
                  config: {
                     okButtonPublishTopic: "HERES_A_SECRET",
                     okButtonPublishRevertSecs: 2,
                     widgets: [
                        {
                           name: "alfresco/forms/controls/TextBox",
                           id: "TEXTBOX",
                           config: {
                              name: "secret",
                              label: "Tell me a secret",
                              description: "OK button with auto-revert"
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};