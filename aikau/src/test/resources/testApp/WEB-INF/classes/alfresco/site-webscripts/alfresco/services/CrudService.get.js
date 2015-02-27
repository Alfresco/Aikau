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
      "alfresco/services/NotificationService",
      "alfresco/services/DialogService"
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
         name: "alfresco/buttons/AlfButton",
         id: "DELETE_FAILURE_BUTTON",
         config: {
            label: "Failed delete call",
            publishTopic: "ALF_CRUD_DELETE",
            publishPayload: {
               url: "resources/234",
               responseTopic: "ALF_CRUD_DELETED",
               failureMessage: "Test failure message"
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