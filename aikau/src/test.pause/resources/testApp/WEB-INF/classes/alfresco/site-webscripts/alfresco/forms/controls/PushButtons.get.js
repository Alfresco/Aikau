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
      "aikauTesting/mockservices/PushButtonsMockService",
      "alfresco/services/DialogService",
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         id: "CREATE_DIALOG",
         name: "alfresco/buttons/AlfButton",
         config: {
            additionalCssClasses: "call-to-action",
            label: "Create Form Dialog",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "PUSH_BUTTONS_DIALOG",
               dialogTitle: "PushButtons in a Dialog",
               formSubmissionTopic: "CUSTOM_FORM_TOPIC",
               contentWidth: "800px",
               widgets: [
                  {
                     id: "DPB_1",
                     name: "alfresco/forms/controls/PushButtons",
                     config: {
                        name: "marks1",
                        label: "A few example marks",
                        description: "Config options: noWrap=true, maxLineLength=3",
                        maxLineLength: 3,
                        noWrap: true,
                        simpleLayout: true,
                        multiMode:true,
                        optionsConfig: {
                           fixed: [
                              {
                                 label: "This label gets truncated because it's really quite long",
                                 value: "1"
                              },
                              {
                                 label: "Short Mark",
                                 value: "2"
                              }
                           ]
                        }
                     }
                  },
                  {
                     id: "DPB_2",
                     name: "alfresco/forms/controls/PushButtons",
                     config: {
                        name: "marks2",
                        label: "Lots of Example Marks",
                        description: "Config options: noWrap=true, maxLineLength=3",
                        maxLineLength: 3,
                        noWrap: true,
                        simpleLayout: true,
                        multiMode:true,
                        optionsConfig: {
                           fixed: [
                              {
                                 label: "This label gets truncated because it's really quite long",
                                 value: "1"
                              },
                              {
                                 label: "Short Mark",
                                 value: "2"
                              },
                              {
                                 label: "A Longer Mark",
                                 value: "3"
                              },
                              {
                                 label: "Another Longer Mark",
                                 value: "4"
                              },
                              {
                                 label: "Special Department",
                                 value: "5"
                              },
                              {
                                 label: "A",
                                 value: "6"
                              },
                              {
                                 label: "One For Luck",
                                 value: "7"
                              }
                           ]
                        }
                     }
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "CANT_BUILD_VALUE",
         config: {
            label: "No we can't",
            publishTopic: "SET_FORM_VALUE",
            publishPayload: {
               canbuild: false
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "RUGBY_UNION_VALUE",
         config: {
            label: "Rugby Union",
            publishTopic: "SET_FORM_VALUE",
            publishPayload: {
               properfootball: "rugby_union"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "VB_VALUE",
         config: {
            label: "VisualBasic",
            publishTopic: "SET_FORM_VALUE",
            publishPayload: {
               bestlanguage: "vb"
            }
         }
      },
      {
         name: "alfresco/html/Spacer",
         config: {
            height: "30px"
         }
      },
      {
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/layout/VerticalWidgets",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/forms/Form",
                           config: {
                              id: "LEFT_FORM",
                              okButtonPublishTopic: "POST_FORM",
                              setValueTopic: "SET_FORM_VALUE",
                              pubSubScope: "SCOPED_",
                              value: {
                                 canbuild: true,
                                 properfootball: ["rugby_football", "union_football"],
                                 bestlanguage: "javascript"
                              },
                              widgets: [
                                 {
                                    name: "alfresco/forms/controls/PushButtons",
                                    id: "CAN_BUILD",
                                    config: {
                                       name: "canbuild",
                                       label: "Can we build it?",
                                       description: "Config options: noWrap=true, percentGap=5",
                                       noWrap: true,
                                       percentGap: 5,
                                       optionsConfig: {
                                          fixed: [
                                             {
                                                label: "Yes we can",
                                                value: true
                                             },
                                             {
                                                label: "No we can't",
                                                value: false
                                             }
                                          ]
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/forms/controls/PushButtons",
                                    id: "PROPER_FOOTBALL",
                                    config: {
                                       additionalCssClasses: "grey-gradient",
                                       name: "properfootball",
                                       label: "Only proper form of football?",
                                       description: "Config options: width=400, multiMode=true, maxChoices=2",
                                       width: 400,
                                       maxChoices: 2,
                                       multiMode: true,
                                       optionsConfig: {
                                          publishTopic: "GET_FOOTBALL_OPTIONS",
                                          publishGlobal: true
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/forms/controls/PushButtons",
                                    id: "BEST_LANGUAGE",
                                    config: {
                                       additionalCssClasses: "grey-gradient",
                                       name: "bestlanguage",
                                       label: "What's the best language?",
                                       description: "Config options: width=300, maxLineLength=3",
                                       width: 300,
                                       maxLineLength: 3,
                                       optionsConfig: {
                                          fixed: [
                                             {
                                                label: "PHP",
                                                value: "php"
                                             },
                                             {
                                                label: "JavaScript",
                                                value: "javascript"
                                             },
                                             {
                                                label: "VisualBasic",
                                                value: "vb"
                                             },
                                             {
                                                label: "Java",
                                                value: "java"
                                             },
                                             {
                                                label: "C",
                                                value: "c"
                                             },
                                             {
                                                label: "Ruby",
                                                value: "ruby"
                                             },
                                             {
                                                label: "Scala",
                                                value: "scala"
                                             },
                                             {
                                                label: "Go",
                                                value: "go"
                                             }
                                          ]
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/html/Spacer",
                                    config: {
                                       height: "20px"
                                    }
                                 }
                              ]
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/layout/VerticalWidgets",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/forms/Form",
                           config: {
                              id: "RIGHT_FORM",
                              okButtonPublishTopic: "POST_FORM",
                              setValueTopic: "SET_FORM_VALUE",
                              pubSubScope: "SCOPED_",
                              value: {
                                 canbuild: true,
                                 properfootball: ["rugby_football", "union_football"],
                                 bestlanguage: "javascript"
                              },
                              widgets: [
                                 {
                                    name: "alfresco/forms/controls/PushButtons",
                                    id: "ONE_DESELECTABLE_CHOICE",
                                    config: {
                                       additionalCssClasses: "grey-gradient",
                                       name: "onedeselectable",
                                       label: "Deselectable single-choice buttons",
                                       description: "Config options: multiMode=true, maxChoices=1",
                                       maxChoices: 1,
                                       multiMode: true,
                                       optionsConfig: {
                                          fixed: [
                                             {
                                                label: "One",
                                                value: "one"
                                             },
                                             {
                                                label: "Two",
                                                value: "two"
                                             },
                                             {
                                                label: "Three",
                                                value: "three"
                                             }
                                          ]
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/forms/controls/PushButtons",
                                    id: "LONG_BUTTONS",
                                    config: {
                                       additionalCssClasses: "grey-gradient",
                                       name: "longbuttons",
                                       label: "Long button labels",
                                       description: "Config options: multiMode=true, noWrap=true, width=300",
                                       multiMode: true,
                                       noWrap: true,
                                       width: 300,
                                       optionsConfig: {
                                          fixed: [
                                             {
                                                label: "This is a really long label",
                                                value: "A"
                                             },
                                             {
                                                label: "Here's yet another really, really long label, but this time a bit longer",
                                                value: "B"
                                             }
                                          ]
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/html/Spacer",
                                    config: {
                                       height: "20px"
                                    }
                                 },
                                 {
                                    name: "alfresco/forms/controls/PushButtons",
                                    id: "BEST_LANGUAGE",
                                    config: {
                                       name: "marks",
                                       label: "Example Marks",
                                       description: "Config options: noWrap=true, maxLineLength=3",
                                       maxLineLength: 3,
                                       noWrap: true,
                                       simpleLayout: true,
                                       multiMode:true,
                                       optionsConfig: {
                                          fixed: [
                                             {
                                                label: "This label gets truncated because it's really quite long",
                                                value: "1"
                                             },
                                             {
                                                label: "Short Mark",
                                                value: "2"
                                             },
                                             {
                                                label: "A Longer Mark",
                                                value: "3"
                                             },
                                             {
                                                label: "Another Longer Mark",
                                                value: "4"
                                             },
                                             {
                                                label: "Special Department",
                                                value: "5"
                                             },
                                             {
                                                label: "A",
                                                value: "6"
                                             },
                                             {
                                                label: "One For Luck",
                                                value: "7"
                                             }
                                          ]
                                       }
                                    }
                                 },
                                 {
                                    id: "TOGGLE_DISABLE_STATE",
                                    name: "alfresco/forms/controls/CheckBox",
                                    config: {
                                       fieldId: "TOGGLE_DISABLED",
                                       label: "Disabled?",
                                       description: "Use this control to toggle the disable state of the PushButtons below",
                                       value: true
                                    }
                                 },
                                 {
                                    id: "DISABLED",
                                    name: "alfresco/forms/controls/PushButtons",
                                    config: {
                                       fieldId: "DISABLED",
                                       name: "disabled",
                                       label: "Disabled Display",
                                       description: "What PushButtons look like disabled",
                                       maxLineLength: 3,
                                       noWrap: true,
                                       simpleLayout: true,
                                       multiMode:true,
                                       optionsConfig: {
                                          fixed: [
                                             {
                                                label: "This label gets truncated because it's really quite long",
                                                value: "1"
                                             },
                                             {
                                                label: "Short Mark",
                                                value: "2"
                                             }
                                          ]
                                       },
                                       disablementConfig: {
                                          initialValue: true,
                                          rules: [
                                             {
                                                targetId: "TOGGLE_DISABLED",
                                                is: [true]
                                             }
                                          ]
                                       }
                                    }
                                 },
                                 {
                                    id: "NO_OPTIONS",
                                    name: "alfresco/forms/controls/PushButtons",
                                    config: {
                                       fieldId: "NO_OPTIONS",
                                       name: "nooptions",
                                       label: "Option-less",
                                       description: "What PushButtons look like with no options",
                                       maxLineLength: 3,
                                       noWrap: true,
                                       simpleLayout: true,
                                       multiMode:true,
                                       noButtonsLabel: "No buttons available",
                                       optionsConfig: {
                                          fixed: []
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
         name: "alfresco/html/Spacer",
         config: {
            height: "30px"
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};