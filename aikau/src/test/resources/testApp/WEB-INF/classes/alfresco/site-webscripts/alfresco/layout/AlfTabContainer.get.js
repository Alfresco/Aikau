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
                           name: "alfresco/layout/AlfTabContainer",
                           config: {
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
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "SELECT_TAB_1",
                              label: "Select tab 1 (idx 0)",
                              publishTopic: "TABCONTAINER_SELECT_TAB_TOPIC",
                              publishPayload: {
                                 index: 0
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "SELECT_TAB_2",
                              label: "Select tab 2 (idx 1)",
                              publishTopic: "TABCONTAINER_SELECT_TAB_TOPIC",
                              publishPayload: {
                                 index: 1
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "SELECT_TAB_3",
                              label: "Select tab titled 'Logo 1'",
                              publishTopic: "TABCONTAINER_SELECT_TAB_TOPIC",
                              publishPayload: {
                                 title: "Logo 1"
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "SELECT_TAB_4",
                              label: "Select tab titled 'Logo 2'",
                              publishTopic: "TABCONTAINER_SELECT_TAB_TOPIC",
                              publishPayload: {
                                 title: "Logo 2"
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "SELECT_TAB_5",
                              label: "Select tab with id 'dijit_layout_ContentPane_0'",
                              publishTopic: "TABCONTAINER_SELECT_TAB_TOPIC",
                              publishPayload: {
                                 id: "dijit_layout_ContentPane_0"
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "SELECT_TAB_6",
                              label: "Select tab with id 'dijit_layout_ContentPane_1'",
                              publishTopic: "TABCONTAINER_SELECT_TAB_TOPIC",
                              publishPayload: {
                                 id: "dijit_layout_ContentPane_1"
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
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "DISABLE_TAB_1",
                              label: "Disable tab 1 (idx 0)",
                              publishTopic: "TABCONTAINER_DISABLE_TAB_TOPIC",
                              publishPayload: {
                                 index: 0,
                                 value: true
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "DISABLE_TAB_2",
                              label: "Enable tab 1 (idx 0)",
                              publishTopic: "TABCONTAINER_DISABLE_TAB_TOPIC",
                              publishPayload: {
                                 index: 0,
                                 value: false
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "DISABLE_TAB_3",
                              label: "Disable tab titled 'Logo 1'",
                              publishTopic: "TABCONTAINER_DISABLE_TAB_TOPIC",
                              publishPayload: {
                                 title: "Logo 1",
                                 value: true
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "DISABLE_TAB_4",
                              label: "Enable tab titled 'Logo 1'",
                              publishTopic: "TABCONTAINER_DISABLE_TAB_TOPIC",
                              publishPayload: {
                                 title: "Logo 1",
                                 value: false
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "DISABLE_TAB_5",
                              label: "Disable tab with id 'dijit_layout_ContentPane_0'",
                              publishTopic: "TABCONTAINER_DISABLE_TAB_TOPIC",
                              publishPayload: {
                                 id: "dijit_layout_ContentPane_0",
                                 value: true
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "DISABLE_TAB_6",
                              label: "Enable tab with id 'dijit_layout_ContentPane_0'",
                              publishTopic: "TABCONTAINER_DISABLE_TAB_TOPIC",
                              publishPayload: {
                                 id: "dijit_layout_ContentPane_0",
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
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "DELETE_TAB_1",
                              label: "Delete tab 7 (idx 6)",
                              publishTopic: "TABCONTAINER_DELETE_TAB_TOPIC",
                              publishPayload: {
                                 index: 6
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "DELETE_TAB_2",
                              label: "Delete tab titled 'Logo 8'",
                              publishTopic: "TABCONTAINER_DELETE_TAB_TOPIC",
                              publishPayload: {
                                 title: "Logo 8"
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "DELETE_TAB_3",
                              label: "Delete tab with id 'dijit_layout_ContentPane_8'",
                              publishTopic: "TABCONTAINER_DELETE_TAB_TOPIC",
                              publishPayload: {
                                 id: "dijit_layout_ContentPane_8"
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