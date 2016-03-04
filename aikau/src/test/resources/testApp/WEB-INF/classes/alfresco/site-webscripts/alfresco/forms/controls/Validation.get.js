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
      "aikauTesting/mockservices/FormControlValidationTestService",
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         id: "TEST_FORM",
         name: "alfresco/forms/Form",
         config: {
            widgets: [
               {
                  id: "TEST_CONTROL",
                  name: "alfresco/forms/controls/DojoValidationTextBox",
                  config: {
                     label: "Three Letters Or More",
                     name: "name",
                     value: "",
                     validationConfig: [
                        {
                           validation: "minLength",
                           length: 3,
                           errorMessage: "Too short"
                        },
                        {
                           validation: "maxLength",
                           length: 5,
                           errorMessage: "Too long"
                        },
                        {
                           validation: "regex",
                           regex: "^[A-Za-z]+$",
                           errorMessage: "Letters only"
                        },
                        {
                           validation: "validateUnique",
                           errorMessage: "Already used",
                           itemsProperty: "someData",
                           publishTopic: "GET_DUMMY_VALUES"
                        }
                     ]
                  }
               },
               {
                  id: "TEST_CONTROL_INVERT",
                  name: "alfresco/forms/controls/DojoValidationTextBox",
                  config: {
                     label: "No illegal characters",
                     name: "name",
                     value: "",
                     validationConfig: [
                        {
                           validation: "minLength",
                           length: 1,
                           errorMessage: "Too short"
                        },
                        {
                           validation: "maxLength",
                           length: 30,
                           errorMessage: "Too long"
                        },
                        {
                           validation: "regex",
                           regex: "([\"\*\\\>\<\?\/\:\|]+)|([\.]?[\.]+$)",
                           errorMessage: "No illegal characters",
                           invertRule: true
                        }
                     ]
                  }
               },
               {
                  id: "MATCH_TARGET",
                  name: "alfresco/forms/controls/DojoValidationTextBox",
                  config: {
                     fieldId: "MATCH_TARGET",
                     label: "Field to match against",
                     value: ""
                  }
               },
               {
                  id: "MATCH_SOURCE",
                  name: "alfresco/forms/controls/DojoValidationTextBox",
                  config: {
                     fieldId: "MATCH_SOURCE",
                     label: "Field to test match",
                     value: "",
                     validationConfig: [
                        {
                           validation: "validateMatch",
                           errorMessage: "Value doesn't match",
                           targetId: "MATCH_TARGET"
                        }
                     ]
                  }
               },
               {
                  id: "TOPIC_VALIDATION",
                  name: "alfresco/forms/controls/DojoValidationTextBox",
                  config: {
                     fieldId: "TOPIC_VALIDATION",
                     label: "Validation Topic",
                     value: "",
                     validationConfig: [
                        {
                           validation: "validationTopic",
                           validationTopic: "ALF_VALIDATE_TOPIC_TEST",
                           errorMessage: "Value should not be #fail"
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         id: "BLOCK_RESPONSE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Block responses",
            publishTopic: "BLOCK_RESPONSES"
         }
      },
      {
         id: "UNBLOCK_RESPONSE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Unblock responses",
            publishTopic: "UNBLOCK_RESPONSES"
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};