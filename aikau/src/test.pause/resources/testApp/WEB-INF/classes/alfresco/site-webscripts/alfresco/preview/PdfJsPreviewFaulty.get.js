model.jsonModel = {
   publishOnReady: [
      {
         publishTopic: "ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST",
         publishPayload: {
            dataSource: "customNodeRef",
            nodeRef: "workspace://SpacesStore/6f4c9f59-7804-475e-b9d0-72387b40eaa6"
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
         name: "alfresco/layout/FullScreenWidgets",
         config: {
            widgets: 
            [
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