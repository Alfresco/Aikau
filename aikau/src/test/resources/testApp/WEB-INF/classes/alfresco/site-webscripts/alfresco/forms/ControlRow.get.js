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
         id: "FORM1",
         name: "alfresco/forms/Form",
         config: {
            pubSubScope: "FORM1_",
            widgets: [
               {
                  id: "CR1",
                  name: "alfresco/forms/ControlRow",
                  config: {
                     widgets: [
                        {
                           id: "SELECT1",
                           name: "alfresco/forms/controls/Select",
                           config: {
                              fieldId: "SELECT1",
                              name: "select",
                              label: "Select option",
                              description: "Selecting an option should update the dynamic payload button",
                              optionsConfig: {
                                 fixed: [
                                    { label: "One", value: "ONE" },
                                    { label: "Two", value: "TWO" }
                                 ]
                              }
                           }
                        },
                        {
                           id: "TEXTBOX1",
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              fieldId: "TEXTBOX1",
                              name: "textbox",
                              label: "Some Text",
                              description: "Created to ensure that initial value is published",
                              value: "Initial Value"
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/html/Spacer",
         config: {
            height: "10px"
         }
      },
      {
         id: "DB1",
         name: "alfresco/buttons/AlfDynamicPayloadButton",
         config: {
            pubSubScope: "FORM1_",
            label: "Dynamically Updated Button",
            publishTopic: "TEST",
            publishPayloadSubscriptions: [
               {
                  topic: "_valueChangeOf_SELECT1",
                  dataMapping: {
                     value: "selected"
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
         id: "FORM2",
         name: "alfresco/forms/Form",
         config: {
            pubSubScope: "FORM2_",
            showValidationErrorsImmediately: false,
            widgets: [
               {
                  id: "CR1",
                  name: "alfresco/forms/ControlRow",
                  config: {
                     widgets: [
                        {
                           id: "TB1",
                           name: "alfresco/forms/controls/DojoValidationTextBox",
                           config: {
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