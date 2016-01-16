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
         config: {
            waitForPageWidgets: false,
            currentData: {
               items: [
                  {
                     nodeRef: "workspace://SpacesStore/a4fc4392-27f6-49fd-8b6e-20b953c59ff5",
                     fileName: "Video Test Binary.mp4",
                     displayName: "Video Test Binary.mp4",
                     node: {
                        properties: {
                           "cm:name": "Video Test Binary.mp4"
                        },
                        mimetypeDisplayName: "MPEG4 Video",
                        mimetype: "video/mp4",
                        nodeRef: "workspace://SpacesStore/a4fc4392-27f6-49fd-8b6e-20b953c59ff5",
                        isContainer: false,
                        contentURL: "/slingshot/node/content/workspace/SpacesStore/a4fc4392-27f6-49fd-8b6e-20b953c59ff5/Video%20Test%20Binary.mp4"
                     }
                  },
                  {
                     nodeRef: "workspace://SpacesStore/50e8fa78-86ee-4209-9de0-b5c996b7ee52",
                     fileName: "Demo 3.mp3",
                     displayName: "Demo 3.mp3",
                     node: {
                        properties: {
                           "cm:name": "Demo 3.mp3"
                        },
                        mimetypeDisplayName: "MPEG Audio",
                        mimetype: "audio/mpeg",
                        nodeRef: "workspace://SpacesStore/50e8fa78-86ee-4209-9de0-b5c996b7ee52",
                        isContainer: false,
                        contentURL: "/slingshot/node/content/workspace/SpacesStore/50e8fa78-86ee-4209-9de0-b5c996b7ee52/content/Demo%203.mp3"
                     }
                  }
               ]
            },
            widgets: [
               {
                  id: "FILMSTRIP_VIEW",
                  name: "alfresco/documentlibrary/views/AlfFilmStripView",
                  config: {
                     heightMode: 400
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/PreviewMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};