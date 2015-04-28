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
         name: "alfresco/buttons/AlfButton",
         id: "SHOW_LOG_BUTTON",
         config: {
            label: "Show pub-sub log in dialog",
            publishTopic: "ALF_SHOW_PUBSUB_LOG"
         }
      }
   ]
};