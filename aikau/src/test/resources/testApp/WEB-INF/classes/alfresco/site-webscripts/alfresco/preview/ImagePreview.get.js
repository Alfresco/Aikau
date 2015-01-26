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
      // NOTE: The WaitForMockXhrService is commented out because binary data is not being used currently
      //       there is an outstanding issue with host addresses that needs to be resolved so that both
      //       local and VM tests are consistent.
      //    name: "aikauTesting/WaitForMockXhrService",
      //    config: {
      //       widgets: [
               // {
                  name: "alfresco/documentlibrary/AlfDocument",
                  config: {
                     nodeRef: "workspace://SpacesStore/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4",
                     widgets: [
                        {
                           name: "alfresco/preview/AlfDocumentPreview",
                           config: {
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
               // }
         //    ]
         // }
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