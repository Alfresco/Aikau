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
         id: "HEADING1",
         name: "alfresco/html/Heading",
         config: {
            label: "test.heading.label"
         }
      },
      {
         id: "HEADING2",
         name: "alfresco/html/Heading",
         config: {
            label: "<img src='1' onerror='window.hacked=true>",
            level: 4
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};