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
      "alfresco/services/DialogService",
      "alfresco/services/CrudService",
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         name: "alfresco/forms/controls/PropertyPicker",
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