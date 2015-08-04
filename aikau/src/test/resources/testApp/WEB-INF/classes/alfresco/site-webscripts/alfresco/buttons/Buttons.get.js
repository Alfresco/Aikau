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
         id: "BUTTON",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "This is a button",
            publishTopic: "BUTTON_TOPIC",
            publishPayload: {
               foo: "bar"
            }
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};