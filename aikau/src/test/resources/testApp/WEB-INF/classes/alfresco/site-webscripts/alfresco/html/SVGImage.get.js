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
         id: "IMAGE1",
         name: "alfresco/html/SVGImage",
         config: {
            title: "Pencil",
            description: "An image of a pencil",
            height: 600,
            symbolId: "pencil",
            publishTopic: "IMAGE1_TOPIC"
         }
      },
      {
         id: "IMAGE2",
         name: "alfresco/html/SVGImage",
         config: {
            source: "alfresco/html/svg/test.svg",
            symbolId: "camera"
         }
      },
      {
         id: "IMAGE3",
         name: "alfresco/html/SVGImage",
         config: {
            width: "4em",
            symbolId: "camera"
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};