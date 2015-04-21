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
            nodeRef: "workspace://SpacesStore/50e8fa78-86ee-4209-9de0-b5c996b7ee52",
            widgets: [
               {
                  name: "alfresco/preview/AlfDocumentPreview"
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