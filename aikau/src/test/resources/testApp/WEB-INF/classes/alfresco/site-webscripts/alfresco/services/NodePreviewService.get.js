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
      "alfresco/services/NodePreviewService",
      "alfresco/services/DocumentService"
   ],
   widgets: [
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
         name: "aikauTesting/mockservices/PreviewMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};