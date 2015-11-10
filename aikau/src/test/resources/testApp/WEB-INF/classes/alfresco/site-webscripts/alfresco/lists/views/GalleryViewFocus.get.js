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
            useInfiniteScroll: false,
            additionalControlsTarget: "TOOLBAR",
            currentPageSize: 16,
            widgets: [
               {
                  name: "alfresco/documentlibrary/views/AlfGalleryView",
                  config: {
                     columns: 4,
                     widgets: [
                        {
                           id: "PROPERTY",
                           name: "alfresco/renderers/Property",
                           config: {
                              propertyToRender: "displayName"
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/NodesMockXhr",
         config: {
            totalItems: 16,
            folderRatio: [100]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};