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
      "alfresco/services/DocumentService",
      "alfresco/services/DialogService",
      "alfresco/services/CrudService"
   ],
   widgets:[
      {
         name: "alfresco/renderers/AvatarThumbnail",
         config: {
            currentItem: {
               userName: "admin"
            }
         }
      },
      {
         name: "aikauTesting/mockservices/ThumbnailsMockXhr"
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};