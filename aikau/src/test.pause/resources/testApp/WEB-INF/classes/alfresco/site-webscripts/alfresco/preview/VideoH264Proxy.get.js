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
      "alfresco/services/DocumentService",
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         name: "alfresco/documentlibrary/AlfDocument",
         config: {
            nodeRef: "workspace://SpacesStore/8a93f2cc-5276-45b6-929a-f5112e7a645d",
            widgets: [
               {
                  name: "alfresco/preview/AlfDocumentPreview",
                  config: {
                     widgetsForPluginsOverrides: [
                        {
                           id: "Video",
                           name: "alfresco/preview/Video",
                           config: {
                              autoPlay: true
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/PreviewMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};