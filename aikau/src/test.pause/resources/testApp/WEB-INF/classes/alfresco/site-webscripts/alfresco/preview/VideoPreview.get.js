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
            nodeRef: "workspace://SpacesStore/a4fc4392-27f6-49fd-8b6e-20b953c59ff5",
            widgets: [
               {
                  name: "alfresco/preview/AlfDocumentPreview",
                  config: {
                     // heightMode: "AUTO", // Max height is viewport height from starting position in document
                     // heightMode: 500, // Some fixed height
                     // heightMode: -50, // Viewport height minus a measurement of pixesl (useful for dialog?)
                     widgetsForPluginsOverrides: [
                        {
                           id: "PdfJs",
                           replace: true,
                           name: "alfresco/preview/PdfJs/PdfJs",
                           config: {
                              // Optional configuration that we could add now
                              // id: "PDF_PLUGIN_1"
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
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};