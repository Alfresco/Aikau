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
                  id: "VIEW",
                  name: "alfresco/documentlibrary/views/AlfGalleryView",
                  config: {
                     resizeByColumnCount: false,
                     widgets: [
                        {
                           id: "TOOLIP",
                           name: "alfresco/misc/AlfTooltip",
                           config: {
                              widgets: [
                                 {
                                    id: "THUMBNAIL",
                                    name: "alfresco/renderers/GalleryThumbnail"
                                 }
                              ],
                              widgetsForTooltip: [
                                 {
                                    name: "alfresco/html/Label",
                                    config: {
                                       label: "This is the tooltip content"
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