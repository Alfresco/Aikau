/* global page */
/* jshint sub:true */

var autoPlay = true;
if (page.url.args["autoPlay"])
{
   autoPlay = page.url.args["autoPlay"] === "true";
}

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
                  },
                  {
                     nodeRef: "workspace://SpacesStore/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4",
                     fileName: "2013-12-29 09.58.43.jpg",
                     displayName: "2013-12-29 09.58.43.jpg",
                     node: {
                        properties: {
                           "cm:name": "2013-12-29 09.58.43.jpg"
                        },
                        mimetypeDisplayName: "JPEG Image",
                        mimetype: "image/jpeg",
                        nodeRef: "workspace://SpacesStore/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4",
                        isContainer: false,
                        contentURL: "/slingshot/node/content/workspace/SpacesStore/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4/content/2013-12-29 09.58.43.jpg"
                     }
                  }
               ]
            },
            widgets: [
               {
                  id: "FILMSTRIP_VIEW",
                  name: "alfresco/documentlibrary/views/AlfFilmStripView",
                  config: {
                     heightMode: 600,
                     previewerPluginOverrides: [
                        {
                           id: "Video",
                           name: "alfresco/preview/Video",
                           config: {
                              autoPlay: autoPlay
                           }
                        },
                        {
                           id: "Audio",
                           name: "alfresco/preview/Audio",
                           config: {
                              autoPlay: autoPlay
                           }
                        }
                     ]
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