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
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};