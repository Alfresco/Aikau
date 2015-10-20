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
         id: "SIMPLE_IMAGE",
         config: {
            height: "75px",
            src: "images/app-logo-48.png",
            srcType: "CONTEXT_RELATIVE",
            width: "150px"
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
         id: "NO_SRC",
         config: {
            isBlockElem: true
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
         id: "PUBLISH",
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
         id: "LINK",
         config: {
            classes: "alfresco-logo-large",
            targetUrl: "tp/ws/Index"
         }
      },
      {
         name: "alfresco/html/Heading",
         config: {
            label: "Image class provided; custom dimensions",
            level: 3
         }
      },
      {
         name: "alfresco/html/Image",
         id: "LINK",
         config: {
            classes: "alfresco-logo-one",
            height: "60px",
            width: "240px"
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};
