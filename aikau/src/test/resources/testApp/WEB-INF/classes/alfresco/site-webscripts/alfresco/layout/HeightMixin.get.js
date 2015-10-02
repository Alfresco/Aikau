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
      "alfresco/services/DialogService"
   ],
   widgets:[
      {
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgetMarginLeft: 10,
            widgetMarginRight: 10,
            widgets: [
               {
                  id: "AUTO",
                  name: "aikauTesting/widgets/TestHeight",
                  config: {
                     heightMode: "AUTO",
                     label: "Client height"
                  }
               },
               {
                  id: "AUTO_WITH_ADJUSTMENT",
                  name: "aikauTesting/widgets/TestHeight",
                  config: {
                     heightMode: "AUTO",
                     heightAdjustment: 50,
                     label: "Client height with adjustment"
                  }
               },
               {
                  id: "FIXED",
                  name: "aikauTesting/widgets/TestHeight",
                  config: {
                     heightMode: 200,
                     label: "200px"
                  }
               },
               {
                  id: "MINUS",
                  name: "aikauTesting/widgets/TestHeight",
                  config: {
                     heightMode: -100,
                     label: "Client height minus 100px"
                  }
               },
               {
                  id: "DIALOG_LAUNCH_PANEL",
                  name: "alfresco/layout/ClassicWindow",
                  widthPx: 500,
                  config: {
                     title: "Dialog launch panel",
                     widgets: [
                        {
                           id: "LAUNCH_DIALOG_1",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "No padding, 300px",
                              publishTopic: "ALF_CREATE_DIALOG_REQUEST",
                              publishPayload: {
                                 dialogId: "HEIGHT_DIALOG_1",
                                 dialogTitle: "Dialog",
                                 contentWidth: "700px",
                                 contentHeight: "300px",
                                 additionalCssClasses: "no-padding",
                                 widgetsContent: [
                                    {
                                       id: "DIALOG_1_TEST",
                                       name: "aikauTesting/widgets/TestHeight",
                                       config: {
                                          heightMode: "DIALOG",
                                          heightAdjustment: 2,
                                          label: "Dialog body height (300px)"
                                       }
                                    }
                                 ]
                              }
                           }
                        },
                        {
                           id: "LAUNCH_DIALOG_2",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Padding, 100px",
                              publishTopic: "ALF_CREATE_DIALOG_REQUEST",
                              publishPayload: {
                                 dialogId: "HEIGHT_DIALOG_2",
                                 dialogTitle: "Dialog",
                                 contentWidth: "700px",
                                 contentHeight: "100px",
                                 widgetsContent: [
                                    {
                                       id: "DIALOG_2_TEST",
                                       name: "aikauTesting/widgets/TestHeight",
                                       config: {
                                          heightMode: "DIALOG",
                                          heightAdjustment: 2,
                                          label: "Dialog body height (200px)"
                                       }
                                    }
                                 ]
                              }
                           }
                        },
                        {
                           id: "LAUNCH_DIALOG_3",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "No height, defaults",
                              publishTopic: "ALF_CREATE_DIALOG_REQUEST",
                              publishPayload: {
                                 dialogId: "HEIGHT_DIALOG_3",
                                 dialogTitle: "Dialog",
                                 widgetsContent: [
                                    {
                                       id: "DIALOG_3_TEST",
                                       name: "aikauTesting/widgets/TestHeight",
                                       config: {
                                          heightMode: "DIALOG",
                                          heightAdjustment: 2,
                                          label: "Dialog body height (auto)"
                                       }
                                    }
                                 ]
                              }
                           }
                        },
                        {
                           id: "LAUNCH_DIALOG_4",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Height, defaults, buttons",
                              publishTopic: "ALF_CREATE_DIALOG_REQUEST",
                              publishPayload: {
                                 dialogId: "HEIGHT_DIALOG_4",
                                 dialogTitle: "Dialog",
                                 widgetsContent: [
                                    {
                                       id: "DIALOG_4_TEST",
                                       name: "aikauTesting/widgets/TestHeight",
                                       config: {
                                          heightMode: "DIALOG",
                                          heightAdjustment: 2,
                                          label: "Dialog body height (auto)"
                                       }
                                    }
                                 ],
                                 widgetsButtons: [
                                    {
                                       name: "alfresco/buttons/AlfButton",
                                       config: {
                                          label: "Done",
                                          publishTopic: "NO_OP"
                                       }
                                    }
                                 ]
                              }
                           }
                        },
                        {
                           id: "FULL_SCREEN_DIALOG_NO_BUTTON",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Launch full screen dialog",
                              publishTopic: "ALF_CREATE_DIALOG_REQUEST",
                              publishPayload: {
                                 dialogId: "FSDNB",
                                 dialogTitle: "Full Screen Dialog",
                                 fullScreenMode: true,
                                 fullScreenPadding: 40,
                                 widgetsContent: [
                                    {
                                       name: "alfresco/layout/FixedHeaderFooter",
                                       widthPc: 50,
                                       config: {
                                          heightMode: "DIALOG",
                                          widgetsForHeader: [
                                             {
                                                name: "alfresco/html/Label",
                                                config: {
                                                   label: "Header"
                                                }
                                             }
                                          ],
                                          widgets: [
                                             {
                                                name: "alfresco/html/Label",
                                                config: {
                                                   label: "Content"
                                                }
                                             }
                                          ],
                                          widgetsForFooter: [
                                             {
                                                name: "alfresco/html/Label",
                                                config: {
                                                   label: "Footer"
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
                           id: "FULL_SCREEN_DIALOG",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Full Screen With HeightMixin Content",
                              publishTopic: "ALF_CREATE_DIALOG_REQUEST",
                              publishPayload: {
                                 dialogId: "FSD",
                                 dialogTitle: "Full Screen Dialog",
                                 fullScreenMode: true,
                                 fullScreenPadding: 40,
                                 widgetsContent: [
                                    {
                                       name: "alfresco/layout/FixedHeaderFooter",
                                       widthPc: 50,
                                       config: {
                                          heightMode: "DIALOG",
                                          widgetsForHeader: [
                                             {
                                                name: "alfresco/html/Label",
                                                config: {
                                                   label: "Header"
                                                }
                                             }
                                          ],
                                          widgets: [
                                             {
                                                name: "alfresco/html/Label",
                                                config: {
                                                   label: "Content"
                                                }
                                             }
                                          ],
                                          widgetsForFooter: [
                                             {
                                                name: "alfresco/html/Label",
                                                config: {
                                                   label: "Footer"
                                                }
                                             }
                                          ]
                                       }
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
                        }
                     ]
                  }
               }
            ]
         }
      }
   ]
};