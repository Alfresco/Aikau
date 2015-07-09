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
      "alfresco/services/NotificationService"
   ],
   widgets:[
      {
         name: "alfresco/renderers/AvatarThumbnail",
         id: "ADMIN_THUMBNAIL",
         config: {
            currentItem: {
               userName: "admin"
            }
         }
      },
      {
         name: "alfresco/renderers/AvatarThumbnail",
         id: "GUEST_THUMBNAIL",
         config: {
            currentItem: {
               userName: "guest"
            },
            generatePubSubScope: true,
            publishTopic: "ALF_DISPLAY_NOTIFICATION",
            publishPayload: {
               message: "You clicked on the guest thumbnail"
            },
            publishGlobal: true
         }
      },
      {
         name: "aikauTesting/mockservices/ThumbnailsMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};