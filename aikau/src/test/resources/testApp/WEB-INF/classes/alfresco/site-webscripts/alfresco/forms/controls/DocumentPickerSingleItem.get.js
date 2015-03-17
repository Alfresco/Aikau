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
      "aikauTesting/mockservices/DocumentPickerTestService",
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         name: "alfresco/forms/controls/DocumentPicker",
         config: {
            id: "DOCUMENT_PICKER",
            label: "Items",
            configForPicker: {
               widgetsForPickedItems: [
                  {
                     name: "alfresco/pickers/PickedItems",
                     assignTo: "pickedItemsWidget",
                     config: {
                        singleItemMode: true
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