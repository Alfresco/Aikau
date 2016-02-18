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
      "alfresco/services/InfiniteScrollService"
   ],
   widgets: [
      {
         name: "alfresco/documentlibrary/AlfDocumentList",
         config: {
            useHash: true,
            useInfiniteScroll: true,
             widgets: [
               {
                  name: "alfresco/documentlibrary/views/AlfTableView"
               }
            ]
         }
      },
      {
         name: "alfresco/testing/NodesMockXhr",
         config: {
            totalItems: 4,
            folderRatio: [100]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};