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
      }
   ],
   widgets:[
      {
         name: "alfresco/html/Heading",
         config: {
            label: "Src provided; custom dimensions",
            level: 3
         }
      },
      {
         name: "alfresco/html/Image",
         id: "IMAGE_WITH_DIMENSIONS",
         config: {
            clickBubbling: false,
            height: 75,
            src: "images/app-logo-48.png",
            srcType: "CONTEXT_RELATIVE",
            width: 150
         }
      },
      {
         name: "alfresco/html/Heading",
         config: {
            label: "No src provided; block elem",
            level: 3
         }
      },
      {
         name: "alfresco/html/Image",
         id: "IMAGE_WITHOUT_SRC",
         config: {
            isBlockElem: true
         }
      },
      {
         name: "alfresco/html/Heading",
         config: {
            label: "Image class provided; one dimension provided, aspect ratio of 1",
            level: 3
         }
      },
      {
         name: "alfresco/html/Image",
         id: "IMAGE_CLASS_AND_DIMENSIONS",
         config: {
            aspectRatio: 1,
            classes: "alfresco-logo-one",
            dimensions: {
               w: 100
            },
            imgStyle: "background-size: 100% 100%"
         }
      },
      {
         name: "alfresco/html/Heading",
         config: {
            label: "Image class provided; custom style; block elem; publishes when clicked",
            level: 3
         }
      },
      {
         name: "alfresco/html/Image",
         id: "IMAGE_CLASS_STYLE_TOPIC",
         config: {
            altText: "This is some alt text",
            classes: "alfresco-logo-community",
            imgStyle: "box-shadow: 3px 3px 10px #ccc;",
            isBlockElem: true,
            publishTopic: "LOGO_TOPIC_PUBLISHED"
         }
      },
      {
         name: "alfresco/html/Heading",
         config: {
            label: "Image class provided; wrapped in a link",
            level: 3
         }
      },
      {
         name: "alfresco/html/Image",
         id: "IMAGE_CLASS_LINK",
         config: {
            classes: "alfresco-logo-large",
            targetUrl: "tp/ws/Index"
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};
