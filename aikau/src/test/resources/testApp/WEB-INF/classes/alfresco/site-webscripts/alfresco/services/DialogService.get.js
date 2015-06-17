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
      }, {
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
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};