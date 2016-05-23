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
      {
         name: "alfresco/html/Markdown",
         config: {
            markdown: "__NOTE:__ Hash test requires that [hashName is set in the current hash](#hashName=hashValue)"
         }
      },
      {
         name: "alfresco/html/Spacer",
         config: {
            height: "20px"
         }
      },
      {
         name: "aikauTesting/widgets/ObjectProcessingMixinButton",
         id: "PROCESS_RECURSIVE",
         config: {
            testType: "RECURSIVE",
            label: "Publish recursive object"
         }
      },
      {
         name: "aikauTesting/widgets/ObjectProcessingMixinButton",
         id: "PROCESS_ARRAY",
         config: {
            testType: "ARRAY",
            label: "Publish array"
         }
      },
      {
         name: "aikauTesting/widgets/ObjectProcessingMixinButton",
         id: "PROCESS_NESTED_ARRAY",
         config: {
            testType: "NESTED_ARRAY",
            label: "Publish nested array"
         }
      },
      {
         name: "aikauTesting/widgets/ObjectProcessingMixinButton",
         id: "PROCESS_HASH_TOKENS",
         config: {
            testType: "HASH",
            label: "Publish using hash tokens"
         }
      },
      {
         name: "aikauTesting/widgets/ObjectProcessingMixinButton",
         id: "PROCESS_MESSAGE_TOKENS",
         config: {
            testType: "MESSAGE",
            label: "Publish using message tokens"
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};