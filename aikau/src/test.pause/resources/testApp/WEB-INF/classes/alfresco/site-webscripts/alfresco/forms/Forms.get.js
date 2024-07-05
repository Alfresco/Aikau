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
      "alfresco/services/NavigationService"
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
         id: "SET_FORM_VALUE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set Form Publication",
            publishTopic: "SET_FORM_VALUE",
            publishPayload: {
               pub1: "Value Set",
               pub3: "Update Fail"
            }
         }
      },
      {
         id: "SET_FORM_VALUE_2",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set Form Publication 2",
            publishTopic: "SET_FORM_VALUE",
            publishPayload: {
               pub1: "Value Reset",
               pub3: "Update Success"
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
                     setHash:true,
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
                     pubSubScope: "STANDARD_FORM_",
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
                        },
                        {
                           name:"alfresco/buttons/AlfButton",
                           id: "ADD_BUTTON_3",
                           config: {
                              updatePayload: false,
                              label: "Additional 3 (no form values)",
                              publishTopic: "AddButton3",
                              publishPayload: {
                                 original: "only"
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
            title: "Conditional parameters form",
            widgets: [
               {
                  id: "CUSTOM_FIELDS_FORM",
                  name: "alfresco/forms/Form",
                  config: {
                     pubSubScope: "CONDITIONAL_",
                     okButtonPublishTopic: "FORM_DATA",
                     widgets: [
                        {
                           id: "TARGET_OPTIONS",
                           name: "alfresco/forms/controls/RadioButtons",
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
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Publish Settable Form",
            widgets: [
               {
                  id: "SET_VALUE_VIA_PUBSUB_FORM",
                  name: "alfresco/forms/Form",
                  config: {
                     pubSubScope: "SETTABLE_",
                     setValueTopic: "SET_FORM_VALUE",
                     okButtonPublishTopic: "OK",
                     widgets: [
                        {
                           id: "TEXT_BOX_3",
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              fieldId: "TB3",
                              name: "pub1",
                              label: "PubValue",
                              value: ""
                           }
                        },
                        {
                           id: "TEXT_BOX_4",
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              fieldId: "TB4",
                              name: "pub2",
                              label: "PubValue",
                              value: "disabled"
                           }
                        },
                        {
                           id: "TEXT_BOX_5",
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              fieldId: "TB5",
                              name: "pub3",
                              label: "Hidden",
                              value: "default",
                              noValueUpdateWhenHiddenOrDisabled: true,
                              disablementConfig: {
                                 initialValue: false,
                                 rules: [
                                    {
                                       targetId: "TB4",
                                       is: ["disabled"]
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
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Reset Button on Form",
            widgets: [
               {
                  id: "RESET_FORM",
                  name: "alfresco/forms/Form",
                  config: {
                     pubSubScope: "RESETTABLE_",
                     setValueTopic: "RESET",
                     setValueTopicGlobalScope: false,
                     okButtonPublishTopic: "OK",
                     widgets: [
                        {
                           id: "TEXT_BOX_8",
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              fieldId: "TB8",
                              name: "text",
                              label: "Text"
                           }
                        }
                     ],
                     widgetsAdditionalButtons: [
                        {
                           id: "RESET",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              updatePayload: false,
                              label: "Reset",
                              publishTopic: "RESET",
                              publishPayload: {
                                 text: "Original"
                              }
                           }
                        }
                     ],
                     value: {
                        text: "Original"
                     }
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Value Change Tracking",
            widgets: [
               {
                  id: "VALUE_CHANGE_TRACKING_FORM",
                  name: "alfresco/forms/Form",
                  config: {
                     pubSubScope: "VALUE_CHANGES_",
                     setValueTopic: "SET_FORM_VALUE",
                     okButtonPublishTopic: "OK",
                     widgets: [
                        {
                           id: "SELECT_1",
                           name: "alfresco/forms/controls/Select",
                           config: {
                              name: "A",
                              label: "A",
                              description: "Change this value to auto-set the textbox below",
                              fieldId: "PRESET_A",
                              value: "1",
                              optionsConfig: {
                                 fixed: [
                                    {
                                       "label": "1",
                                       "value": "1"
                                    },
                                    {
                                       "label": "2",
                                       "value": "2"
                                    }
                                 ]
                              }
                           }
                        }, 
                        {
                           id: "SELECT_2",
                           name: "alfresco/forms/controls/Select",
                           config: {
                              name: "B",
                              label: "B",
                              description: "Change this value to auto-set the textbox below",
                              fieldId: "PRESET_B",
                              value: "1",
                              optionsConfig: {
                                 fixed: [
                                    {
                                       "label": "1",
                                       "value": "1"
                                    },
                                    {
                                       "label": "2",
                                       "value": "2"
                                    }
                                 ]
                              }
                           }
                        },
                        {
                           id: "TEXT_BOX_6",
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              label: "Auto-set value",
                              description: "This field will be automatically updated as the select boxes change value",
                              name: "hidden",
                              fieldId: "PRESET",
                              value: "11",
                              autoSetConfig: [
                                 {
                                    rulePassValue: "11",
                                    rulesMethod: "ALL",
                                    rules: [
                                       {
                                          targetId: "PRESET_A",
                                          is: ["1"]
                                       },
                                       {
                                          targetId: "PRESET_B",
                                          is: ["1"]
                                       }
                                    ]
                                 },
                                 {
                                    rulePassValue: "12",
                                    rulesMethod: "ALL",
                                    rules: [
                                       {
                                          targetId: "PRESET_A",
                                          is: ["1"]
                                       },
                                       {
                                          targetId: "PRESET_B",
                                          is: ["2"]
                                       }
                                    ]
                                 },
                                 {
                                    rulePassValue: "21",
                                    rulesMethod: "ALL",
                                    rules: [
                                       {
                                          targetId: "PRESET_A",
                                          is: ["2"]
                                       },
                                       {
                                          targetId: "PRESET_B",
                                          is: ["1"]
                                       }
                                    ]
                                 }, 
                                 {
                                    rulePassValue: "22",
                                    rulesMethod: "ALL",
                                    rules: [
                                       {
                                          targetId: "PRESET_A",
                                          is: ["2"]
                                       },
                                       {
                                          targetId: "PRESET_B",
                                          is: ["2"]
                                       }
                                    ]
                                 }
                              ]
                           }
                        },
                        {
                           id: "TEXT_BOX_7",
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                               name: "DependentTextBox",
                               label: "DependentTextBox",
                               description: "This will be displayed if A and B are both 1",
                               value: "",
                               visibilityConfig: {
                                   initialValue: true,
                                   rulesMethod: "ALL",
                                   rules: [{
                                       "targetId": "PRESET_A",
                                       "is": [ "1" ]
                                   }, {
                                       "targetId": "PRESET_B",
                                       "is": [ "1" ]
                                   }]
                               }
                           }
                        },
                        {
                           id: "LABEL_1",
                           name: "alfresco/html/Label",
                           config: {
                              label: "Should be visible when texbox is '11'",
                              visibilityConfig: {
                                 initialValue: true,
                                 rulesMethod: "ALL",
                                 rules: [
                                    {
                                       topic: "_valueChangeOf_PRESET",
                                       attribute: "value",
                                       is: ["11"],
                                       strict: true
                                    }
                                 ]
                              }
                           }
                        },
                        {
                           name: "alfresco/html/HR"
                        },
                        {
                           id: "LABEL_2",
                           name: "alfresco/html/Label",
                           config: {
                              label: "Should be visible when texbox is '11' and A and B are both 1",
                              visibilityConfig: {
                                 useState: true,
                                 initialValue: true,
                                 rulesMethod: "ALL",
                                 rules: [
                                    {
                                       targetId: "PRESET",
                                       is: ["11"]
                                    },
                                    {
                                       targetId: "PRESET_A",
                                       is: [ "1" ]
                                    },
                                    {
                                       targetId: "PRESET_B",
                                       is: [ "1" ]
                                   }
                                 ]
                              }
                           }
                        },
                        {
                           name: "alfresco/html/HR"
                        },
                        {
                           id: "LABEL_3",
                           name: "alfresco/html/Label",
                           config: {
                              label: "Should be visible when texbox is '11' OR A is 1 OR B is 1",
                              visibilityConfig: {
                                 useState: true,
                                 initialValue: true,
                                 rulesMethod: "ANY",
                                 rules: [
                                    {
                                       targetId: "PRESET",
                                       is: ["11"]
                                    },
                                    {
                                       targetId: "PRESET_A",
                                       is: [ "1" ]
                                    },
                                    {
                                       targetId: "PRESET_B",
                                       is: [ "1" ]
                                   }
                                 ]
                              }
                           }
                        },
                        {
                           name: "alfresco/html/HR"
                        },
                        {
                           id: "LABEL_4",
                           name: "alfresco/html/Label",
                           config: {
                              label: "Should be visible when A is 1 OR B is 1",
                              visibilityConfig: {
                                 useState: true,
                                 initialValue: true,
                                 rulesMethod: "ALL",
                                 rules: [
                                    {
                                       topic: "_valueChangeOf_PRESET_A",
                                       attribute: "value",
                                       is: [ "1" ],
                                       strict: true
                                    },
                                    {
                                       topic: "_valueChangeOf_PRESET_B",
                                       attribute: "value",
                                       is: [ "1" ],
                                       strict: true
                                    },
                                    {
                                       topic: "SHOW",
                                       attribute: "key",
                                       is: [ "ON" ]
                                    }
                                 ]
                              }
                           }
                        },
                        {
                           name: "alfresco/html/HR"
                        },
                        {
                           id: "BUTTON_1",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Show",
                              publishTopic: "SHOW",
                              publishPayload: {
                                 key: "ON"
                              }
                           }
                        },
                        {
                           id: "BUTTON_2",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Hide",
                              publishTopic: "SHOW",
                              publishPayload: {
                                 key: "OFF"
                              }
                           }
                        },
                        {
                           name: "alfresco/html/HR"
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