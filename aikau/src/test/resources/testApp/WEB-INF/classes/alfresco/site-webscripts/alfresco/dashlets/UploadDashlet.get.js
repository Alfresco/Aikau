/*jshint maxlen:false*/

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
      "alfresco/services/DashletService",
      "alfresco/services/UploadService",
      "alfresco/services/ContentService",
      "alfresco/services/DialogService",
      "aikauTesting/mockservices/UploadHistoryMockService"
   ],
   widgets: [
      {
         name: "alfresco/dashlets/Dashlet",
         id: "UPLOAD_DASHLET",
         config: {
            additionalCssClasses: "smallpad",
            pubSubScope: "UPLOAD_",
            title: "Upload",
            bodyHeight: 500,
            widgetsForTitleBarActions: [],
            widgetsForToolbar: [],
            widgetsForToolbar2: [],
            widgetsForBody: [
               {
                  name: "alfresco/layout/HorizontalWidgets",
                  config: {
                     widgets: [
                        {
                           id: "TARGET",
                           name: "alfresco/upload/UploadTarget"
                        },
                        {
                           id: "HISTORY",
                           name: "alfresco/upload/UploadHistory",
                           config: {
                              visibilityConfig: {
                                 initialValue: false,
                                 rules: [
                                    {
                                       topic: "ALF_DOCLIST_RELOAD_DATA",
                                       attribute: "alfTopic",
                                       isNot: [null]
                                    }
                                 ]
                              }
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         id: "SIM_BUTTON",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Simulate dialog confirmation",
            publishTopic: "ALF_CONTENT_SERVICE_UPLOAD_REQUEST_RECEIVED",
            publishPayload: {
               responseScope: "UPLOAD_",
               targetData: {
                  siteId: null,
                  containerId: null,
                  uploadDirectory: null,
                  description: "",
                  overwrite: false,
                  thumbnails: "doclib",
                  username: null,
                  destination: [
                     "alfresco://user/home"
                  ]
               },
               files: [
                  {}
               ]
            }
         }
      },
      {
         name: "aikauTesting/mockservices/DashletServiceMockXhr"
      },
      {
         name: "aikauTesting/mockservices/UploadMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};