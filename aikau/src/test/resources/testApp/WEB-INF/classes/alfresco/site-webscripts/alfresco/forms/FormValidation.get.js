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
         name: "alfresco/logging/DebugLog"
      }
   ]
};