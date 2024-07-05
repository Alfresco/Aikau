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
         id: "ADMIN_THUMBNAIL",
         name: "alfresco/renderers/AvatarThumbnail",
         config: {
            currentItem: {
               userName: "silly%userid"
            }
         }
      },
      {
         id: "GUEST_THUMBNAIL",
         name: "alfresco/renderers/AvatarThumbnail",
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
         id: "GROUP_THUMBNAIL",
         name: "alfresco/renderers/AvatarThumbnail",
         config: {
            currentItem: {
               displayName: "Lincoln",
               authorityType: "GROUP"
            },
            groupProperty: "authorityType",
            groupValues: ["GROUP"]
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