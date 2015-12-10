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
         name: "alfresco/layout/StickyPanel",
         id: "STICKY_PANEL",
         config: {
            widgets: [
               {
                  name: "alfresco/html/Heading",
                  id: "TEST_HEADING",
                  config: {
                     level: 3,
                     label: "This is a heading"
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