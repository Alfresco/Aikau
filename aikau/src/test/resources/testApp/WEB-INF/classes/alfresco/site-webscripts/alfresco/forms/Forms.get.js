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
      "alfresco/services/NavigationService",
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         id: "SET_HASH",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set Form Via Hash",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            publishPayload: {
               url: "field1=updatedField1&field2=updatedField2",
               type: "HASH"
            }
         }
      },
      {
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Hash based form",
            widgets: [
               {
                  id: "HASH_FORM",
                  name: "alfresco/forms/Form",
                  config: {
                     showOkButton: true,
                     okButtonPublishTopic: "SET_HASH",
                     okButtonLabel: "Set Hash",
                     showCancelButton: false,
                     useHash: true,
                     scopeFormControls: false,
                     widgets: [
                        {
                           id: "HASH_TEXT_BOX_1",
                           name: "alfresco/forms/controls/DojoValidationTextBox",
                           config: {
                              label: "Field 1",
                              name: "field1",
                              value: ""
                           }
                        },
                        {
                           id: "HASH_TEXT_BOX_2",
                           name: "alfresco/forms/controls/DojoValidationTextBox",
                           config: {
                              label: "Field 2",
                              name: "field2",
                              value: ""
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
            title: "Standard Form",
            widgets: [
               {
                  id: "STANDARD_FORM",
                  name: "alfresco/forms/Form",
                  config: {
                     okButtonPublishTopic: "PUBLISH_FORM_DATA",
                     cancelButtonPublishTopic: "CANCEL_FORM_DATA",
                     widgets: [
                        {
                           name: "alfresco/forms/ControlRow",
                           config: {
                              widgets: [
                                 {
                                    id: "TEXT_BOX_1",
                                    name: "alfresco/forms/controls/DojoValidationTextBox",
                                    config: {
                                       label: "Field 3",
                                       name: "field3",
                                       value: "",
                                       requirementConfig: {
                                          initialValue: true
                                       }
                                    }
                                 },
                                 {
                                    id: "TEXT_BOX_2",
                                    name: "alfresco/forms/controls/DojoValidationTextBox",
                                    config: {
                                       label: "Field 4",
                                       name: "field4",
                                       value: "",
                                       validationConfig: {
                                          regex: "^[0-9]+$"
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
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Additional Buttons Form",
            widgets: [
               {
                  id: "ADD_BUTTONS_FORM",
                  name: "alfresco/forms/Form",
                  config: {
                     okButtonPublishTopic: "PUBLISH_FORM_DATA",
                     cancelButtonPublishTopic: "CANCEL_FORM_DATA",
                     pubSubScope: "CUSTOM_SCOPE_",
                     widgets: [
                        {
                           id: "ADD_TEXT_BOX_1",
                           name: "alfresco/forms/controls/DojoValidationTextBox",
                           config: {
                              label: "Field 5",
                              name: "field5",
                              value: ""
                           }
                        },
                        {
                           id: "ADD_TEXT_BOX_2",
                           name: "alfresco/forms/controls/DojoValidationTextBox",
                           config: {
                              label: "Field 6",
                              name: "field6",
                              value: ""
                           }
                        }
                     ],
                     widgetsAdditionalButtons: [
                        {
                           id: "ADD_BUTTON_1",
                           name:"alfresco/buttons/AlfButton",
                           config: {
                              label: "Additional 1",
                              publishTopic: "AddButton1",
                              publishPayload: {
                                 extra:"stuff"
                              }
                           }
                        },
                        {
                           name:"alfresco/buttons/AlfButton",
                           id: "ADD_BUTTON_2",
                           config: {
                              label: "Additional 2",
                              publishTopic: "AddButton2"
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
            title: "Conditional parameters form",
            widgets: [
               {
                  id: "ADD_BUTTONS_FORM",
                  name: "alfresco/forms/Form",
                  config: {
                     okButtonPublishTopic: "PUBLISH_CONDITIONAL_FORM_DATA",
                     widgets: [
                        {
                           id: "TARGET_OPTIONS",
                           name: "alfresco/forms/controls/DojoRadioButtons",
                           config: {
                              fieldId: "TARGET_FIELD",
                              name: "TARGET",
                              label: "Target",
                              value: "KNOWN1",
                              noPostWhenValueIs: ["CUSTOM"],
                              optionsConfig: {
                                 fixed: [
                                    { label: "Known 1", value: "KNOWN1"},
                                    { label: "Known 2", value: "KNOWN2"},
                                    { label: "Custom", value: "CUSTOM"}
                                 ]
                              }
                           }
                        },
                        {
                           id: "CUSTOM_TARGET",
                           name: "alfresco/forms/controls/DojoValidationTextBox",
                           config: {
                              label: "Custom",
                              name: "TARGET",
                              value: "",
                              postWhenHiddenOrDisabled: false,
                              visibilityConfig: {
                                 initialValue: false,
                                 rules: [
                                    {
                                       targetId: "TARGET_FIELD",
                                       is: ["CUSTOM"]
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
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};