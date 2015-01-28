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
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/forms/Form",
         config: {
            widgets: [
               {
                  name: "alfresco/forms/controls/DojoValidationTextBox", 
                  config: {
                     fieldId: "",
                     id: "BASIC",
                     label: "Basic"
                  }
               },
               {
                  name: "alfresco/forms/controls/DojoValidationTextBox", 
                  config: {
                     fieldId: null,
                     id: "UNITS_AND_DESCRIPTION",
                     label: "Has Units and Desc",
                     description: "A description of the control",
                     unitsLabel: "Some unit"
                  }
               },
               {
                  name: "alfresco/forms/controls/DojoValidationTextBox", 
                  config: {
                     fieldId: "Field1",
                     id: "INITIAL_VALUE1",
                     label: "Has initial value 1",
                     value: "Val1",
                     description: null,
                     unitsLabel: null,
                     visibilityConfig:{},
                     requirementConfig:{},
                     disablementConfig:{},
                     optionsConfig: {}
                  }
               },
               {
                  name: "alfresco/forms/controls/DojoValidationTextBox", 
                  config: {
                     fieldId: "Field2",
                     id: "INITIAL_VALUE2",
                     label: "Has initial value 2",
                     value: "Val2"
                  }
               },
               {
                  name: "alfresco/forms/controls/DojoValidationTextBox", 
                  config: {
                     fieldId: "Field3",
                     id: "INITIAL_VALUE3",
                     label: "Has initial value 3",
                     value: "Val3"
                  }
               },
               {
                  name: "alfresco/forms/controls/DojoValidationTextBox", 
                  config: {
                     id: "NO_POST_WHEN_HIDDEN",
                     label: "No Post When Hidden",
                     value: "Val3",
                     postWhenHiddenOrDisabled: false,
                     disablementConfig: {
                        initialValue: true
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/DojoValidationTextBox", 
                  config: {
                     id: "POST_EVEN_WHEN_HIDDEN",
                     label: "Post Even When Hidden",
                     value: "Val4",
                     postWhenHiddenOrDisabled: true,
                     disablementConfig: {
                        initialValue: true
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/DojoValidationTextBox", 
                  config: {
                     id: "NO_UPDATE_WHEN_HIDDEN",
                     label: "No Update When Hidden",
                     value: "Val5",
                     noValueUpdateWhenHiddenOrDisabled: true,
                     disablementConfig: {
                        initialValue: true
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/DojoValidationTextBox", 
                  config: {
                     id: "UPDATE_EVEN_WHEN_HIDDEN",
                     label: "Update Even When Hidden",
                     value: "Val6",
                     noValueUpdateWhenHiddenOrDisabled: false,
                     disablementConfig: {
                        initialValue: true
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/DojoValidationTextBox", 
                  config: {
                     id: "SINGLE_POSITIVE_RULES",
                     label: "Has single positive rules",
                     description: "This widget is configured with visibility, requirement and disablement rules with a single positive rule",
                     value: "",
                     visibilityConfig: {
                        initialValue: false,
                        rules: [
                           {
                              targetId: "Field1",
                              is: ["Val1"]
                           }
                        ]
                     },
                     requirementConfig: {
                        initialValue: false,
                        rules: [
                           {
                              targetId: "Field2",
                              is: ["Val2"]
                           }
                        ]
                     },
                     disablementConfig: {
                        initialValue: false,
                        rules: [
                           {
                              targetId: "Field3",
                              is: ["Val3"]
                           }
                        ]
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/DojoValidationTextBox", 
                  config: {
                     id: "SINGLE_NEGATIVE_RULES",
                     label: "Has single negative rules",
                     description: "This widget is configured with visibility, requirement and disablement rules with a single negative rule",
                     value: "",
                     visibilityConfig: {
                        initialValue: false,
                        rules: [
                           {
                              targetId: "Field1",
                              isNot: ["Val1"]
                           }
                        ]
                     },
                     requirementConfig: {
                        initialValue: false,
                        rules: [
                           {
                              targetId: "Field2",
                              isNot: ["Val2"]
                           }
                        ]
                     },
                     disablementConfig: {
                        initialValue: false,
                        rules: [
                           {
                              targetId: "Field3",
                              isNot: ["Val3"]
                           }
                        ]
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/DojoValidationTextBox", 
                  config: {
                     id: "MULTIPLE_POSITIVE_RULES",
                     label: "Has multiple positive rules",
                     description: "This widget is configured with visibility, requirement and disablement rules with multiple positive rules",
                     value: "",
                     visibilityConfig: {
                        initialValue: false,
                        rules: [
                           {
                              targetId: "Field1",
                              is: ["Val1", "Val2", "Val3"]
                           },
                           {
                              targetId: "Field2",
                              is: ["Val1", "Val2", "Val3"]
                           },
                           {
                              targetId: "Field3",
                              is: ["Val1", "Val2", "Val3"]
                           }
                        ]
                     },
                     requirementConfig: {
                        initialValue: false,
                        rules: [
                           {
                              targetId: "Field1",
                              is: ["Val1", "Val2", "Val3"]
                           },
                           {
                              targetId: "Field2",
                              is: ["Val1", "Val2", "Val3"]
                           },
                           {
                              targetId: "Field3",
                              is: ["Val1", "Val2", "Val3"]
                           }
                        ]
                     },
                     disablementConfig: {
                        initialValue: false,
                        rules: [
                           {
                              targetId: "Field1",
                              is: ["Val1", "Val2", "Val3"]
                           },
                           {
                              targetId: "Field2",
                              is: ["Val1", "Val2", "Val3"]
                           },
                           {
                              targetId: "Field3",
                              is: ["Val1", "Val2", "Val3"]
                           }
                        ]
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/DojoValidationTextBox", 
                  config: {
                     id: "MULTIPLE_NEGATIVE_RULES",
                     label: "Has multiple negative rules",
                     description: "This widget is configured with visibility, requirement and disablement rules with multiple negative rules",
                     value: "",
                     visibilityConfig: {
                        initialValue: false,
                        rules: [
                           {
                              targetId: "Field1",
                              isNot: ["Val1", "Val2", "Val3"]
                           },
                           {
                              targetId: "Field2",
                              isNot: ["Val1", "Val2", "Val3"]
                           },
                           {
                              targetId: "Field3",
                              isNot: ["Val1", "Val2", "Val3"]
                           }
                        ]
                     },
                     requirementConfig: {
                        initialValue: false,
                        rules: [
                           {
                              targetId: "Field1",
                              isNot: ["Val1", "Val2", "Val3"]
                           },
                           {
                              targetId: "Field2",
                              isNot: ["Val1", "Val2", "Val3"]
                           },
                           {
                              targetId: "Field3",
                              isNot: ["Val1", "Val2", "Val3"]
                           }
                        ]
                     },
                     disablementConfig: {
                        initialValue: false,
                        rules: [
                           {
                              targetId: "Field1",
                              isNot: ["Val1", "Val2", "Val3"]
                           },
                           {
                              targetId: "Field2",
                              isNot: ["Val1", "Val2", "Val3"]
                           },
                           {
                              targetId: "Field3",
                              isNot: ["Val1", "Val2", "Val3"]
                           }
                        ]
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/DojoValidationTextBox", 
                  config: {
                     id: "MULTIPLE_MIXED_RULES",
                     label: "Has multiple mixed rules",
                     description: "This widget is configured with visibility, requirement and disablement rules with multiple both positive and negative rules",
                     value: "",
                     visibilityConfig: {
                        initialValue: false,
                        rules: [
                           {
                              targetId: "Field1",
                              is: ["Val1"]
                           },
                           {
                              targetId: "Field2",
                              isNot: ["Val2"]
                           }
                        ]
                     },
                     requirementConfig: {
                        initialValue: false,
                        rules: [
                           {
                              targetId: "Field2",
                              is: ["Val2x"]
                           },
                           {
                              targetId: "Field3",
                              isNot: ["Val3x"]
                           }
                        ]
                     },
                     disablementConfig: {
                        initialValue: false,
                        rules: [
                           {
                              targetId: "Field2",
                              is: ["Val2x"]
                           },
                           {
                              targetId: "Field3",
                              isNot: ["Val3x"]
                           }
                        ]
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/DojoValidationTextBox", 
                  config: {
                     id: "HAS_VALIDATION_CONFIG",
                     label: "Numbers Only",
                     value: "",
                     validationConfig: {
                        regex: "^([0-9]+)$",
                        errorMessage: "Value must be a number"
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/DojoValidationTextBox", 
                  config: {
                     id: "INVALID_VALIDATION_CONFIG_1",
                     label: "Invalid Validation Config 1",
                     value: "",
                     validationConfig: {
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/DojoValidationTextBox", 
                  config: {
                     id: "INVALID_VALIDATION_CONFIG_2",
                     label: "Invalid Validation Config 2",
                     value: "",
                     validationConfig: {
                        regExObj: null
                     }
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