<import resource="classpath:alfresco/site-webscripts/imports/sandpit.lib.js">

buildPageModel({
   title: "page.title",
   description: "page.description",
   jsdoc: "https://dev.alfresco.com/resource/docs/aikau-jsdoc/AlfDocumentPreview.html",
   services: ["alfresco/services/DocumentService"],
   mockXhrWidgets: [
      {
         name: "sandpit/mockdata/PreviewMockXhr"
      }
   ],
   examples: [
      {
         title: "pdf.example.title",
         description: "pdf.example.description",
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
      },
      {
         title: "image.example.title",
         description: "image.example.description",
         model: [
            {
               name: "alfresco/documentlibrary/AlfDocument",
               config: {
                  pubSubScope: "IMAGE_",
                  nodeRef: "workspace://SpacesStore/image",
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
      },
      {
         title: "video.example.title",
         description: "video.example.description",
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
         title: "audio.example.title",
         description: "audio.example.description",
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
      }
   ]
});
