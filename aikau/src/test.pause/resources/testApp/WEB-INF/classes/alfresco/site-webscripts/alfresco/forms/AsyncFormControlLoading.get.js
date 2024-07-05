function getFormControlConfigWidgets() {
   return [
      {
         id: "TABS",
         name: "alfresco/forms/TabbedControls",
         config: {
            widgets: [
               {
                  id: "BASIC",
                  name: "alfresco/forms/ControlColumn",
                  title: "Basic Information",
                  config: {
                     widgets: [
                        {
                           id: "FIELD_ID",
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              fieldId: "FIELD_ID",
                              name: "config.fieldId",
                              label: "dnd.model.forms.field.label",
                              description: "dnd.model.forms.field.description",
                              requirementConfig: {
                                 initialValue: true
                              }
                           }
                        },
                        {
                           id: "CONTROL_TYPE",
                           name: "alfresco/forms/controls/Select",
                           config: {
                              fieldId: "CONTROL_TYPE",
                              name: "name",
                              label: "dnd.model.forms.control-type.label",
                              description: "dnd.model.forms.control-type.description",
                              value: "alfresco/forms/controls/TextBox",
                              optionsConfig: {
                                 fixed: [
                                    {
                                       label: "dnd.model.forms.control-type.textbox.label",
                                       value: "alfresco/forms/controls/TextBox"
                                    },
                                    {
                                       label: "dnd.model.forms.control-type.textarea.label",
                                       value: "alfresco/forms/controls/TextArea"
                                    },
                                    {
                                       label: "dnd.model.forms.control-type.select.label",
                                       value: "alfresco/forms/controls/Select"
                                    },
                                    {
                                       label: "dnd.model.forms.control-type.radiobuttons.label",
                                       value: "alfresco/forms/controls/RadioButtons"
                                    }
                                 ]
                              }
                           }
                        },
                        {
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              name: "config.name",
                              label: "dnd.model.forms.name.label",
                              description: "dnd.model.forms.name.description",
                              value: "default",
                              requirementConfig: {
                                 initialValue: true
                              }
                           }
                        },
                        {
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              name: "config.value",
                              label: "dnd.model.forms.value.label",
                              description: "dnd.model.forms.value.description",
                              value: ""
                           }
                        },
                        {
                           name: "alfresco/forms/controls/CheckBox",
                           config: {
                              name: "config.postWhenHiddenOrDisabled",
                              label: "dnd.model.forms.postWhenHiddenOrDisabled.label",
                              description: "dnd.model.forms.postWhenHiddenOrDisabled.description",
                              value: true
                           }
                        },
                        {
                           name: "alfresco/forms/controls/CheckBox",
                           config: {
                              name: "config.noValueUpdateWhenHiddenOrDisabled",
                              label: "dnd.model.forms.noValueUpdateWhenHiddenOrDisabled.label",
                              description: "dnd.model.forms.noValueUpdateWhenHiddenOrDisabled.description",
                              value: false
                           }
                        }
                     ]
                  }
               },
               {
                  id: "LABELS",
                  name: "alfresco/forms/ControlColumn",
                  title: "Labels",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              name: "config.label",
                              label: "dnd.model.forms.label.label",
                              description: "dnd.model.forms.label.description",
                              value: "Default Label"
                           }
                        },
                        {
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              name: "config.unitsLabel",
                              label: "dnd.model.forms.units.label",
                              description: "dnd.model.forms.units.description",
                              value: "units"
                           }
                        },
                        {
                           name: "alfresco/forms/controls/TextArea",
                           config: {
                              name: "config.description",
                              label: "dnd.model.forms.description.label",
                              description: "dnd.model.forms.description.description",
                              value: "Default description"
                           }
                        }
                     ]
                  }
               },
               {
                  id: "OPTIONS",
                  name: "alfresco/forms/ControlColumn",
                  title: "Options",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/forms/controls/RadioButtons",
                           config: {
                              fieldId: "OPTIONS_TYPE",
                              name: "config.selectOptionType",
                              label: "dnd.model.forms.optionsType.label",
                              description: "dnd.model.forms.optionsType.description",
                              value: "FIXED",
                              optionsConfig: {
                                 fixed: [
                                    { label: "dnd.model.forms.optionsType.fixed.label", value: "FIXED" },
                                    { label: "dnd.model.forms.optionsType.dynamic.label", value: "DYNAMIC" }
                                 ]
                              }
                           }
                        },
                        {
                           name: "alfresco/forms/controls/MultipleKeyValuePairFormControl",
                           config: {
                              name: "config.optionsConfig.fixed",
                              label: "dnd.model.forms.fixedOptions.label",
                              description: "dnd.model.forms.fixedOptions.description",
                              visibilityConfig: {
                                 initialValue: false,
                                 rules: [
                                    {
                                       targetId: "OPTIONS_TYPE",
                                       is: ["FIXED"]
                                    }
                                 ]
                              }
                           }
                        },
                        {
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              name: "config.optionsConfig.publishTopic",
                              label: "dnd.model.forms.options.publishTopic.label",
                              description: "dnd.model.forms.options.publishTopic.description",
                              value: "ALF_GET_FORM_CONTROL_OPTIONS",
                              postWhenHiddenOrDisabled: false,
                              visibilityConfig: {
                                 initialValue: false
                              },
                              disablementConfig: {
                                 initialValue: true
                              }
                           }
                        },
                        {
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              name: "config.optionsConfig.publishPayload.url",
                              label: "dnd.model.forms.options.publishPayload.url.label",
                              description: "dnd.model.forms.options.publishPayload.url.description",
                              value: url.context + "/proxy/alfresco/api/groups",
                              postWhenHiddenOrDisabled: false,
                              visibilityConfig: {
                                 initialValue: false,
                                 rules: [
                                    {
                                       targetId: "OPTIONS_TYPE",
                                       is: ["DYNAMIC"]
                                    }
                                 ]
                              }
                           }
                        },
                        {
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              name: "config.optionsConfig.publishPayload.itemsAttribute",
                              label: "dnd.model.forms.options.publishPayload.itemsAttribute.label",
                              description: "dnd.model.forms.options.publishPayload.itemsAttribute.description",
                              value: "data",
                              postWhenHiddenOrDisabled: false,
                              visibilityConfig: {
                                 initialValue: false,
                                 rules: [
                                    {
                                       targetId: "OPTIONS_TYPE",
                                       is: ["DYNAMIC"]
                                    }
                                 ]
                              }
                           }
                        },
                        {
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              name: "config.optionsConfig.publishPayload.labelAttribute",
                              label: "dnd.model.forms.options.publishPayload.labelAttribute.label",
                              description: "dnd.model.forms.options.publishPayload.labelAttribute.description",
                              value: "displayName",
                              postWhenHiddenOrDisabled: false,
                              visibilityConfig: {
                                 initialValue: false,
                                 rules: [
                                    {
                                       targetId: "OPTIONS_TYPE",
                                       is: ["DYNAMIC"]
                                    }
                                 ]
                              }
                           }
                        },
                        {
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              name: "config.optionsConfig.publishPayload.valueAttribute",
                              label: "dnd.model.forms.options.publishPayload.valueAttribute.label",
                              description: "dnd.model.forms.options.publishPayload.valueAttribute.description",
                              value: "fullName",
                              postWhenHiddenOrDisabled: false,
                              visibilityConfig: {
                                 initialValue: false,
                                 rules: [
                                    {
                                       targetId: "OPTIONS_TYPE",
                                       is: ["DYNAMIC"]
                                    }
                                 ]
                              }
                           }
                        }
                     ]
                  }
               },
               {
                  id: "DYNAMIC",
                  name: "alfresco/forms/ControlColumn",
                  title: "Dynamic Behaviour",
                  config: {
                     widgets: [
                        {
                           id: "INITIALLY_VISIBLE",
                           name: "alfresco/forms/controls/CheckBox",
                           config: {
                              name: "config.visibilityConfig.initialValue",
                              label: "dnd.model.forms.initialVisibility.label",
                              description: "dnd.model.forms.initialVisibility.description",
                              value: true
                           }
                        },
                        {
                           id: "DYNAMIC_VISIBILITY_RULES",
                           name: "alfresco/forms/creation/FormRulesConfigControl",
                           config: {
                              name: "config.visibilityConfig.rules",
                              label: "dnd.model.forms.visibilityRules.label",
                              description: "dnd.model.forms.visibilityRules.description",
                              useSimpleValues: false,
                              widgets: []
                           }
                        },
                        {
                           name: "alfresco/forms/controls/CheckBox",
                           config: {
                              name: "config.requirementConfig.initialValue",
                              label: "dnd.model.forms.initialRequirement.label",
                              description: "dnd.model.forms.initialRequirement.description",
                              value: false
                           }
                        },
                        {
                           name: "alfresco/forms/creation/FormRulesConfigControl",
                           config: {
                              name: "config.requirementConfig.rules",
                              label: "dnd.model.forms.requirementRules.label",
                              description: "dnd.model.forms.requirementRules.description"
                           }
                        },
                        {
                           name: "alfresco/forms/controls/CheckBox",
                           config: {
                              name: "config.disablementConfig.initialValue",
                              label: "dnd.model.forms.initialDisablement.label",
                              value: false,
                              description: "dnd.model.forms.initialDisablement.description"
                           }
                        },
                        {
                           name: "alfresco/forms/creation/FormRulesConfigControl",
                           config: {
                              name: "config.disablementConfig.rules",
                              label: "dnd.model.forms.disablementRules.label",
                              description: "dnd.model.forms.disablementRules.description"
                           }
                        }
                     ]
                  }
               },
               {
                  id: "VALIDATION",
                  name: "alfresco/forms/ControlColumn",
                  title: "Validation",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/forms/controls/MultipleEntryFormControl",
                           config: {
                              name: "config.validationConfig",
                              label: "Rule",
                              description: "Create the validation rules for this field",
                              widgets: [
                                 {
                                    name: "alfresco/forms/controls/Select",
                                    config: {
                                       fieldId: "VALIDATION_RULE_TYPE",
                                       name: "validation",
                                       label: "Rule type",
                                       description: "The type of validation rule to be applied",
                                       optionsConfig: {
                                          fixed: [
                                             { label: "Minimum length", value: "minLength"},
                                             { label: "Maximum length", value: "maxLength"},
                                             { label: "Regular Expression", value: "regex"}
                                          ]
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/forms/controls/TextArea",
                                    config: {
                                       name: "errorMessage",
                                       label: "Error message",
                                       description: "The message to display when the validation rule fails",
                                       value: ""
                                    }
                                 },
                                 {
                                    name: "alfresco/forms/controls/NumberSpinner",
                                    config: {
                                       name: "length",
                                       label: "Characters",
                                       description: "The mimimum number of characters that must be provided",
                                       visibilityConfig: {
                                          initialValue: false,
                                          rules: [
                                             {
                                                targetId: "VALIDATION_RULE_TYPE",
                                                is: ["minLength"]
                                             }
                                          ]
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/forms/controls/NumberSpinner",
                                    config: {
                                       name: "length",
                                       label: "Characters",
                                       description: "The maximum number of characters that must not be exceeded",
                                       visibilityConfig: {
                                          initialValue: false,
                                          rules: [
                                             {
                                                targetId: "VALIDATION_RULE_TYPE",
                                                is: ["maxLength"]
                                             }
                                          ]
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/forms/controls/TextBox",
                                    config: {
                                       name: "regex",
                                       label: "Regular Expression",
                                       description: "The regular expression to use to validate the user input",
                                       visibilityConfig: {
                                          initialValue: false,
                                          rules: [
                                             {
                                                targetId: "VALIDATION_RULE_TYPE",
                                                is: ["regex"]
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
   ];
}

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
         id: "CREATE_DIALOG_BUTTON",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Create form dialog",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "DIALOG1",
               dialogTitle: "Asynchronously Loaded Forms",
               formSubmissionTopic: "POST_FORM",
               formSubmissionGlobal: false,
               formSubmissionScope: "SCOPE_",
               widgets: getFormControlConfigWidgets()
            }
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};