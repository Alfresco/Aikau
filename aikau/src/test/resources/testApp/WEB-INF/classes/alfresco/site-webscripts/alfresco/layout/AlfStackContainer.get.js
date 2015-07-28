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
      "alfresco/services/NavigationService",
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
                           name: "alfresco/layout/AlfStackContainer",
                           config: {
                              paneSelectionTopic: "STACKCONTAINER_SELECT_PANE_TOPIC",
                              paneAdditionTopic: "STACKCONTAINER_ADD_PANE_TOPIC",
                              paneDeletionTopic: "STACKCONTAINER_DELETE_PANE_TOPIC",
                              paneSelectionHashVar: "pane",
                              widgets: [
                                 {
                                    id: "Logo1",
                                    title: "logo1",
                                    name: "alfresco/layout/VerticalWidgets",
                                    config: {
                                       widgets: [
                                          {
                                             id: "L1",
                                             name: "alfresco/html/Label",
                                             config: {
                                                label: "logo1"
                                             }
                                          },
                                          {
                                             name: "alfresco/logo/Logo",
                                             config: {
                                                logoClasses: "alfresco-logo-only"
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    id: "Logo2",
                                    title: "logo2",
                                    name: "alfresco/layout/VerticalWidgets",
                                    config: {
                                       widgets: [
                                          {
                                             id: "L2",
                                             name: "alfresco/html/Label",
                                             config: {
                                                label: "logo2"
                                             }
                                          },
                                          {
                                             name: "alfresco/logo/Logo",
                                             config: {
                                                logoClasses: "surf-logo-large"
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    id: "Logo3",
                                    title: "logo3",
                                    name: "alfresco/layout/VerticalWidgets",
                                    selected: true,
                                    config: {
                                       widgets: [
                                          {
                                             id: "L3",
                                             name: "alfresco/html/Label",
                                             config: {
                                                label: "logo3"
                                             }
                                          },
                                          {
                                             name: "alfresco/logo/Logo",
                                             config: {
                                                logoClasses: "alfresco-logo-only"
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    id: "Logo4",
                                    title: "logo4",
                                    name: "alfresco/layout/VerticalWidgets",
                                    config: {
                                       widgets: [
                                          {
                                             id: "L4",
                                             name: "alfresco/html/Label",
                                             config: {
                                                label: "logo4"
                                             }
                                          },
                                          {
                                             name: "alfresco/logo/Logo",
                                             config: {
                                                logoClasses: "surf-logo-large"
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    id: "Logo5",
                                    title: "logo5",
                                    name: "alfresco/layout/VerticalWidgets",
                                    config: {
                                       widgets: [
                                          {
                                             id: "L5",
                                             name: "alfresco/html/Label",
                                             config: {
                                                label: "logo5"
                                             }
                                          },
                                          {
                                             name: "alfresco/logo/Logo",
                                             config: {
                                                logoClasses: "alfresco-logo-only"
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
                  name: "alfresco/layout/VerticalWidgets",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "SELECT_PANE_1",
                              label: "Select pane 1 (idx 0)",
                              publishTopic: "STACKCONTAINER_SELECT_PANE_TOPIC",
                              publishPayload: {
                                 index: 0
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "SELECT_PANE_2",
                              label: "Select pane 2 (idx 1)",
                              publishTopic: "STACKCONTAINER_SELECT_PANE_TOPIC",
                              publishPayload: {
                                 index: 1
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "SELECT_PANE_3",
                              label: "Select pane titled 'logo3'",
                              publishTopic: "STACKCONTAINER_SELECT_PANE_TOPIC",
                              publishPayload: {
                                 title: "logo3"
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "SELECT_PANE_4",
                              label: "Select pane titled 'logo4'",
                              publishTopic: "STACKCONTAINER_SELECT_PANE_TOPIC",
                              publishPayload: {
                                 title: "logo4"
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "SELECT_PANE_5",
                              label: "Select pane with id 'dijit_layout_ContentPane_4'",
                              publishTopic: "STACKCONTAINER_SELECT_PANE_TOPIC",
                              publishPayload: {
                                 id: "dijit_layout_ContentPane_4"
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "SELECT_PANE_6",
                              label: "Select pane with id 'dijit_layout_ContentPane_0'",
                              publishTopic: "STACKCONTAINER_SELECT_PANE_TOPIC",
                              publishPayload: {
                                 id: "dijit_layout_ContentPane_0"
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
                           id: "SET_HASH1",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Set hash 1 - select pane 2",
                              publishTopic: "ALF_NAVIGATE_TO_PAGE",
                              publishPayload: {
                                 url: "pane=logo2",
                                 type: "HASH"
                              }
                           }
                        },
                        {
                           id: "SET_HASH2",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Set hash 2 - select pane 1",
                              publishTopic: "ALF_NAVIGATE_TO_PAGE",
                              publishPayload: {
                                 url: "pane=logo1",
                                 type: "HASH"
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
                              id: "DELETE_PANE_1",
                              label: "Delete pane 5 (idx 4)",
                              publishTopic: "STACKCONTAINER_DELETE_PANE_TOPIC",
                              publishPayload: {
                                 index: 4
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "DELETE_PANE_2",
                              label: "Delete pane titled 'logo3'",
                              publishTopic: "STACKCONTAINER_DELETE_PANE_TOPIC",
                              publishPayload: {
                                 title: "logo4"
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              id: "DELETE_PANE_3",
                              label: "Delete pane with id 'dijit_layout_ContentPane_2'",
                              publishTopic: "STACKCONTAINER_DELETE_PANE_TOPIC",
                              publishPayload: {
                                 id: "dijit_layout_ContentPane_2"
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
                              id: "ADD_PANE_99",
                              label: "Add pane 99",
                              publishTopic: "STACKCONTAINER_ADD_PANE_TOPIC",
                              publishPayload: {
                                 widgets: [
                                    {
                                       name: "alfresco/html/Label",
                                       title: "logo99",
                                       selected: true,
                                       config: {
                                          label: "logo99"
                                       }
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
         name: "alfresco/logging/DebugLog"
      }
   ]
};