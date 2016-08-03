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
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         name: "alfresco/layout/VerticalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/layout/HorizontalWidgets",
                  config: {
                     widgets: [
                        {
                           id: "TC",
                           name: "alfresco/layout/AlfTabContainer",
                           config: {
                              padded: true,
                              tabSelectionTopic: "TABCONTAINER_SELECT_TAB_TOPIC",
                              tabDisablementTopic: "TABCONTAINER_DISABLE_TAB_TOPIC",
                              tabAdditionTopic: "TABCONTAINER_ADD_TAB_TOPIC",
                              tabDeletionTopic: "TABCONTAINER_DELETE_TAB_TOPIC",
                              widgets: [
                                 {
                                    id: "Logo1",
                                    name: "alfresco/logo/Logo",
                                    title: "Logo 1",
                                    config: {
                                       logoClasses: "alfresco-logo-only"
                                    }
                                 },
                                 {
                                    id: "Logo2",
                                    name: "alfresco/logo/Logo",
                                    title: "Logo 2",
                                    config: {
                                       logoClasses: "surf-logo-large"
                                    }
                                 },
                                 {
                                    id: "Logo3",
                                    name: "alfresco/logo/Logo",
                                    selected: true,
                                    iconClass: "dijitEditorIcon dijitEditorIconSave",
                                    config: {
                                       logoClasses: "alfresco-logo-only"
                                    }
                                 },
                                 {
                                    id: "Logo4",
                                    name: "alfresco/logo/Logo",
                                    iconClass: "dijitEditorIcon dijitEditorIconSave",
                                    closable: true,
                                    config: {
                                       logoClasses: "surf-logo-large"
                                    }
                                 },
                                 {
                                    id: "Logo5",
                                    name: "alfresco/logo/Logo",
                                    disabled: true,
                                    title: "Logo 5",
                                    config: {
                                       logoClasses: "alfresco-logo-only"
                                    }
                                 },
                                 {
                                    id: "Logo6",
                                    name: "alfresco/logo/Logo",
                                    delayProcessing: true,
                                    title: "Logo 6",
                                    config: {
                                       logoClasses: "surf-logo-large"
                                    }
                                 },
                                 {
                                    id: "Logo7",
                                    name: "alfresco/logo/Logo",
                                    title: "Logo 7",
                                    config: {
                                       logoClasses: "alfresco-logo-only"
                                    }
                                 },
                                 {
                                    id: "Logo8",
                                    name: "alfresco/logo/Logo",
                                    title: "Logo 8",
                                    config: {
                                       logoClasses: "surf-logo-large"
                                    }
                                 },
                                 {
                                    id: "Logo9",
                                    name: "alfresco/logo/Logo",
                                    title: "Logo 9",
                                    config: {
                                       logoClasses: "alfresco-logo-only"
                                    }
                                 },
                                 {
                                    id: "FormControl1",
                                    name: "alfresco/forms/controls/Select",
                                    title: "DP Form Control",
                                    delayProcessing: true,
                                    config: {
                                       fieldId: "SELECT",
                                       name: "select",
                                       label: "Select...",
                                       value: "One",
                                       description: "An example select form control",
                                       optionsConfig: {
                                          fixed: [
                                             {label: "One", value: "One"},
                                             {label: "Two", value: "Two"},
                                             {label: "Three", value: "Three"}
                                          ]
                                       }
                                    }
                                 },
                                 {
                                    id: "FormControl2",
                                    name: "alfresco/forms/controls/Select",
                                    title: "Non-DP Form Control",
                                    delayProcessing: false,
                                    config: {
                                       fieldId: "SELECT",
                                       name: "select",
                                       label: "Select...",
                                       value: "One",
                                       description: "An example select form control",
                                       optionsConfig: {
                                          fixed: [
                                             {label: "One", value: "One"},
                                             {label: "Two", value: "Two"},
                                             {label: "Three", value: "Three"}
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
                  name: "alfresco/layout/VerticalWidgets",
                  config: {
                     widgets: [
                        {
                           id: "SELECT_TAB_1",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Select tab 1 (idx 0)",
                              publishTopic: "TABCONTAINER_SELECT_TAB_TOPIC",
                              publishPayload: {
                                 index: 0
                              }
                           }
                        },
                        {
                           id: "SELECT_TAB_2",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Select tab 2 (idx 1)",
                              publishTopic: "TABCONTAINER_SELECT_TAB_TOPIC",
                              publishPayload: {
                                 index: 1
                              }
                           }
                        },
                        {
                           id: "SELECT_TAB_3",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Select tab titled 'Logo 1'",
                              publishTopic: "TABCONTAINER_SELECT_TAB_TOPIC",
                              publishPayload: {
                                 title: "Logo 1"
                              }
                           }
                        },
                        {
                           id: "SELECT_TAB_4",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Select tab titled 'Logo 2'",
                              publishTopic: "TABCONTAINER_SELECT_TAB_TOPIC",
                              publishPayload: {
                                 title: "Logo 2"
                              }
                           }
                        },
                        {
                           id: "SELECT_TAB_5",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Select tab with id 'Logo1'",
                              publishTopic: "TABCONTAINER_SELECT_TAB_TOPIC",
                              publishPayload: {
                                 id: "Logo1"
                              }
                           }
                        },
                        {
                           id: "SELECT_TAB_6",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Select tab with id 'Logo2'",
                              publishTopic: "TABCONTAINER_SELECT_TAB_TOPIC",
                              publishPayload: {
                                 id: "Logo2"
                              }
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
                           id: "DISABLE_TAB_BY_INDEX",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Disable tab 1 (idx 0)",
                              publishTopic: "TABCONTAINER_DISABLE_TAB_TOPIC",
                              publishPayload: {
                                 index: 0,
                                 value: true
                              }
                           }
                        },
                        {
                           id: "ENABLE_TAB_BY_INDEX",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Enable tab 1 (idx 0)",
                              publishTopic: "TABCONTAINER_DISABLE_TAB_TOPIC",
                              publishPayload: {
                                 index: 0,
                                 value: false
                              }
                           }
                        },
                        {
                           id: "DISABLE_TAB_BY_TITLE",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Disable tab titled 'Logo 1'",
                              publishTopic: "TABCONTAINER_DISABLE_TAB_TOPIC",
                              publishPayload: {
                                 title: "Logo 1",
                                 value: true
                              }
                           }
                        },
                        {
                           id: "ENABLE_TAB_BY_TITLE",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Enable tab titled 'Logo 1'",
                              publishTopic: "TABCONTAINER_DISABLE_TAB_TOPIC",
                              publishPayload: {
                                 title: "Logo 1",
                                 value: false
                              }
                           }
                        },
                        {
                           id: "DISABLE_TAB_BY_ID",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Disable tab with id 'Logo1'",
                              publishTopic: "TABCONTAINER_DISABLE_TAB_TOPIC",
                              publishPayload: {
                                 id: "Logo1",
                                 value: true
                              }
                           }
                        },
                        {
                           id: "ENABLE_TAB_BY_ID",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Enable tab with id 'Logo1'",
                              publishTopic: "TABCONTAINER_DISABLE_TAB_TOPIC",
                              publishPayload: {
                                 id: "Logo1",
                                 value: false
                              }
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
                           id: "DELETE_TAB_BY_INDEX",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Delete tab 7 (idx 6)",
                              publishTopic: "TABCONTAINER_DELETE_TAB_TOPIC",
                              publishPayload: {
                                 index: 6
                              }
                           }
                        },
                        {
                           id: "DELETE_TAB_BY_TITLE",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Delete tab titled 'Logo 8'",
                              publishTopic: "TABCONTAINER_DELETE_TAB_TOPIC",
                              publishPayload: {
                                 title: "Logo 8"
                              }
                           }
                        },
                        {
                           id: "DELETE_TAB_BY_ID",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Delete tab with id 'Logo9'",
                              publishTopic: "TABCONTAINER_DELETE_TAB_TOPIC",
                              publishPayload: {
                                 id: "Logo9"
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
};