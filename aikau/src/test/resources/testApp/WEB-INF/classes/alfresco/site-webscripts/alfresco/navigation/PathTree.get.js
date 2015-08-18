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
                     widgetMarginLeft: 10,
                     widgetMarginRight: 10,
                     widgets: [
                        {
                           name: "alfresco/layout/VerticalWidgets",
                           widthPx: "100",
                           config: {
                              widgetMarginBottom: 10,
                              widgets: [
                                 {
                                    id: "SET_HASH",
                                    name: "alfresco/buttons/AlfButton",
                                    config: {
                                       label: "Set hash",
                                       publishTopic: "ALF_HASH_CHANGED",
                                       publishPayload: {
                                          path: "/documentLibrary/Budget Files/Invoices/"
                                       }
                                    }
                                 },
                                 {
                                    id: "SET_PATH",
                                    name: "alfresco/buttons/AlfButton",
                                    config: {
                                       label: "Set path",
                                       publishTopic: "ALF_DOCUMENTLIST_PATH_CHANGED",
                                       publishPayload: {
                                          path: "/documentLibrary/Budget Files/Invoices/"
                                       }
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           name: "alfresco/layout/ClassicWindow",
                           config: {
                              title: "Showing Root",
                              widgets: [
                                 {
                                    id: "TREE1",
                                    name: "alfresco/navigation/PathTree",
                                    config: {
                                       rootNode: "workspace://SpacesStore/b4cff62a-664d-4d45-9302-98723eac1319",
                                       rootLabel: "Custom Root"
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           name: "alfresco/layout/ClassicWindow",
                           config: {
                              title: "Hiding Root, filtering paths",
                              widgets: [
                                 {
                                    id: "TREE2",
                                    name: "alfresco/navigation/PathTree",
                                    config: {
                                       showRoot: false,
                                       useHash: false,
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
         name: "alfresco/logging/DebugLog"
      }
   ]
};