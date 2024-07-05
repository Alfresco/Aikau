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
      {
         name: "alfresco/services/FileUploadService",
         config: {
            apiVersion: 1
         }
      },
      "alfresco/services/NotificationService"
   ],
   widgets: [
      {
         id: "V1_API_UPLOAD",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "V1 API Upload",
            publishTopic: "ALF_UPLOAD_REQUEST",
            publishPayload: {
               alfResponseTopic: "UPLOAD_COMPLETE_OR_CANCELLED",
               files: [
                  {
                     size: 1337,
                     name: "File for v1 API.docx"
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
            averageUploadTimeSecs: 3
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};