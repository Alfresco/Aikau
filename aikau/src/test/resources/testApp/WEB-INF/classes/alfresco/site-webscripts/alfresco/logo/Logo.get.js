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
         id: "LOGO1",
         name: "alfresco/logo/Logo" 
      },
      {
         id: "LOGO2",
         name: "alfresco/logo/Logo",
         config: {
            logoSrc: "/aikau/page/resource/js/aikau/testing/images/customlogo.jpg"
         }
      },
      {
         id: "LOGO_WITH_TOPIC",
         name: "alfresco/logo/Logo",
         config: {
            logoClasses: "surf-logo-small",
            publishTopic: "LOGO_TOPIC_PUBLISHED"
         }
      },
      {
         id: "LOGO_WITH_URL",
         name: "alfresco/logo/Logo",
         config: {
            logoClasses: "surf-logo-large",
            targetUrl: "tp/ws/Index"
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};