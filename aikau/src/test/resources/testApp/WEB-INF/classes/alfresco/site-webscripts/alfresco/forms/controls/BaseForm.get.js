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
         name: "alfresco/forms/Form",
         config: {
            widgets: [
               {
                  id: "FORM_FIELD",
                  name: "alfresco/forms/controls/DojoValidationTextBox",
                  config: {
                     pubSubScope: "TEST_SCOPE_",
                     valueSubscriptionTopic: "SET_FORM_CONTROL_VALUE",
                     name: "control",
                     label: "This is my form control:"
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "SET_FORM_VALUE_1",
            label: "Set form value 1 (fault)",
            publishTopic: "SET_FORM_CONTROL_VALUE",
            pubSubScope: "TEST_SCOPE_",
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "SET_FORM_VALUE_2",
            label: "Set form value 2 (fault)",
            publishTopic: "SET_FORM_CONTROL_VALUE",
            pubSubScope: "TEST_SCOPE_",
            publishPayload: {
               notValue: "this is the new value"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "SET_FORM_VALUE_3",
            label: "Set form value 3",
            publishTopic: "SET_FORM_CONTROL_VALUE",
            pubSubScope: "TEST_SCOPE_",
            publishPayload: {
               value: "this is the new value"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "SET_FORM_VALUE_4",
            label: "Set form value 4",
            publishTopic: "SET_FORM_CONTROL_VALUE",
            pubSubScope: "TEST_SCOPE_",
            publishPayload: {
               value: 3.14159265
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "SET_FORM_VALUE_5",
            label: "Set form value 5",
            publishTopic: "SET_FORM_CONTROL_VALUE",
            pubSubScope: "TEST_SCOPE_",
            publishPayload: {
               value: true
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