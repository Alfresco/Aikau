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
      {
         name: "alfresco/services/UserService"
      },
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         id: "HEADER_USER_SET_DEFAULT_PAGE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set Default Page",
            publishTopic: "ALF_SET_USER_DEFAULT_PAGE",
            publishPayload: {
               defaultPage: "NewDefaultPage"
            }
         }
      },
      {
         name: "aikauTesting/mockservices/PreferenceServiceMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};