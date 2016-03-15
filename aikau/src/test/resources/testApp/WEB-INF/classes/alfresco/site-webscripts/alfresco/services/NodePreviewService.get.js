// jshint undef:false
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
      "alfresco/services/DialogService",
      "alfresco/services/LightboxService",
      "alfresco/services/DocumentService",
      "alfresco/services/NotificationService"
   ],
   widgets: [
      {
         name: "alfresco/html/Markdown",
         config: {
            markdown: "Use ?altDisplay=true request parameters to use StickyPanel rather than Dialog"
         }
      },
      {
         id: "IMAGE_PREVIEW",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show Image Preview",
            publishTopic: "ALF_SHOW_NODE_PREVIEW",
            publishPayload: {
               nodeRef: "workspace://SpacesStore/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4"
            }
         }
      },
      {
         id: "VIDEO_PREVIEW",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show Video Preview",
            publishTopic: "ALF_SHOW_NODE_PREVIEW",
            publishPayload: {
               nodeRef: "workspace://SpacesStore/a4fc4392-27f6-49fd-8b6e-20b953c59ff5"
            }
         }
      },
      {
         id: "AUDIO_PREVIEW",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show Audio Preview",
            publishTopic: "ALF_SHOW_NODE_PREVIEW",
            publishPayload: {
               nodeRef: "workspace://SpacesStore/50e8fa78-86ee-4209-9de0-b5c996b7ee52",
               node: {
                  mimetype: "audio/mpeg",
                  nodeRef: "workspace://SpacesStore/50e8fa78-86ee-4209-9de0-b5c996b7ee52"
               },
               displayName: "Demo 3.mp3"
            }
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

/* global page */
/* jshint sub:true */
if (page.url.args["altDisplay"] === "true")
{
   model.jsonModel.services.push({
      name: "alfresco/services/NodePreviewService",
      config: {
         useLightboxForImages: false,
         publishTopic: "ALF_DISPLAY_STICKY_PANEL",
         publishPayload: {
            title: "{displayName}",
            widgets: [
               {
                  name: "alfresco/documentlibrary/AlfDocument",
                  config: {
                     rawData: true,
                     xhrRequired: true,
                     nodeRef: "{node.nodeRef}",
                     widgets: [
                        {
                           name: "alfresco/preview/AlfDocumentPreview",
                           config: {
                              heightMode: 400
                           }
                        }
                     ]
                  }
               }
            ],
            width: 500
         }
      }
   });
}
else
{
   model.jsonModel.services.push("alfresco/services/NodePreviewService");
}