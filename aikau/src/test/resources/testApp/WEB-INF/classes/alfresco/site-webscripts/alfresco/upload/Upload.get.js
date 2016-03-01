/* global page */
/* jshint sub:true */
var respondAfter = null;
if (page.url.args["respondAfter"])
{
   respondAfter = parseInt(page.url.args["respondAfter"], 10);
}

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
      "alfresco/services/DialogService",
      {
         name: "alfresco/services/UploadService",
         config: {
            widgetsForUploadDisplay: [{
               name: "alfresco/upload/AlfUploadDisplay"
           }]
         }
      },
      {
         name: "alfresco/services/UploadService",
         config: {
            pubSubScope: "CUSTOM_BUTTON_",
            uploadsContainerTitle: "Custom Title",
            widgetsButtons: [
               {
                  id: "ALF_UPLOAD_PROGRESS_DIALOG_CANCELLATION",
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: "Custom Label",
                     publishTopic: "ALF_UPLOAD_DIALOG_CANCEL_CLICK",
                     additionalCssClasses: "call-to-action"
                  }
               }
            ]
         }
      }
   ],
   widgets: [
      {
         name: "alfresco/upload/AlfFileDrop",
         config: {
            destinationNodeRef: "workspace://SpacesStore/671536ac-1a87-48a4-9be6-8af97906b71a"
         }
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
         id: "SINGLE_UPLOAD_CUSTOM_BUTTON",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Single File Upload (Custom Button Label)",
            pubSubScope: "CUSTOM_BUTTON_",
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
               alfResponseTopic: "UPLOAD_COMPLETE_OR_CANCELLED",
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
         name: "aikauTesting/mockservices/UploadMockXhr",
         config: {
            respondAfter: respondAfter
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};