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
         id: "HEADER_USER_STATUS",
         name: "alfresco/header/CurrentUserStatus",
         config: {
            id: "HEADER_USER_STATUS",
            userStatus: "I\'m so very happy",
            userStatusTime: "2011-12-19T15:28:46.493Z"
         }
      },
      {
         name: "aikauTesting/mockservices/UserMockXhrGood"
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};