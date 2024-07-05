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
      "alfresco/services/DocumentService"
   ],
   widgets: [
      {
         id: "SIM_DROP",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Simulate file drop",
            publishTopic: "SIM_FILE_DROP",
            publishPayload: {
               files: []
            }
         }
      },
      {
         name: "aikauTesting/widgets/DragAndDropUploadTester",
         config: {
            
         }
      },
      {
         name: "alfresco/testing/NodesMockXhr",
         config: {
            totalItems: 11
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};