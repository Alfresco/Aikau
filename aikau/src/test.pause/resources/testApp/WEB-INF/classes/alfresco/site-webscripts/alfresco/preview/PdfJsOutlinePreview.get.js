model.jsonModel = {
   publishOnReady: [
      {
         publishTopic: "ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST",
         publishPayload: {
            dataSource: "customNodeRef",
            nodeRef: "workspace://SpacesStore/4ac29928-4ce3-4526-a5ca-3be256220663"
         }
      }
   ],
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
      "alfresco/services/ErrorReporter",
      "alfresco/services/DialogService",
      "alfresco/services/NotificationService"
   ],
   widgets:[
      {
         id: "PDF_DOCUMENT",
         name: "alfresco/documentlibrary/AlfDocument",
         config: {
            widgets: [
               {
                  id: "PDF_PREVIEW",
                  name: "alfresco/preview/AlfDocumentPreview",
                  config: {
                     widgetsForPluginsOverrides: [
                        {
                           id: "PdfJs",
                           replace: true,
                           name: "alfresco/preview/PdfJs/PdfJs",
                           config: {
                              // Optional configuration that we could add now
                              id: "PDF_PLUGIN_1"
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/PdfJsMockXhr",
         config: {
            
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