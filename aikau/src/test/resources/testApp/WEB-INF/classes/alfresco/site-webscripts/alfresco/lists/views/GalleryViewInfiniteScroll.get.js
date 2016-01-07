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
      "alfresco/services/DocumentService"
   ],
   widgets: [
      {
         id: "TOOLBAR",
         name: "alfresco/documentlibrary/AlfToolbar"
      },
      {
         id: "DOCLIST",
         name: "alfresco/documentlibrary/AlfDocumentList",
         config: {
            useHash: false,
            useInfiniteScroll: true,
            // itemKeyProperty: "nodeRef",
            additionalControlsTarget: "TOOLBAR",
            currentPageSize: 4,
            widgets: [
               {
                  name: "alfresco/documentlibrary/views/AlfGalleryView",
                  config: {
                     columns: 7,
                     showNextLink: true,
                     nextLinkLabel: "Show More"
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/testing/NodesMockXhr",
         config: {
            totalItems: 11,
            folderRatio: [100]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};