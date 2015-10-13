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
      "alfresco/services/CrudService"
   ],
   widgets: [
      {
         name: "alfresco/buttons/AlfButton",
         id: "CRUD_GET_ALL_BUTTON",
         config: {
            label: "Publish generic CRUD_GET_ALL request",
            publishTopic: "ALF_CRUD_GET_ALL",
            publishPayload: {
               url: "my/test/url"
            },
            publishGlobal: true,
            pubSubScope: "SCOPED_"
         }
      },   
      {
         name: "aikauTesting/mockservices/GenericMockXhr"
      },   
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};
