// jshint unused:false

function getDynamicRuleOptionWidgets() {
   return [
      {
         name: "alfresco/forms/controls/Select",
         config: {
            name: "targetId",
            label: "rule.field.label",
            description: "rule.field.description",
            optionsConfig: {
               fixed: "{formControlOptions}"
            },
            requirementConfig: {
               initialValue: true
            }
         }
      },
      {
         name: "alfresco/forms/controls/MultipleEntryFormControl",
         config: {
            name: "is",
            label: "rule.is.label",
            description: "rule.is.description"
         }
      },
      {
         name: "alfresco/forms/controls/MultipleEntryFormControl",
         config: {
            name: "isNot",
            label: "rule.isNot.label",
            description: "rule.isNot.description"
         }
      }
   ];
}

// This function is used to define a single point at which option visibility rules can be 
// defined. Each time a new form control that supports options is added to the list of 
// available controls, this rule should be updated to ensure that the options configuration
// is displayed when it is selected.
function getOptionsVisibilityRuleValues() {
   return ["alfresco/forms/controls/Select","alfresco/forms/controls/RadioButtons"];
}

function getOptionsVisibilityRule() {
   return {
      targetId: "CONTROL_TYPE",
      is: getOptionsVisibilityRuleValues()
   };
}

function getFormControlConfigWidgets() {
   return [
      {
         name: "alfresco/forms/ControlRow",
         config: {
            title: "dnd.model.forms.control.fieldSet.title",
            description: "dnd.model.forms.control.fieldSet.description",
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
               }
            ]
         }
      },
      {
         name: "alfresco/forms/ControlRow",
         config: {
            title: "dnd.model.forms.data.fieldSet.title",
            description: "dnd.model.forms.data.fieldSet.description",
            widgets: [
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
               }
            ]
         }
      },
      {
         name: "alfresco/forms/ControlRow",
         config: {
            title: "dnd.model.forms.labels.fieldSet.title",
            description: "dnd.model.forms.labels.fieldSet.description",
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
               }
            ]
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
      },
      {
         name: "alfresco/forms/ControlRow",
         config: {
            title: "dnd.model.forms.options.fieldSet.title",
            description: "dnd.model.forms.options.fieldSet.description",
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
                     },
                     visibilityConfig: {
                        initialValue: false,
                        rules: [getOptionsVisibilityRule()]
                     }
                  }
               }
            ],
            visibilityConfig: {
               initialValue: false,
               rules: [
                  {
                     topic: "_valueChangeOf_CONTROL_TYPE",
                     attribute: "value",
                     is: getOptionsVisibilityRuleValues()
                  }
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
                  },
                  getOptionsVisibilityRule()
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
         name: "alfresco/forms/ControlRow",
         config: {
            widgets: [
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
                           },
                           getOptionsVisibilityRule()
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
                           },
                           getOptionsVisibilityRule()
                        ]
                     }
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/forms/ControlRow",
         config: {
            widgets: [
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
                           },
                           getOptionsVisibilityRule()
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
                           },
                           getOptionsVisibilityRule()
                        ]
                     }
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/forms/ControlRow",
         config: {
            title: "dnd.model.forms.advanced.fieldSet.title",
            description: "dnd.model.forms.advanced.fieldSet.description",
            widgets: [
               {
                  id: "DYNAMIC_BEHAVIOUR_TOGGLE",
                  name: "alfresco/forms/controls/CheckBox",
                  config: {
                     fieldId: "SHOW_DYNAMIC_BEHAVIOUR_CONFIG",
                     name: "showDynamicBehaviourConfig",
                     label: "dnd.model.forms.dynamic-config.label",
                     description: "dnd.model.forms.dynamic-config.description",
                     value: false
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/forms/ControlRow",
         config: {
            title: "dnd.model.forms.visibility.fieldSet.title",
            description: "dnd.model.forms.visibility.fieldSet.description",
            widgets: [
               {
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
                     widgets: getDynamicRuleOptionWidgets()
                  }
               }
            ],
            visibilityConfig: {
               initialValue: false,
               rules: [
                  {
                     topic: "_valueChangeOf_SHOW_DYNAMIC_BEHAVIOUR_CONFIG",
                     attribute: "value",
                     is: [true]
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/forms/ControlRow",
         config: {
            title: "dnd.model.forms.requirement.fieldSet.title",
            description: "dnd.model.forms.requirement.fieldSet.description",
            widgets: [
               {
                  name: "alfresco/forms/controls/CheckBox",
                  config: {
                     name: "config.requirementConfig.initialValue",
                     label: "dnd.model.forms.initialRequirement.label",
                     description: "dnd.model.forms.initialRequirement.description",
                     value: false,
                     visibilityConfig: {
                        initialValue: false,
                        rules: [
                           {
                              targetId: "SHOW_DYNAMIC_BEHAVIOUR_CONFIG",
                              is: [true]
                           }
                        ]
                     }
                  }
               },
               {
                  name: "alfresco/forms/creation/FormRulesConfigControl",
                  config: {
                     name: "config.requirementConfig.rules",
                     label: "dnd.model.forms.requirementRules.label",
                     description: "dnd.model.forms.requirementRules.description",
                     visibilityConfig: {
                        initialValue: false,
                        rules: [
                           {
                              targetId: "SHOW_DYNAMIC_BEHAVIOUR_CONFIG",
                              is: [true]
                           }
                        ]
                     }
                  }
               }
            ],
            visibilityConfig: {
               initialValue: false,
               rules: [
                  {
                     topic: "_valueChangeOf_SHOW_DYNAMIC_BEHAVIOUR_CONFIG",
                     attribute: "value",
                     is: [true]
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/forms/ControlRow",
         config: {
            title: "dnd.model.forms.disablement.fieldSet.title",
            description: "dnd.model.forms.disablement.fieldSet.description",
            widgets: [
               {
                  name: "alfresco/forms/controls/CheckBox",
                  config: {
                     name: "config.disablementConfig.initialValue",
                     label: "dnd.model.forms.initialDisablement.label",
                     value: false,
                     description: "dnd.model.forms.initialDisablement.description",
                     visibilityConfig: {
                        initialValue: false,
                        rules: [
                           {
                              targetId: "SHOW_DYNAMIC_BEHAVIOUR_CONFIG",
                              is: [true]
                           }
                        ]
                     }
                  }
               },
               {
                  name: "alfresco/forms/creation/FormRulesConfigControl",
                  config: {
                     name: "config.disablementConfig.rules",
                     label: "dnd.model.forms.disablementRules.label",
                     description: "dnd.model.forms.disablementRules.description",
                     visibilityConfig: {
                        initialValue: false,
                        rules: [
                           {
                              targetId: "SHOW_DYNAMIC_BEHAVIOUR_CONFIG",
                              is: [true]
                           }
                        ]
                     }
                  }
               }
            ],
            visibilityConfig: {
               initialValue: false,
               rules: [
                  {
                     topic: "_valueChangeOf_SHOW_DYNAMIC_BEHAVIOUR_CONFIG",
                     attribute: "value",
                     is: [true]
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/forms/ControlRow",
         config: {
            widgets: [
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
      }
   ];
}

function getFormConfigWidgets() {
   return [
      {
         name: "alfresco/forms/controls/CheckBox",
         config: {
            fieldId: "SHOW_BUTTONS",
            name: "config.displayButtons",
            label: "dnd.model.forms.show-buttons.label",
            description: "dnd.model.forms.show-buttons.description",
            value: true
         }
      },
      {
         name: "alfresco/forms/ControlRow",
         config: {
            title: "dnd.model.forms.confirmation-button.fieldSet.title",
            description: "dnd.model.forms.confirmation-button.fieldSet.description",
            widgets: [
               {
                  name: "alfresco/forms/controls/CheckBox",
                  config: {
                     fieldId: "SHOW_CONFIRMATION_BUTTON",
                     name: "config.showOkButton",
                     label: "dnd.model.forms.show-confirmation-button.label",
                     description: "dnd.model.forms.show-confirmation-button.description",
                     value: false,
                     postWhenHiddenOrDisabled: false,
                     noValueUpdateWhenHiddenOrDisabled: true,
                     visibilityConfig: {
                        initialValue: true,
                        rules: [
                           {
                              targetId: "SHOW_BUTTONS",
                              is: [true]
                           }
                        ]
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     fieldId: "CONFIRMATION_BUTTON_LABEL",
                     name: "config.okButtonLabel",
                     label: "dnd.model.forms.confirmation-button-label.label",
                     description: "dnd.model.forms.confirmation-button-label.description",
                     value: "OK",
                     postWhenHiddenOrDisabled: false,
                     noValueUpdateWhenHiddenOrDisabled: true,
                     visibilityConfig: {
                        initialValue: true,
                        rules: [
                           {
                              targetId: "SHOW_BUTTONS",
                              is: [true]
                           },
                           {
                              targetId: "SHOW_CONFIRMATION_BUTTON",
                              is: [true]
                           }
                        ]
                     },
                     requirementConfig: {
                        initialValue: true,
                        rules: [
                           {
                              targetId: "SHOW_CONFIRMATION_BUTTON",
                              is: [true]
                           }
                        ]
                     }
                  }
               }
            ],
            visibilityConfig: {
               initialValue: false,
               rules: [
                  {
                     topic: "_valueChangeOf_SHOW_BUTTONS",
                     attribute: "value",
                     is: [true]
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/forms/ControlRow",
         config: {
            widgets: [
               {
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     name: "config.okButtonPublishTopic",
                     label: "Confirmation Button Topic",
                     description: "This is the topic to publish when the 'confirmation' button is pressed. The value of the form will be published as the payload",
                     value: "",
                     postWhenHiddenOrDisabled: false,
                     noValueUpdateWhenHiddenOrDisabled: true,
                     visibilityConfig: {
                        initialValue: true,
                        rules: [
                           {
                              targetId: "SHOW_BUTTONS",
                              is: [true]
                           },
                           {
                              targetId: "SHOW_CONFIRMATION_BUTTON",
                              is: [true]
                           }
                        ]
                     },
                     requirementConfig: {
                        initialValue: true,
                        rules: [
                           {
                              targetId: "SHOW_CONFIRMATION_BUTTON",
                              is: [true]
                           }
                        ]
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/CheckBox",
                  config: {
                     name: "config.okButtonPublishGlobal",
                     label: "Global Publish",
                     description: "Controls whether the topic is published globally or not. Most services subscribe to globally published topics",
                     value: true,
                     visibilityConfig: {
                        initialValue: true,
                        rules: [
                           {
                              targetId: "SHOW_BUTTONS",
                              is: [true]
                           },
                           {
                              targetId: "SHOW_CONFIRMATION_BUTTON",
                              is: [true]
                           }
                        ]
                     }
                  }
               }
            ],
            visibilityConfig: {
               initialValue: false,
               rules: [
                  {
                     topic: "_valueChangeOf_SHOW_BUTTONS",
                     attribute: "value",
                     is: [true]
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/forms/ControlRow",
         config: {
            title: "dnd.model.forms.cancellation-button.fieldSet.title",
            description: "dnd.model.forms.cancellation-button.fieldSet.description",
            widgets: [
               {
                  name: "alfresco/forms/controls/CheckBox",
                  config: {
                     fieldId: "SHOW_CANCELLATION_BUTTON",
                     name: "config.showCancelButton",
                     label: "dnd.model.forms.show-cancellation-button.label",
                     description: "dnd.model.forms.show-cancellation-button.description",
                     value: false,
                     postWhenHiddenOrDisabled: false,
                     noValueUpdateWhenHiddenOrDisabled: true,
                     visibilityConfig: {
                        initialValue: true,
                        rules: [
                           {
                              targetId: "SHOW_BUTTONS",
                              is: [true]
                           }
                        ]
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     fieldId: "CANCELLATION_BUTTON_LABEL",
                     name: "config.cancelButtonLabel",
                     label: "dnd.model.forms.cancellation-button-label.label",
                     description: "dnd.model.forms.cancellation-button-label.description",
                     value: "Cancel",
                     postWhenHiddenOrDisabled: false,
                     noValueUpdateWhenHiddenOrDisabled: true,
                     visibilityConfig: {
                        initialValue: true,
                        rules: [
                           {
                              targetId: "SHOW_BUTTONS",
                              is: [true]
                           },
                           {
                              targetId: "SHOW_CANCELLATION_BUTTON",
                              is: [true]
                           }
                        ]
                     },
                     requirementConfig: {
                        initialValue: true,
                        rules: [
                           {
                              targetId: "SHOW_BUTTONS",
                              is: [true]
                           }
                        ]
                     }
                  }
               }
            ],
            visibilityConfig: {
               initialValue: false,
               rules: [
                  {
                     topic: "_valueChangeOf_SHOW_BUTTONS",
                     attribute: "value",
                     is: [true]
                  }
               ]
            }
         }
      }
   ];
}


function getDefaultFormModel() {
   var model = {
      property: "name",
      targetValues: ["alfresco/forms/Form"],
      widgetsForConfig: getFormConfigWidgets(),
      widgetsForDisplay: [
         {
            name: "alfresco/dnd/DroppedNestingItemWrapper",
            config: {
               showEditButton: true,
               label: "{label}",
               value: "{value}",
               widgets: [
                  {
                     name: "alfresco/dnd/DragAndDropFormControlTarget",
                     config: {
                        useModellingService: true,
                        label: "Form Controls", // TODO: NLS
                        targetProperty: "config.widgets"
                     }
                  }
               ]
            }
         }
      ]
   };
   return model;
}

function getDefaultFormControlModel() {
   var model = {
      property: "name",
      targetValues: ["alfresco/forms/controls/(.*)"],
      widgetsForConfig: getFormControlConfigWidgets(),
      widgetsForDisplay: [
         {
            name: "alfresco/dnd/DroppedFormControlWrapper",
            config: {
               showEditButton: true,
               label: "{label}",
               value: "{value}",
               widgets: [
                  {
                     name: "alfresco/dnd/DroppedItemWidgets"
                  }
               ]
            }
         }
      ]
   };
   return model;
}