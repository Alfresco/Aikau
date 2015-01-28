model.jsonModel = {
   publishOnReady: [
      {
         publishTopic: "GLOBAL_UPDATE_TOPIC"
      }
   ],
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true
            }
         }
      },
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/forms/Form",
         config: {
            id: "FORM",
            okButtonPublishTopic: "TEST_PUBLISH",
            widgets: [
               {
                  name: "alfresco/forms/controls/DateTextBox",
                  config: {
                     id: "DOJODATETEXTBOX",
                     name: "someDate",
                     value: "2012-12-12",
                     label: "Date"
                  }
               }
            ]
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