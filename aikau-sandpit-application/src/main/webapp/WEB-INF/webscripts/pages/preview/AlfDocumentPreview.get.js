<import resource="classpath:alfresco/site-webscripts/imports/sandpit.lib.js">

buildPageModel({
   title: "alfresco/preview/AlfDocumentPreview",
   description: "This widget allows you to preview the contents of a node.",
   jsdoc: "https://dev.alfresco.com/resource/docs/aikau-jsdoc/AlfDocumentPreview.html",
   services: ["alfresco/services/DocumentService"],
   mockXhrWidgets: [
      {
         name: "sandpit/mockdata/PreviewMockXhr"
      }
   ],
   examples: [
      {
         title: "Image Preview",
         description: "This instance is configured to use the nodeRef that is mocked against an image node",
         model: [
            {
               name: "alfresco/preview/AlfDocumentPreview",
               config: {
                  nodeRef: "some://dummy/nodeRef"
               }
            }
         ]
      },
      {
         title: "Image Preview",
         description: "Wrap the AlfDocumentPreview in an AlfDocument to retrieve the metadata for the node with just a nodeRef. The nodeRef used here is not representative of a real nodeRef but is matched via data mocking to fetch the metadata for an image.",
         model: [
            {
               name: "alfresco/documentlibrary/AlfDocument",
               config: {
                  pubSubScope: "IMAGE_",
                  nodeRef: "workspace://SpacesStore/image",
                  widgets: [
                     {
                        name: "alfresco/preview/AlfDocumentPreview"
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "Video Preview",
         description: "The nodeRef used here is matched to a video node.",
         model: [
            {
               name: "alfresco/documentlibrary/AlfDocument",
               config: {
                  pubSubScope: "VIDEO_",
                  nodeRef: "workspace://SpacesStore/video",
                  widgets: [
                     {
                        name: "alfresco/preview/AlfDocumentPreview"
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "Audio Preview",
         description: "The nodeRef used here is matched to a audio node.",
         model: [
            {
               name: "alfresco/documentlibrary/AlfDocument",
               config: {
                  pubSubScope: "AUDIO_",
                  nodeRef: "workspace://SpacesStore/audio",
                  widgets: [
                     {
                        name: "alfresco/preview/AlfDocumentPreview"
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "PDF Preview",
         description: "The nodeRef used here is matched to a PDF node.",
         model: [
            {
               name: "alfresco/documentlibrary/AlfDocument",
               config: {
                  pubSubScope: "PDF_",
                  nodeRef: "workspace://SpacesStore/pdf",
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
         ]
      }
   ]
});
