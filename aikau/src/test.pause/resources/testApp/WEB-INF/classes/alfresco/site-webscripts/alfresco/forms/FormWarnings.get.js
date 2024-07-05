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
      "alfresco/services/DialogService"
   ],
   widgets: [
      {
         id: "BANNER_FORM",
         name: "alfresco/forms/Form",
         config: {
            pubSubScope: "FORM1_",
            warnings: [
               {
                  message: "Warning 1: Field 1 is not blank",
                  initialValue: true,
                  rules: [
                     {
                        targetId: "FIELD1",
                        isNot: [""]
                     }
                  ]
               },
               {
                  message: "Warning 2: Field 2 is set to 'warn'",
                  initialValue: false,
                  rules: [
                     {
                        targetId: "FIELD2",
                        is: ["warn"]
                     }
                  ]
               },
               {
                  message: "Warning 3: Field 4 must NOT have a value when Field 3 is 'blank'",
                  initialValue: false,
                  rules: [
                     {
                        targetId: "FIELD3",
                        is: ["blank"]
                     },
                     {
                        targetId: "FIELD4",
                        isNot: [""]
                     }
                  ]
               }
            ],
            widgets: [
               {
                  id: "FIELD1",
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     fieldId: "FIELD1",
                     name: "field1",
                     label: "Field 1",
                     description: "Remove the default value to hide Warning 1",
                     value: "test"
                  }
               },
               {
                  id: "FIELD2",
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     fieldId: "FIELD2",
                     name: "field2",
                     label: "Field 2",
                     description: "Enter a value of 'warn' to see another warning",
                     value: ""
                  }
               },
               {
                  id: "FIELD3",
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     fieldId: "FIELD3",
                     name: "field3",
                     label: "Field 3",
                     description: "If either this field is set to 'blank' then Field 4 must NOT have a value otherwise a warning will be displayed",
                     value: ""
                  }
               },
               {
                  id: "FIELD4",
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     fieldId: "FIELD4",
                     name: "field4",
                     label: "Field 4",
                     description: "If Field 3 is set to 'blank' then this must NOT have a value to avoid a warning being displayed",
                     value: ""
                  }
               }
            ]
         }
      },
      {
         id: "GENERATED_SCOPE_BANNER_FORM",
         name: "alfresco/forms/Form",
         config: {
            warnings: [
               {
                  message: "Warning: Field 5 is not blank",
                  initialValue: true,
                  rules: [
                     {
                        targetId: "FIELD5",
                        isNot: [""]
                     }
                  ]
               }
            ],
            widgets: [
               {
                  id: "FIELD5",
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     fieldId: "FIELD5",
                     name: "field5",
                     label: "Field 5",
                     description: "Add a value to show a Warning",
                     value: ""
                  }
               }
            ]
         }
      },
      {
         id: "CREATE_FORM_DIALOG",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Create form dialog",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "FORM_WARNING_DIALOG",
               dialogTitle: "Dialog",
               formSubmissionTopic: "DIALOG_PUBLISH",
               formSubmissionPayloadMixin: {
               },
               warningsPosition: "bottom",
               warnings: [
                  {
                     message: "Warning in a form",
                     initialValue: true,
                     rules: [
                        {
                           targetId: "FIELD1",
                           is: [""]
                        }
                     ]
                  }
               ],
               widgets: [
                  {
                     id: "DIALOG_FIELD1",
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        fieldId: "FIELD1",
                        name: "field1",
                        label: "Field 1",
                        value: ""
                     }
                  }
               ],
               responseScope: "FOURTH_SCOPE_"
            }
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};