/*jshint maxlen:1000*/
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
         name: "alfresco/renderers/PublishAction",
         id: "EDIT_ME",
         config: {
            iconClass: "edit-16",
            publishTopic: "EDIT_ME",
            publishPayload: {
               editMode: true
            }
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};