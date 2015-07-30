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
               tb3: ""
            },
            widgets: [
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
                                    name: "alfresco/forms/controls/TextBox",
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
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};