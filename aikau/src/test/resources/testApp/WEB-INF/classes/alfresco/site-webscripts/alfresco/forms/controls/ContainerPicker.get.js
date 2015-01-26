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
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         name: "alfresco/forms/controls/ContainerPicker",
         config: {
            id: "DOCUMENT_PICKER",
            label: "Items"
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