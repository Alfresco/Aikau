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
            additionalControlsTarget: "TOOLBAR",
            widgets: [
               {
                  name: "alfresco/documentlibrary/views/AlfGalleryView",
                  config: {
                     resizeByColumnCount: false
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/NodesMockXhr",
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