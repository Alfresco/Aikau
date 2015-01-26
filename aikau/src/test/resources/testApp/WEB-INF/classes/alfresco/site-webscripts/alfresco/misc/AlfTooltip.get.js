model.jsonModel = {
   services: [
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "TEST_BUTTON",
            label: "Test Button"
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "TEST_BUTTON_TWO",
            label: "Test Button Two"
         }
      },
      {
         name: "alfresco/misc/AlfTooltip",
         config: {
            targetNode: "TEST_BUTTON",
            label: "This is the test button"
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