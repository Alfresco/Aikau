model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true,
               warn: true,
               error: true
            }
         }
      },
      "alfresco/services/NavigationService",
      "alfresco/services/DocumentService",
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         id: "DOCLIST",
         name: "alfresco/documentlibrary/AlfDocumentList",
         widthPx: 600,
         config: {
            waitForPageWidgets: false,
            useHash: true,
            widgets: [
               {
                  id: "DETAILED_VIEW",
                  name: "alfresco/documentlibrary/views/AlfDetailedView"
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/DocumentLibraryDetailedViewMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};