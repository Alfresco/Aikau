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
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/upload/AlfFileDrop",
         config: {
            destinationNodeRef: "workspace://SpacesStore/671536ac-1a87-48a4-9be6-8af97906b71a"
         }
      },
      {
         name: "alfresco/upload/AlfUpload"
      },
      {
         id: "BAD_FILE_DATA",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Bad File Data",
            publishTopic: "ALF_UPLOAD_REQUEST",
            publishPayload: {
               files: [
                  {
                     size: 0,
                     name: "Zero Bytes File"
                  }
               ],
               targetData: {
                  destination: "some://fake/node"
               }
            }
         }
      },
      {
         id: "NO_FILES_UPLOAD",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Provide No Files",
            publishTopic: "ALF_UPLOAD_REQUEST",
            publishPayload: {
               files: [],
               targetData: {
                  destination: "some://fake/node"
               }
            }
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
         id: "MULTI_UPLOAD",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Multiple File Upload",
            publishTopic: "ALF_UPLOAD_REQUEST",
            publishPayload: {
               files: [
                  {
                     size: 100,
                     name: "100 Bytes File"
                  },
                  {
                     size: 500,
                     name: "500 Bytes File"
                  },
                  {
                     size: 700,
                     name: "700 Bytes File"
                  },
                  {
                     size: 987,
                     name: "987 Bytes File"
                  }
               ],
               targetData: {
                  destination: "some://fake/node"
               }
            }
         }
      },
      {
         name: "aikauTesting/mockservices/UploadMockXhr"
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};