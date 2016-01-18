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
      "alfresco/services/PanelUploadService"
   ],
   widgets: [
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
                     name: "This file is empty.txt"
                  }
               ],
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
                     name: "Tiny dataset.csv"
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
               alfResponseTopic: "UPLOAD_COMPLETE_OR_CANCELLED",
               files: [
                  {
                     size: 76048412,
                     name: "Aim for the stars.pdf"
                  },
                  {
                     size: 1547942,
                     name: "How to give great presentations.pptx"
                  },
                  {
                     size: 0,
                     name: "README"
                  },
                  {
                     size: 2458657447,
                     name: "Iron Man 3.avi"
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
         name: "alfresco/logging/DebugLog"
      }
   ]
};