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
      // NOTE: Provided as an example only, the tutorial files are not in the source, they can be re-added
      {
         name: "alfresco/experimental/ng2/Bootstrap",
         config: {
            main: "alfresco/experimental/ng2/tutorial-example/main.ts",
            templateString: "<my-app>Loading...</my-app>"
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};