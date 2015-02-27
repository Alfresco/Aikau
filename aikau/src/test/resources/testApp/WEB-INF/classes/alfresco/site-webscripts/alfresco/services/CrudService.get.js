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
      "alfresco/services/CrudService",
      "alfresco/services/NotificationService"
   ],
   widgets:[
      {
         name: "alfresco/buttons/AlfButton",
         id: "DELETE_SUCCESS_BUTTON",
         config: {
            label: "Successful delete call",
            publishTopic: "ALF_CRUD_DELETE",
            publishPayload: {
               url: "resources/123",
               responseTopic: "ALF_CRUD_DELETED"
            }
         }
      },
      {
         name: "aikauTesting/mockservices/CrudServiceMockXhr"
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};