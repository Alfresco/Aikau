/*jshint maxlen:500*/
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
      "alfresco/services/DialogService",
      "aikauTesting/mockservices/FormDialogMockService"
   ],
   widgets: [
      {
         name: "alfresco/buttons/AlfButton",
         id: "CREATE_FORM_DIALOG_NO_ID",
         config: {
            label: "Create Basic Dialog (with no ID)",
            publishTopic: "ALF_CREATE_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "FD1",
               dialogTitle: "Form Dialog 1",
               additionalCssClasses: "custom-classes",
               textContent: "Hello World",
               publishOnShow: [
                  {
                     publishTopic: "DISPLAYED_FD1",
                     publishPayload: {}
                  }
               ],
               widgetsButtons: [
                  {
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        label: "OK",
                        additionalCssClasses: "cancellationButton",
                        publishTopic: "ALF_ITEMS_SELECTED"
                     }
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "CREATE_FORM_DIALOG_CUSTOM_SCOPE",
         config: {
            label: "Create Form Dialog (with custom scoping)",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "SCOPED_FORM",
               dialogTitle: "Scoped Form Dialog",
               formSubmissionTopic: "CUSTOM_FORM_TOPIC",
               formSubmissionGlobal: false,
               formSubmissionScope: "CUSTOM_FORM_SCOPE_",
               widgets: [
                  {
                     id: "SCOPED_FORM_TEXTBOX",
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        name: "text",
                        label: "Enter some text",
                        value: "This is some sample text"
                     }
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "CREATE_FORM_DIALOG",
         config: {
            label: "Create Basic Form Dialog",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "FD2",
               dialogTitle: "Form Dialog 2",
               formSubmissionTopic: "POST_DIALOG_2",
               formSubmissionPayloadMixin: {
                  bonusData: "test"
               },
               contentWidth: "700px",
               contentHeight: "300px",
               widgets: [
                  {
                     id: "TB2",
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        name: "text",
                        label: "Enter some text"
                     }
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "LAUNCH_OUTER_DIALOG_BUTTON",
         config: {
            label: "Launch outer dialog",
            publishTopic: "ALF_CREATE_DIALOG_REQUEST",
            publishPayload: {
               dialogTitle: "Outer dialog",
               dialogId: "OUTER_DIALOG",
               contentWidth: "600px",
               contentHeight: "400px",
               widgetsContent: [
                  {
                     name: "alfresco/buttons/AlfButton",
                     id: "LAUNCH_INNER_DIALOG_BUTTON",
                     config:{
                        label: "Launch inner dialog",
                        publishTopic: "ALF_CREATE_DIALOG_REQUEST",
                        publishPayload: {
                           dialogTitle: "Inner dialog",
                           dialogId: "INNER_DIALOG",
                           textContent: "Inner dialog content",
                           publishOnShow: [
                              {
                                 publishTopic: "DISPLAYED_INNER_DIALOG",
                                 publishPayload: {}
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
         id: "LAUNCH_FAILURE_DIALOG",
         config: {
            label: "Launch Failing Form Dialog",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogTitle: "Failure Test Dialog",
               dialogId: "FD3",
               formSubmissionTopic: "POST_FORM_DIALOG",
               dialogCloseTopic: "FORM_POST_SUCCESS",
               widgets: [
                  {
                     id: "TB3",
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        name: "text",
                        label: "Enter some text",
                        description: "The service will fail when value is 'fail'"
                     }
                  }
               ]
            }
         }
      }, 
      {
         name: "alfresco/buttons/AlfButton",
         id: "LAUNCH_CUSTOM_BUTTON_ID_DIALOG",
         config: {
            label: "Launch ID Form Dialog",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogTitle: "Failure Test Dialog",
               dialogId: "CUSTOM_DIALOG",
               formSubmissionTopic: "POST_FORM_DIALOG",
               dialogCloseTopic: "FORM_POST_SUCCESS",
               dialogConfirmationButtonId: "CUSTOM_OK_BUTTON_ID",
               widgets: [
                  {
                     id: "CUSTOM_DIALOG_INPUT",
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        name: "text",
                        label: "Enter some text",
                        description: "The service will fail when value is 'fail'"
                     }
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "CREATE_AND_CREATE_ANOTHER_1",
         config: {
            label: "Launch repeating dialog",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogTitle: "Repeating dialog (golden path)",
               dialogId: "CUSTOM_DIALOG",
               dialogRepeats: true,
               formSubmissionTopic: "POST_FORM_DIALOG",
               dialogConfirmationButtonId: "CUSTOM_OK_BUTTON_ID",
               dialogConfirmAndRepeatButtonId: "CUSTOM_REPEAT_BUTTON_ID",
               dialogConfirmationButtonTitle: "Create",
               dialogConfirmAndRepeatButtonTitle: "Create and create another",
               widgets: [
                  {
                     id: "GOLDEN_REPEATING_INPUT",
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        name: "text",
                        label: "Enter some text"
                     }
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "CREATE_AND_CREATE_ANOTHER_2",
         config: {
            label: "Launch repeating dialog",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogTitle: "Repeating dialog (error path)",
               dialogId: "ERROR_REPEATING",
               formSubmissionTopic: "POST_FORM_DIALOG",
               dialogRepeats: true,
               dialogCloseTopic: "FORM_POST_SUCCESS",
               dialogConfirmationButtonId: "DIFFERENT_OK_BUTTON_ID",
               widgets: [
                  {
                     id: "ERROR_REPEATING_INPUT",
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        name: "text",
                        label: "Enter some text",
                        description: "The service will fail when value is 'fail'"
                     }
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "CREATE_FORM_DIALOG_WITH_TABBED_LAYOUT",
         config: {
            label: "Create Tabbed Layout Form Dialog",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "TABBED_FORM_DIALOG",
               dialogTitle: "Tabs in forms",
               formSubmissionTopic: "TABBED_FORM",
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
                                       id: "TAB1_TB",
                                       name: "alfresco/forms/controls/TextBox",
                                       config: {
                                          fieldId: "TAB1_TB",
                                          name: "tab1tb",
                                          label: "Tab 1 TextBox"
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
                                       id: "TAB2_TB",
                                       name: "alfresco/forms/controls/TextBox",
                                       config: {
                                          fieldId: "TAB2_TB",
                                          name: "tab2tb",
                                          label: "Second text box"
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
         name: "alfresco/buttons/AlfButton",
         id: "CREATE_LONG_DIALOG",
         config: {
            label: "Launch long dialog",
            publishTopic: "ALF_CREATE_DIALOG_REQUEST",
            publishPayload: {
               dialogTitle: "Long dialog",
               widgetsContent: [
                  {
                     name: "alfresco/html/Heading",
                     config: {
                        level: 2,
                        label: "This is a heading"
                     }
                  },
                  {
                     name: "alfresco/html/Spacer",
                     config: {
                        height: "50px"
                     }
                  },
                  {
                     name: "alfresco/html/Heading",
                     config: {
                        level: 2,
                        label: "This is a heading"
                     }
                  },
                  {
                     name: "alfresco/html/Spacer",
                     config: {
                        height: "50px"
                     }
                  },
                  {
                     name: "alfresco/html/Heading",
                     config: {
                        level: 2,
                        label: "This is a heading"
                     }
                  },
                  {
                     name: "alfresco/html/Spacer",
                     config: {
                        height: "50px"
                     }
                  },
                  {
                     name: "alfresco/html/Heading",
                     config: {
                        level: 2,
                        label: "This is a heading"
                     }
                  },
                  {
                     name: "alfresco/html/Spacer",
                     config: {
                        height: "50px"
                     }
                  },
                  {
                     name: "alfresco/html/Heading",
                     config: {
                        level: 2,
                        label: "This is a heading"
                     }
                  },
                  {
                     name: "alfresco/html/Spacer",
                     config: {
                        height: "50px"
                     }
                  },
                  {
                     name: "alfresco/html/Heading",
                     config: {
                        level: 2,
                        label: "This is a heading"
                     }
                  },
                  {
                     name: "alfresco/html/Spacer",
                     config: {
                        height: "50px"
                     }
                  },
                  {
                     name: "alfresco/html/Heading",
                     config: {
                        level: 2,
                        label: "This is a heading"
                     }
                  },
                  {
                     name: "alfresco/html/Spacer",
                     config: {
                        height: "50px"
                     }
                  },
                  {
                     name: "alfresco/html/Heading",
                     config: {
                        level: 2,
                        label: "This is a heading"
                     }
                  },
                  {
                     name: "alfresco/html/Spacer",
                     config: {
                        height: "50px"
                     }
                  },
                  {
                     name: "alfresco/html/Heading",
                     config: {
                        level: 2,
                        label: "This is a heading"
                     }
                  },
                  {
                     name: "alfresco/html/Spacer",
                     config: {
                        height: "50px"
                     }
                  },
                  {
                     name: "alfresco/html/Heading",
                     config: {
                        level: 2,
                        label: "This is a heading"
                     }
                  },
                  {
                     name: "alfresco/html/Spacer",
                     config: {
                        height: "50px"
                     }
                  }
               ],
               widgetsButtons: [
                  {
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        label: "OK",
                        additionalCssClasses: "cancellationButton",
                        publishTopic: "LONG_DIALOG_CLOSED"
                     }
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "CREATE_LONG_FORM_DIALOG",
         config: {
            label: "Create Long Form Dialog",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "LFD",
               dialogTitle: "Long Form Dialog",
               formSubmissionTopic: "POST_DIALOG_2",
               formSubmissionPayloadMixin: {
                  bonusData: "test"
               },
               widgets: [
                  {
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        name: "text",
                        label: "Enter some text",
                        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                        requirementConfig: {
                           initialValue: true
                        }
                     }
                  },
                  {
                     name: "alfresco/forms/controls/TextArea",
                     config: {
                        name: "text",
                        label: "Enter some text",
                        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                     }
                  },
                  {
                     name: "alfresco/forms/controls/Select",
                     config: {
                        name: "text",
                        label: "Enter some text",
                        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                        optionsConfig: {
                           fixed: [
                              { label: "One", value: "ONE"}
                           ]
                        }
                     }
                  },
                  {
                     name: "alfresco/forms/controls/DateTextBox",
                     config: {
                        name: "text",
                        label: "Enter some text",
                        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                     }
                  },
                  {
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        name: "text",
                        label: "Enter some text",
                        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                     }
                  },
                  {
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        name: "text",
                        label: "Enter some text"
                     }
                  },
                  {
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        name: "text",
                        label: "Enter some text"
                     }
                  },
                  {
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        name: "text",
                        label: "Enter some text"
                     }
                  }
               ]
            }
         }
      },
      {
         id: "FULL_SCREEN_DIALOG",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Create Full Screen Dialog",
            publishTopic: "ALF_CREATE_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "FSD1",
               dialogTitle: "Full Screen Dialog",
               fullScreenMode: true,
               fullScreenPadding: 20,
               textContent: "Hello World",
               publishOnShow: [
                  {
                     publishTopic: "DISPLAYED_FD1",
                     publishPayload: {}
                  }
               ],
               widgetsButtons: [
                  {
                     id: "FULL_SCREEN_DIALOG_CLOSE",
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        label: "OK",
                        additionalCssClasses: "cancellationButton",
                        publishTopic: "ALF_ITEMS_SELECTED"
                     }
                  }
               ]
            }
         }
      },
      {
         id: "FULL_SCREEN_FORM_DIALOG",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Create Form Dialog (with custom scoping)",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "FSD2",
               dialogTitle: "Full Screen Form Dialog",
               fullScreenMode: true,
               fullScreenPadding: 40,
               formSubmissionTopic: "FULL_SCREEN_TOPIC",
               formSubmissionGlobal: false,
               formSubmissionScope: "FULL_SCREEN__SCOPE_",
               widgets: [
                  {
                     id: "FS_FORM_TEXTBOX",
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        name: "text",
                        label: "Enter some text",
                        value: "This is some sample text"
                     }
                  }
               ]
            }
         }
      },
      {
         id: "RESIZING_DIALOG_BUTTON",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Create Resizing Form Dialog",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "RESIZING_DIALOG",
               dialogTitle: "Resizing Form Dialog",
               formSubmissionTopic: "RESIZING_DIALOG_SUBMISSION",
               widgets: [
                  {
                     name: "alfresco/forms/controls/Select",
                     config: {
                        fieldId: "DISPLAY_MORE",
                        label: "Display more fields",
                        name: "displayMore",
                        optionsConfig: {
                           fixed: [
                              {
                                 value: "NO",
                                 label: "No"
                              },
                              {
                                 value: "YES",
                                 label: "Yes"
                              }
                           ]
                        }
                     }
                  },
                  {
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        fieldId: "OPTION_1",
                        label: "Option 1 value",
                        name: "option1",
                        visibilityConfig: {
                           initialValue: false,
                           rules: [
                              {
                                 targetId: "DISPLAY_MORE",
                                 is: ["YES"]
                              }
                           ]
                        }
                     }
                  },
                  {
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        fieldId: "OPTION_2",
                        label: "Option 2 value",
                        name: "option2",
                        visibilityConfig: {
                           initialValue: false,
                           rules: [
                              {
                                 targetId: "DISPLAY_MORE",
                                 is: ["YES"]
                              }
                           ]
                        }
                     }
                  },
                  {
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        fieldId: "OPTION_3",
                        label: "Option 3 value",
                        name: "option3",
                        visibilityConfig: {
                           initialValue: false,
                           rules: [
                              {
                                 targetId: "DISPLAY_MORE",
                                 is: ["YES"]
                              }
                           ]
                        }
                     }
                  },
                  {
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        fieldId: "OPTION_4",
                        label: "Option 4 value",
                        name: "option4",
                        visibilityConfig: {
                           initialValue: false,
                           rules: [
                              {
                                 targetId: "DISPLAY_MORE",
                                 is: ["YES"]
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
         name: "alfresco/logging/DebugLog"
      }
   ]
};