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
            apiVersion: 1,
            maxSimultaneousUploads: 2,
            widgetsForUploadDisplay: [
               {
                  name: "alfresco/upload/UploadMonitor",
                  config: {
                     widgetsForSuccessfulActions: [
                        {
                           name: "alfresco/html/SVGImage",
                           config: {
                              source: "sfs/html/svg/undo.svg",
                              symbolId: "undo",
                              height: 11,
                              width: 11,
                              title: "This is a title",
                              publishTopic: "UNDO_UPLOAD",
                              publishGlobal: true,
                              publishPayloadType: "PROCESS",
                              publishPayload: {
                                 nodeId: "{fileId}",
                                 fileName: "{fileName}"
                              },
                              useCurrentItemAsPayload: false,
                              publishPayloadModifiers: [
                                 "processCurrentItemTokens"
                              ]
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      "alfresco/services/NotificationService"
   ],
   widgets: [
      {
         id: "DO_UPLOAD",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Do upload",
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