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
         name: "alfresco/testing/WaitForMockXhrService",
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
                           widthPx: "150",
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
                                    id: "SET_PATH_NO_SLASH",
                                    name: "alfresco/buttons/AlfButton",
                                    config: {
                                       label: "Set path (no slash)",
                                       publishTopic: "ALF_DOCUMENTLIST_PATH_CHANGED",
                                       publishPayload: {
                                          path: "documentLibrary"
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
                                 },
                                 {
                                    id: "ADD_FOLDER",
                                    name: "alfresco/buttons/AlfButton",
                                    config: {
                                       label: "Add Folder",
                                       publishTopic: "ALF_CONTENT_CREATED",
                                       publishPayload: {
                                          parentNodeRef: "workspace://SpacesStore/8ab12916-4897-47fb-94eb-1ab699822ecb"
                                       }
                                    }
                                 },
                                 {
                                    id: "DELETE_FOLDER",
                                    name: "alfresco/buttons/AlfButton",
                                    config: {
                                       label: "Delete Folder",
                                       publishTopic: "ALF_CONTENT_DELETED",
                                       publishPayload: {
                                          nodeRefs: ["workspace://SpacesStore/d56afdc3-0174-4f8c-bce8-977cafd712ab"] 
                                       }
                                    }
                                 },
                                 {
                                    id: "ADD_FOLDER_AT_ROOT",
                                    name: "alfresco/buttons/AlfButton",
                                    config: {
                                       label: "Add Folder (at root)",
                                       publishTopic: "ALF_CONTENT_CREATED",
                                       publishPayload: {
                                          parentNodeRef: "workspace://SpacesStore/8f2105b4-daaf-4874-9e8a-2152569d109b"
                                       }
                                    }
                                 },
                                 {
                                    id: "DELETE_FOLDER_AT_ROOT",
                                    name: "alfresco/buttons/AlfButton",
                                    config: {
                                       label: "Delete Folder (at root)",
                                       publishTopic: "ALF_CONTENT_DELETED",
                                       publishPayload: {
                                          nodeRefs: ["workspace://SpacesStore/8f2105b4-daaf-4874-9e8a-2152569d109b"] 
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