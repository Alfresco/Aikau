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
                           name: "aikau/vue/Test2",
                           config: {
                              widgets: [
                                 {
                                    name: "aikau/vue/Test3",
                                    config: {
                                       message: "Passed",
                                       "v-bind:dynamic": "parentMsg"
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