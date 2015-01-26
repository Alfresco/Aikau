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
      "alfresco/services/ErrorReporter",
      "alfresco/dialogs/AlfDialogService",
      "alfresco/services/NotificationService"
   ],
   widgets:[
      {
         name: "alfresco/layout/FullScreenWidgets",
         config: {
            pubSubScope: "NOT_GLOBAL_SCOPE_",
            widgets: [
               {
                  id: "PDF_DOCUMENT",
                  name: "alfresco/documentlibrary/AlfDocument",
                  config: {
                     nodeRef: "workspace://SpacesStore/f8394454-0651-48a5-b583-d067c7d03339",
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