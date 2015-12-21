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
         id: "PAGE_HEADING",
         config: {
            level: 3,
            label: "Page used for development only. This widget should be instantiated through the NotificationService."
         }
      },
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