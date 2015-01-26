model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true,
               warn: true,
               error: true
            }
         }
      },
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         id: "STFF1",
         name: "alfresco/forms/SingleTextFieldForm",
         config: {
            useHash: false,
            okButtonLabel: "Search",
            okButtonPublishTopic: "TEST_PUBLISH",
            okButtonPublishGlobal: true,
            okButtonIconClass: "alf-white-search-icon",
            okButtonClass: "call-to-action",
            textFieldName: "search",
            textBoxIconClass: "alf-search-icon",
            textBoxCssClasses: "long"
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