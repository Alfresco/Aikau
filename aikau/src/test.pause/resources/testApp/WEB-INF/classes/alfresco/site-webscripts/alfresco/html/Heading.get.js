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
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "TEST_BUTTON",
            label: "Update heading button",
            publishTopic: "UPDATE_HEADING_TOPIC",
            publishPayload: {
               label: "AFTER PUBLISH LABEL"
            }
         }
      },
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
         id: "HEADING3",
         name: "alfresco/html/Heading",
         config: {
            label: "BEFORE PUBLISH LABEL",
            subscriptionTopic: "UPDATE_HEADING_TOPIC"
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