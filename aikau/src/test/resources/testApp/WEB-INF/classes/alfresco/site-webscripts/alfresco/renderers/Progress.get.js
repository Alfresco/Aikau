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
      }
   ],
   widgets:[
      {
         id: "SEMI-COMPLETE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "50% Complete",
            publishTopic: "PROGRESS1_ALF_PROGRESS_RENDER",
            publishPayload: {
               response: {
                  done: 4,
                  total: 8,
                  filesAdded: 3,
                  totalFiles: 7
               }
            }
         }
      },
      {
         id: "THREE-QUARTERS-COMPLETE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "75% Complete",
            publishTopic: "PROGRESS1_ALF_PROGRESS_UPDATED",
            publishPayload: {
               response: {
                  done: 6,
                  total: 8,
                  filesAdded: 7,
                  totalFiles: 7
               }
            }
         }
      },
      {
         id: "FULLY-COMPLETE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Complete",
            publishTopic: "PROGRESS1_ALF_PROGRESS_COMPLETED",
            publishPayload: {
               response: {
                  done: 6,
                  total: 8,
                  filesAdded: 7,
                  totalFiles: 7
               }
            }
         }
      },
      {
         id: "CANCELLED",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Cancel",
            publishTopic: "PROGRESS1_ALF_PROGRESS_CANCELLED",
            publishPayload: {
            }
         }
      },
      {
         id: "ERROR",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Error",
            publishTopic: "PROGRESS1_ALF_PROGRESS_ERROR",
            publishPayload: {
            }
         }
      },
      {
         id: "PROGRESS1",
         name: "alfresco/renderers/Progress",
         config: {
            pubSubScope: "PROGRESS1_",
            requestProgressTopic: "ALF_ARCHIVE_REQUEST",
            progressFinishedTopic: ["ALF_DOWNLOAD_FILE", "ALF_ARCHIVE_DELETE"],
            nodes: ["one","two"]
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