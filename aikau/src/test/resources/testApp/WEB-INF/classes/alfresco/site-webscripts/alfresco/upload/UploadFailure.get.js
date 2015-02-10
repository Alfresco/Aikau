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
      "alfresco/services/UploadService"
   ],
   widgets: [
      {
         name: "alfresco/upload/AlfFileDrop",
         config: {
            destinationNodeRef: "workspace://SpacesStore/671536ac-1a87-48a4-9be6-8af97906b71a"
         }
      },
      {
         id: "SINGLE_UPLOAD",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Single File Upload",
            publishTopic: "ALF_UPLOAD_REQUEST",
            publishPayload: {
               files: [
                  {
                     size: 100,
                     name: "100 Bytes File"
                  }
               ],
               targetData: {
                  destination: "some://fake/node"
               }
            }
         }
      },
      {
         name: "aikauTesting/mockservices/UploadMockXhr",
         config: {
            responseCode: 500
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