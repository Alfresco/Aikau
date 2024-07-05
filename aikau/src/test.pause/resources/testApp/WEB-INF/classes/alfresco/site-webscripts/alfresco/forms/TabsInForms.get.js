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
            okButtonPublishTopic: "SAVE_FORM",
            value: {
               tb1: "data",
               tb2: "fail",
               tb3: "",
               tb4: "one",
               tb5: "two"
            },
            widgets: [
               {
                  id: "TOGGLE_DISABILITY",
                  name: "alfresco/forms/controls/CheckBox",
                  config: {
                     fieldId: "TOGGLE_DISABILITY",
                     name: "toggle",
                     label: "Toggle Disability",
                     description: "Use this checkbox to toggle disability of fields in the tabs",
                     value: false
                  }
               },
               {
                  name: "alfresco/forms/CollapsibleSection",
                  config: {
                     label: "Stuff",
                     widgets: [
                        {
                           id: "TC1",
                           name: "alfresco/forms/TabbedControls",
                           config: {
                              padded: true,
                              widgets: [
                                 {
                                    name: "alfresco/forms/ControlColumn",
                                    title: "Tab 1",
                                    config: {
                                       widgets: [
                                          {
                                             id: "TB1",
                                             name: "alfresco/forms/controls/TextBox",
                                             config: {
                                                fieldId: "TB1",
                                                name: "tb1",
                                                label: "First text box",
                                                description: "Setting this field value to 'break' will make the text box in tab 3 required",
                                                disablementConfig: {
                                                   rules: [
                                                      {
                                                         targetId: "TOGGLE_DISABILITY",
                                                         is: [true]
                                                      }
                                                   ]
                                                }
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
               },
               {
                  id: "TC2",
                  name: "alfresco/forms/TabbedControls",
                  config: {
                     padded: true,
                     widgets: [
                        {
                           name: "alfresco/forms/ControlColumn",
                           title: "Tab 4",
                           config: {
                              widgets: [
                                 {
                                    id: "TB4",
                                    name: "alfresco/forms/controls/TextBox",
                                    config: {
                                       fieldId: "TB4",
                                       name: "tb4",
                                       label: "Text box",
                                       disablementConfig: {
                                          rules: [
                                             {
                                                targetId: "TOGGLE_DISABILITY",
                                                is: [true]
                                             }
                                          ]
                                       }
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           name: "alfresco/forms/ControlColumn",
                           title: "Tab 5",
                           config: {
                              widgets: [
                                 {
                                    id: "TB5",
                                    name: "alfresco/forms/controls/TextBox",
                                    config: {
                                       fieldId: "TB5",
                                       name: "tb5",
                                       label: "Another text box"
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
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};