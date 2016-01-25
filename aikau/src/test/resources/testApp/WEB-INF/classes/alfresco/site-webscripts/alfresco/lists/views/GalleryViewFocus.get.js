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
                     resizeByColumnCount: false,
                     thumbnailSize: 200,
                     widgets: [
                        {
                           id: "VERTICAL",
                           name: "alfresco/layout/VerticalWidgets",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/layout/HorizontalWidgets",
                                    config: {
                                       widgets: [
                                          {
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
            totalItems: 16,
            folderRatio: [100]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};