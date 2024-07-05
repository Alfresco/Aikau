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
      "aikauTesting/mockservices/SelectTestOptions",
      "alfresco/services/TagService",
      "aikauTesting/mockservices/MultiSelectMockService",
      "alfresco/services/DialogService"
   ],
   widgets: [
      {
         name: "alfresco/buttons/AlfButton",
         id: "CREATE_DIALOG_FORM",
         config: {
            label: "Create Form Dialog ",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "FD1",
               dialogTitle: "Form Dialog",
               formSubmissionTopic: "CUSTOM_FORM_TOPIC",
               formSubmissionGlobal: false,
               formSubmissionScope: "CUSTOM_FORM_SCOPE_",
               widgets: [
                  {
                     id: "SELECT",
                     name: "alfresco/forms/controls/Select",
                     config: {
                        fieldId: "SB",
                        name: "selected",
                        label: "Select",
                        value: "DO2",
                        optionsConfig: {
                           publishTopic: "GET_OPTIONS_FOR_SELECT_IN_DIALOG"
                        }
                     }
                  },
                  {
                     id: "TEXTBOX",
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        fieldId: "TB",
                        name: "text",
                        label: "Enter some text",
                        value: "This is some sample text"
                     }
                  },
                  {
                     id: "TEXTAREA",
                     name: "alfresco/forms/controls/TextArea",
                     config: {
                        fieldId: "TA",
                        name: "text",
                        label: "Enter some text",
                        value: "This is some sample text"
                     }
                  },
                  {
                     id: "MULTISELECT",
                     name: "alfresco/forms/controls/MultiSelectInput",
                     config: {
                        fieldId: "MS",
                        label: "Tags",
                        name: "tags",
                        width: "400px",
                        optionsConfig: {
                           queryAttribute: "name",
                           valueAttribute: "nodeRef",
                           labelAttribute: "name",
                           pubSubScope: "DIALOG_",
                           publishTopic: "ALF_RETRIEVE_CURRENT_TAGS",
                           publishPayload: {
                              resultsProperty: "response.data.items"
                           }
                        }
                     }
                  },
                  {
                     id: "TC1",
                     name: "alfresco/forms/TabbedControls",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/forms/ControlColumn",
                              title: "Tab 1",
                              config: {
                                 widgets: [
                                    {
                                       id: "TB1",
                                       name: "alfresco/forms/controls/DateTextBox",
                                       config: {
                                          fieldId: "TB1",
                                          name: "tb1",
                                          label: "First text box",
                                          description: "Setting this field value to 'break' will make the text box in tab 3 required"
                                       }
                                    }
                                 ]
                              }
                           },
                           {
                              name: "alfresco/forms/ControlColumn",
                              title: "Tab 2",
                              config: {
                                 widgets: [
                                    {
                                       id: "TB2",
                                       name: "alfresco/forms/controls/TextBox",
                                       config: {
                                          fieldId: "TB2",
                                          name: "tb2",
                                          label: "Second text box",
                                          description: "This is a text box that should be displayed on tab 2",
                                          validationConfig: [
                                             {
                                                validation: "minLength",
                                                length: 5,
                                                errorMessage: "Too short"
                                             }
                                          ]
                                       }
                                    }
                                 ]
                              }
                           },
                           {
                              name: "alfresco/forms/ControlColumn",
                              title: "Tab 3",
                              config: {
                                 widgets: [
                                    {
                                       id: "TB3",
                                       name: "alfresco/forms/controls/TextBox",
                                       config: {
                                          fieldId: "TB3",
                                          name: "tb3",
                                          label: "Third text box",
                                          description: "This will because required when the field on tab 1 is set to break",
                                          requirementConfig: {
                                             initialValue: false,
                                             rules: [
                                                {
                                                   targetId: "TB1",
                                                   is: ["break"]
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
                  }
               ]
            }
         }
      },
      {
         name: "aikauTesting/mockservices/MultiSelectInputMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};
