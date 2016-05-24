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
         name: "alfresco/html/Heading",
         config: {
            label: "Default image",
            level: 3
         }
      },
      {
         name: "alfresco/renderers/PublishAction",
         id: "DEFAULT",
         config: {
            publishTopic: "PUBLISH_ACTION_DEFAULT"
         }
      },
      {
         name: "alfresco/html/Heading",
         config: {
            label: "Custom icon with payload",
            level: 3
         }
      },
      {
         name: "alfresco/renderers/PublishAction",
         id: "CUSTOM_WITH_PAYLOAD",
         config: {
            iconClass: "edit-16",
            publishTopic: "PUBLISH_ACTION_CUSTOM_WITH_PAYLOAD",
            publishPayload: {
               editMode: true
            }
         }
      },
      {
         name: "alfresco/html/Heading",
         config: {
            label: "Custom image URL",
            level: 3
         }
      },
      {
         name: "alfresco/renderers/PublishAction",
         id: "CUSTOM_IMAGE",
         config: {
            src: "images/app-logo-48.png",
            srcType: "CONTEXT_RELATIVE",
            publishTopic: "PUBLISH_ACTION_CUSTOM_IMAGE"
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};