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
                              source: "alfresco/html/svg/undo.svg",
                              symbolId: "undo",
                              height: 16,
                              width: 16,
                              title: "Undo upload",
                              publishTopic: "UNDO_UPLOAD",
                              publishPayload: {
                                 nodeRef: "{response.nodeRef}",
                                 fileName: "{fileObj.name}"
                              }
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      "alfresco/services/NotificationService",
      "aikauTesting/mockservices/FileUploadMockService"
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
         id: "LONG_FILENAME_UPLOAD",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Long Filename Upload",
            publishTopic: "ALF_UPLOAD_REQUEST",
            publishPayload: {
               alfResponseTopic: "UPLOAD_COMPLETE_OR_CANCELLED",
               files: [
                  {
                     size: 987654351,
                     name: "This is a (really) long filename that [should] definitely cause display problems on any {sensible} display (resolution).xls"
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