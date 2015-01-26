model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true,
               warn: true,
               error: true
            }
         }
      },
      "alfresco/dialogs/AlfDialogService",
      "alfresco/services/DocumentService",
      "alfresco/services/SiteService",
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Pick a container",
            publishTopic: "ALF_CREATE_DIALOG_REQUEST",
            publishPayload: {
               dialogTitle: "picker.select.title",
               handleOverflow: false,
               widgetsContent: [
                  {
                     name: "alfresco/pickers/ContainerPicker"
                  }
               ],
               widgetsButtons: [
                  {
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        label: "picker.ok.label",
                        publishTopic: "ALF_ITEMS_SELECTED"
                     }
                  },
                  {
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        label: "picker.cancel.label",
                        publishTopic: "NO_OP"
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