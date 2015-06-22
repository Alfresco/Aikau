var overThreeYearsAgo = new Date(); // Start with now
overThreeYearsAgo.setFullYear(overThreeYearsAgo.getFullYear() - 3); // Remove three years
overThreeYearsAgo.setTime(overThreeYearsAgo.getTime() - (1000 * 60 * 60 * 24 * 30)); // Remove about a month 

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
            userStatusTime: overThreeYearsAgo.toISOString()
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