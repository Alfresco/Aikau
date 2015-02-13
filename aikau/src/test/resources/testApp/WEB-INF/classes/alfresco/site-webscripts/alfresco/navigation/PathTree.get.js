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
      "alfresco/services/DocumentService"
   ],
   widgets: [
      {
         name: "aikauTesting/WaitForMockXhrService",
         config: {
            widgets: [
               {
                  name: "alfresco/layout/HorizontalWidgets",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/layout/ClassicWindow",
                           config: {
                              title: "Showing Root",
                              widgets: [
                                 {
                                    name: "alfresco/navigation/PathTree",
                                    config: {
                                       rootNode: "workspace://SpacesStore/b4cff62a-664d-4d45-9302-98723eac1319",
                                       rootLabel: "Site"
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           name: "alfresco/layout/ClassicWindow",
                           config: {
                              title: "Hidng Root",
                              widgets: [
                                 {
                                    name: "alfresco/navigation/PathTree",
                                    config: {
                                       showRoot: false,
                                       filterPaths: ["^/documentLibrary/(.*)$"],
                                       rootNode: "workspace://SpacesStore/b4cff62a-664d-4d45-9302-98723eac1319",
                                       publishTopic: "ALF_ITEM_SELECTED",
                                       publishPayloadType: "CURRENT_ITEM"
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
         name: "aikauTesting/mockservices/PathTreeMockXhr"
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};