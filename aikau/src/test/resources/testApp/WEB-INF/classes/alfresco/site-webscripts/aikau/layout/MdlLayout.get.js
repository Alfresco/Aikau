model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true,
               warn: true,
               error: true
            }
         }
      }
   ],
   widgets: [
      {
         name: "aikau/layout/Layout",
         config: {
            widgets: [
               {
                  name: "aikau/layout/Header",
                  config: {
                     widgets: [
                        {
                           name: "aikau/layout/HeaderRow",
                           config: {
                              widgets: [
                                 {
                                    name: "aikau/layout/Title",
                                    config: {
                                       title: "Material Designed Aikau"
                                    }
                                 }
                              ]
                           }
                        }
                     ]
                  }
               }
            ]
         }
      }
   ]
};