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
         id: "FORM",
         name: "alfresco/forms/Form",
         config: {
            pubSubScope: "FORM_",
            widgets: [
               {
                  id: "TOGGLE_VISIBILITY",
                  name: "alfresco/forms/controls/CheckBox",
                  config: {
                     fieldId: "VISIBLE",
                     label: "Visible?",
                     description: "Use this checkbox to toggle the visibility of all the fields in the row",
                     value: true
                  }
               },
               {
                  id: "TOGGLE_REQUIREMENT",
                  name: "alfresco/forms/controls/CheckBox",
                  config: {
                     fieldId: "REQUIRED",
                     label: "Required?",
                     description: "Use this checkbox to toggle the requirement of all the fields in the row",
                     value: true
                  }
               },
               {
                  id: "TOGGLE_DISABLEMENT",
                  name: "alfresco/forms/controls/CheckBox",
                  config: {
                     fieldId: "DISABLED",
                     label: "Disabled?",
                     description: "Use this checkbox to toggle the requirement of all the fields in the row",
                     value: true
                  }
               },
               {
                  id: "CR1",
                  name: "alfresco/forms/ControlRow",
                  config: {
                     title: "Groups Rules",
                     visibilityConfig: {
                        rules: [
                           {
                              targetId: "VISIBLE",
                              is: [true]
                           }
                        ]
                     },
                     requirementConfig: {
                        rules: [
                           {
                              targetId: "REQUIRED",
                              is: [true]
                           }
                        ]
                     },
                     disablementConfig: {
                        rules: [
                           {
                              targetId: "DISABLED",
                              is: [true]
                           }
                        ]
                     },
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
         name: "alfresco/logging/DebugLog"
      }
   ]
};