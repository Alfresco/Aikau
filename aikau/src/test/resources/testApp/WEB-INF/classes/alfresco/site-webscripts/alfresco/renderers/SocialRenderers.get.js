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
      "aikauTesting/mockservices/SocialTestService",
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         name: "alfresco/lists/views/AlfListView",
         config: {
            id: "LIST",
            currentData: {
               items: [
                  {
                     name: "Test 1",
                     liked: false,
                     likeCount: 4,
                     favourite: false,
                     shareId: null,
                     commentCount: 6
                  }
               ]
            },
            widgets:[
               {
                  name: "alfresco/lists/views/layouts/Row",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/lists/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    id: "LIKES",
                                    name: "alfresco/renderers/Like",
                                    config: {
                                       propertyToRender: "liked",
                                       likeCountProperty: "likeCount"
                                    }
                                 },
                                 {
                                    id: "FAVOURITES",
                                    name: "alfresco/renderers/Favourite",
                                    config: {
                                       propertyToRender: "favourite"
                                    }
                                 },
                                 {
                                    id: "COMMENTS",
                                    name: "alfresco/renderers/Comments",
                                    config: {
                                       commentCountProperty: "commentCount"
                                    }
                                 },
                                 {
                                    id: "QUICKSHARE",
                                    name: "alfresco/renderers/QuickShare",
                                    config: {
                                       propertyToRender: "shareId"
                                    }
                                 }
                              ]
                           }
                        }
                     ]
                  }
               }
            ]
            
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