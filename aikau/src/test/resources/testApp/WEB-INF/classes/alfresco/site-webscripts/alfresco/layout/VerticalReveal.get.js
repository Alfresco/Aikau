model.jsonModel = {
   services: [{
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true
            }
         }
      },
      "alfresco/services/ActionService",
      "alfresco/services/NavigationService",
      "alfresco/services/SearchService",
      "alfresco/services/ErrorReporter"
   ],
   widgets: [{
      name: "alfresco/buttons/AlfButton",
      id: "TOGGLE_LOGO",
      config: {
         label: "Toggle logo display",
         publishTopic: "ALF_REVEAL_LOGO"
      }
   }, {
      name: "alfresco/layout/VerticalReveal",
      config: {
         subscriptionTopic: "ALF_REVEAL_LOGO",
         widgets: [{
            name: "alfresco/logo/Logo",
            id: "ALFRESCO_LOGO"
         }]
      }
   }, {
      name: "alfresco/logging/SubscriptionLog"
   }, {
      name: "aikauTesting/TestCoverageResults"
   }]
};