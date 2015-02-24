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
      "alfresco/services/DialogService"
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
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};