model.jsonModel = {
   publishOnReady: [
      {
         publishTopic: "GLOBAL_UPDATE_TOPIC"
      }
   ],
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
      "aikauTesting/mockservices/DojoSelectTestOptions",
      "alfresco/dialogs/AlfDialogService",
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/forms/Form",
         config: {
            id: "TEST_FORM",
            pubSubScope: "UNIT_TEST_",
            okButtonLabel: "All done here...",
            okButtonPublishTopic: "TEST_FORM_SUBMITTED",
            cancelButtonLabel: "Failed...",
            cancelButtonPublishTopic: "TEST_FORM_CANCELLED",
            okButtonPublishGlobal: true,
            widgets: [
               {
                  name: "alfresco/buttons/AlfFormDialogButton",
                  assignTo: "formDialogButton",
                  config: {
                     id: "TEST_DIALOG_BUTTON",
                     label: "Open dialog",
                     dialogTitle: "Twas brillig and the slithy toves...",
                     dialogConfirmationButtonTitle: "Ok friend",
                     dialogCancellationButtonTitle: "No thanks buddy",
                     formSubmissionTopic: "DIALOG_FORM_SUBMITTED",
                     widgets: [
                         {
                           name: "alfresco/forms/controls/DojoCheckBox",
                           config: {
                              id: "TEST_CHECKBOX_CONTAINER",
                              fieldId: "TEST_CHECKBOX",
                              label: "Test checkbox",
                              value: "jabberwocky"
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