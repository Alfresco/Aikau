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
   widgets: [
      {
         name: "aikau/vue/Bootstrap",
         config: {
            widgets: [
               {
                  name: "aikau/vue/Test",
                  config: {
                     widgets: [
                        {
                           name: "aikau/vue/Test3"
                        }
                     ]
                     // message: "Passed",
                     // props: {
                     //    dynamic: "parentMsg"
                     // }
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};