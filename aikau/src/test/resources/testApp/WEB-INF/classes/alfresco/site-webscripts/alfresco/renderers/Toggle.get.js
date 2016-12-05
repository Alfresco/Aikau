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
      }
   ],
   widgets:[
      {
         name: "alfresco/testing/WaitForMockXhrService",
         config: {
            services: ["alfresco/services/PreferenceService"],
            widgets: [
               {
                  id: "LIST",
                  name: "alfresco/lists/views/AlfListView",
                  config: {
                     currentData: {
                        items: [
                           {
                              nodeRef: "some://dummy/nodeRef",
                              node: {
                                 nodeRef: "some://dummy/nodeRef"
                              },
                              name: "Test 1",
                              favourite: false
                           }
                        ]
                     },
                     additionalCssClasses: "bordered",
                     widgetsForHeader: [
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              label: "Unscoped"
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              label: "Scoped"
                           }
                        }
                     ],
                     widgets:[
                        {
                           id: "ROW",
                           name: "alfresco/lists/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    id: "UNSCOPED_CELL",
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       additionalCssClasses: "mediumpad",
                                       widgets: [
                                          {
                                             id: "UNSCOPED_FAVOURITES",
                                             name: "alfresco/renderers/Favourite",
                                             config: {
                                                propertyToRender: "favourite"
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    id: "SCOPED_CELL",
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       additionalCssClasses: "mediumpad",
                                       pubSubScope: "SCOPED_",
                                       widgets: [
                                          {
                                             id: "SCOPED_FAVOURITES",
                                             name: "alfresco/renderers/Favourite",
                                             config: {
                                                propertyToRender: "favourite"
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