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
      "alfresco/services/RatingsService"
   ],
   widgets:[
      {
         name: "alfresco/testing/WaitForMockXhrService",
         config: {
            services: ["alfresco/services/PreferenceService"],
            widgets: [
               {
                  name: "alfresco/lists/views/AlfListView",
                  config: {
                     id: "LIST",
                     currentData: {
                        items: [
                           {
                              nodeRef: "some://dummy/nodeRef",
                              node: {
                                 nodeRef: "some://dummy/nodeRef"
                              },
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
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/SocialMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};