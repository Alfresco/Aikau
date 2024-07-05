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
      "alfresco/services/DialogService",
      "alfresco/services/SiteService",
      "aikauTesting/mockservices/FormControlValidationTestService"
   ],
   widgets: [
      {
         id: "TEST_FORM",
         name: "alfresco/forms/Form",
         config: {
            widgets: [
               {
                  id: "TEST_CONTROL",
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     label: null, // PLEASE NOTE: Label left intentionally blank for testing purposes (AKU-951)
                     description: "Three Letters Or More",
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
                  name: "alfresco/forms/controls/TextBox",
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
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     fieldId: "MATCH_TARGET",
                     label: "Field to match against",
                     value: ""
                  }
               },
               {
                  id: "MATCH_SOURCE",
                  name: "alfresco/forms/controls/TextBox",
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
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     fieldId: "TOPIC_VALIDATION",
                     label: "Validation Topic",
                     description: "Enter #fail as value to put into error state",
                     value: "",
                     validationConfig: [
                        {
                           validation: "validationTopic",
                           validationTopic: "ALF_VALIDATE_TOPIC_TEST",
                           errorMessage: "Value should not be #fail"
                        }
                     ]
                  }
               },
               {
                  id: "SCOPED_TOPIC_VALIDATION",
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     fieldId: "SCOPED_TOPIC_VALIDATION",
                     label: "Validation Topic (Scoped response)",
                     description: "Enter #fail as value to put into error state",
                     value: "",
                     validationConfig: [
                        {
                           scopeValidation: true,
                           validation: "validationTopic",
                           validationTopic: "ALF_VALIDATE_TOPIC_SCOPED_TEST",
                           errorMessage: "Value should not be #fail"
                        }
                     ]
                  }
               },
               {
                  id: "CUSTOMIZED_TOPIC_VALIDATION",
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     fieldId: "TOPIC_VALIDATION",
                     label: "Customized validation Topic",
                     description: "This simulates validating uniqueness of site identifier",
                     value: "test",
                     validationConfig: [
                        {
                           warnOnly: true,
                           validation: "validationTopic",
                           validationTopic: "ALF_VALIDATE_SITE_IDENTIFIER",
                           validationValueProperty: "title",
                           validationPayload: {
                              title: null
                           },
                           validateInitialValue: false,
                           negate: true,
                           validationResultProperty: "response.used",
                           errorMessage: "Identifier has been used"
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
         id: "SHOW_VALIDATION_IN_DIALOG",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show validation in dialog",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "VALIDATION_DIALOG",
               dialogTitle: "Validation in Form Dialog",
               formSubmissionTopic: "POST_DIALOG_FORM",
               formSubmissionGlobal: true,
               widgets: [
                  {
                     id: "DIALOG_FORM_TEXTBOX",
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        label: null, // PLEASE NOTE: Label left intentionally blank for testing purposes (AKU-951)
                        description: "Three Letters Or More",
                        name: "name",
                        value: "",
                        validationConfig: [
                           {
                              validation: "minLength",
                              length: 3,
                              errorMessage: "Too short"
                           }
                        ]
                     }
                  },
                  {
                     id: "VALIDATION_HIDDEN_TEXTBOX",
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        label: null, // PLEASE NOTE: Label left intentionally blank for testing purposes (AKU-951)
                        description: "Required (but requirement and validation hidden)",
                        name: "name",
                        value: "",
                        requirementConfig: {
                           initialValue: true
                        },
                        hideValidation: true
                     }
                  }
               ]
            }
         }
      },
      {
         id: "SHOW_PICKER_IN_DIALOG",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show picker with hidden validation in dialog",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "VALIDATION_DIALOG_2",
               dialogTitle: "SimplePicker",
               formSubmissionTopic: "POST_DIALOG_FORM",
               formSubmissionGlobal: true,
               noMinWidth: true,
               widgets: [
                  {
                     id: "SIMPLE_PICKER",
                     name: "alfresco/forms/controls/SimplePicker",
                     config: {
                        label: null,
                        description: "SimplePicker in form, without label, required but with hidden validation",
                        name: "picker1",
                        reorderable: true,
                        currentData: {
                           items: [
                              {
                                 name: "One"
                              },
                              {
                                 name: "Two"
                              },
                              {
                                 name: "Three"
                              }
                           ]
                        },
                        requirementConfig: {
                           initialValue: true
                        },
                        hideValidation: true
                    }
                  }
               ]
            }
         }
      },
      {
         name: "aikauTesting/mockservices/SiteMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};