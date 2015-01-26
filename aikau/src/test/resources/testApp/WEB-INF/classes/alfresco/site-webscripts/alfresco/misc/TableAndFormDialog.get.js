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
      "alfresco/dialogs/AlfDialogService",
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         name: "alfresco/documentlibrary/views/AlfDocumentListView",
         config: {
            id: "TABLE_VIEW",
            currentData: {
               items: [
                  {id: "ID1", name: "Test1", option: "1"},
                  {id: "ID2", name: "Test2", option: "2"}
               ]
            },
            widgetsForHeader: [
               {
                  name: "alfresco/documentlibrary/views/layouts/HeaderCell",
                  config: {
                     id: "ID",
                     label: "Identifier"
                  }
               },
               {
                  name: "alfresco/documentlibrary/views/layouts/HeaderCell",
                  config: {
                     id: "NAME",
                     label: "Name"
                  }
               },
               {
                  name: "alfresco/documentlibrary/views/layouts/HeaderCell",
                  config: {
                     id: "OPTION",
                     label: "Option"
                  }
               }
            ],
            widgets:[
               {
                  name: "alfresco/documentlibrary/views/layouts/Row",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/documentlibrary/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/renderers/PropertyLink",
                                    config: {
                                       propertyToRender: "id",
                                       useCurrentItemAsPayload: false,
                                       publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
                                       publishPayloadType: "PROCESS",
                                       publishPayloadModifiers: ["processCurrentItemTokens","setCurrentItem"],
                                       publishPayload: {
                                          dialogTitle: "{id}",
                                          dialogConfirmationButtonTitle: "Update",
                                          dialogCancellationButtonTitle: "Close",
                                          formSubmissionTopic: "ALF_CRUD_UPDATE",
                                          widgets: [
                                             {
                                                name: "alfresco/forms/ControlRow",
                                                config: {
                                                   widgets: [
                                                      {
                                                         name: "alfresco/forms/controls/DojoValidationTextBox",
                                                         config: {
                                                            fieldId: "FORM_ID",
                                                            name: "id",
                                                            label: "Identifier"
                                                         }
                                                      },
                                                      {
                                                         name: "alfresco/forms/controls/DojoValidationTextBox",
                                                         config: {
                                                            fieldId: "FORM_NAME",
                                                            name: "name",
                                                            label: "Name"
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
                                                         name: "alfresco/forms/controls/DojoSelect",
                                                         config: {
                                                            fieldId: "FORM_OPTION",
                                                            name: "option",
                                                            label: "Option",
                                                            optionsConfig: {
                                                               fixed: [
                                                                  {label:"One",value:"1"},
                                                                  {label:"Two",value:"2"},
                                                                  {label:"Three",value:"3"}
                                                               ]
                                                            }
                                                         }
                                                      }
                                                   ]
                                                }
                                             }
                                          ],
                                          formValue: "___AlfCurrentItem"
                                       }
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           name: "alfresco/documentlibrary/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "name"
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           name: "alfresco/documentlibrary/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "option"
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
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};