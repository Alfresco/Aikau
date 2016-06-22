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
      }
   ],
   widgets: [
      
      {
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Form Not Validated On Display",
            widgets: [
               {
                  id: "NO_INITIAL_VALIDATION",
                  name: "alfresco/forms/Form",
                  config: {
                     showOkButton: true,
                     okButtonPublishTopic: "SET_HASH",
                     okButtonLabel: "Save",
                     showCancelButton: false,
                     useHash: false,
                     setHash: false,
                     pubSubScope: "FORM1_",
                     showValidationErrorsImmediately: false,
                     widgets: [
                        {
                           id: "TB1",
                           name: "alfresco/forms/controls/DojoValidationTextBox",
                           config: {
                              fieldId: "FIELD1",
                              label: "Field 1",
                              name: "field1",
                              description: "Needs to be 3 characters or more",
                              value: "a",
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
                           id: "TB2",
                           name: "alfresco/forms/controls/DojoValidationTextBox",
                           config: {
                              fieldId: "FIELD2",
                              label: "Field 2",
                              name: "field2",
                              description: "Must be a number",
                              value: "abcde",
                              validationConfig: {
                                 regex: "^([0-9]+)$",
                                 errorMessage: "Value must be a number"
                              }
                           }
                        },
                        {
                           id: "TB5",
                           name: "alfresco/forms/controls/DojoValidationTextBox",
                           config: {
                              fieldId: "FIELD5",
                              label: "Field 5",
                              name: "field5",
                              description: "Needs to be 3 characters or more",
                              value: "a",
                              requirementConfig: {
                                 initialValue: true
                              },
                              validationConfig: [
                                 {
                                    validation: "minLength",
                                    length: 3,
                                    errorMessage: "Too short"
                                 }
                              ]
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Form Validated On Display",
            widgets: [
               {
                  id: "IMMEDIATELY_VALIDATED",
                  name: "alfresco/forms/Form",
                  config: {
                     okButtonPublishTopic: "PUBLISH_FORM_DATA",
                     cancelButtonPublishTopic: "CANCEL_FORM_DATA",
                     firstFieldFocusOnLoad: true,
                     pubSubScope: "FORM2_",
                     showValidationErrorsImmediately: true,
                     widgets: [
                        {
                           id: "TB3",
                           name: "alfresco/forms/controls/DojoValidationTextBox",
                           config: {
                              fieldId: "FIELD3",
                              label: "Field 3",
                              name: "field3",
                              description: "Needs to be 3 characters or more",
                              value: "a",
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
                           id: "TB4",
                           name: "alfresco/forms/controls/DojoValidationTextBox",
                           config: {
                              fieldId: "FIELD4",
                              label: "Field 4",
                              name: "field4",
                              description: "Must be a number",
                              value: "abcde",
                              validationConfig: {
                                 regex: "^([0-9]+)$",
                                 errorMessage: "Value must be a number"
                              }
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Disablement change triggers validation",
            widgets: [
               {
                  id: "FORM3",
                  name: "alfresco/forms/Form",
                  config: {
                     okButtonPublishTopic: "SAVE",
                     cancelButtonPublishTopic: "CANCEL",
                     pubSubScope: "FORM3_",
                     showValidationErrorsImmediately: true,
                     widgets: [
                        {
                           id: "SELECT",
                           name: "alfresco/forms/controls/Select",
                           config: {
                              fieldId: "SELECT",
                              label: "Trigger",
                              name: "select",
                              description: "Changing value TO 'B' should enable text box AND make it required",
                              value: "A",
                              optionsConfig: {
                                 fixed: [
                                    {
                                       label: "A", value: "A"
                                    },
                                    {
                                       label: "B", value: "B"
                                    }
                                 ]
                              }
                           }
                        },
                        {
                           id: "TA",
                           name: "alfresco/forms/controls/TextArea",
                           config: {
                              fieldId: "TA",
                              label: "Result",
                              name: "text2",
                              description: "This should become required and cause form submission button to become disabled",
                              value: "",
                              disablementConfig: {
                                 initialValue: true,
                                 rules: [
                                    {
                                       targetId: "SELECT",
                                       is: ["A"]
                                    }
                                 ]
                              },
                             requirementConfig: {
                                 initialValue: false,
                                 rules: [
                                    {
                                       targetId: "SELECT",
                                       isNot: ["A"]
                                    }
                                 ]
                              }
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