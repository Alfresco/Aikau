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
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         name: "alfresco/layout/VerticalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/header/Header",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/header/AlfMenuBar",
                           config: {
                              widgets: [
                                 {
                                    id: "SITES_MENU",
                                    name: "alfresco/header/AlfSitesMenu",
                                    config: {
                                       currentSite: "site1",
                                       currentUser: "admin"
                                    }
                                 }
                              ]
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/header/Title",
                  config: {
                     label: "Test Title"
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/HeaderMockXhr",
         config: {
            location: "FAVOURITE_SITE"
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};