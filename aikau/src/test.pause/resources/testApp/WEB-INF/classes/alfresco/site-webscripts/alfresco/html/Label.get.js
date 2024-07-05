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
      },
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "TEST_BUTTON",
            label: "Update label button",
            publishTopic: "NOT_A_REAL_TOPIC",
            publishPayload: {
               label: "Label is updated"
            }
         }
      },
      {
         name: "alfresco/html/Label",
         align: "left",
         config: {
         	id: "TEST_LABEL",
            label: "This is a test label",
            subscriptionTopic: "NOT_A_REAL_TOPIC",
            additionalCssClasses: "bold"
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