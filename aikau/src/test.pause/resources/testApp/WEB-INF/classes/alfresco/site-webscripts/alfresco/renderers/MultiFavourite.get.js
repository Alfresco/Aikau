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
      "alfresco/services/ActionService"
   ],
   widgets:[
      {
         id: "ADD_MULTIPLE_FAVOURITES",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Add multiple favourites",
            publishTopic: "ALF_MULTIPLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               actionTopic: "ALF_PREFERENCE_ADD_DOCUMENT_FAVOURITE",
               documents: [
                  {
                     node: {
                        isContainer: true,
                        nodeRef: "some://folder/1"
                     }
                  },
                  {
                     node: {
                        isContainer: true,
                        nodeRef: "some://folder/2"
                     }
                  },
                  {
                     node: {
                        isContainer: false,
                        nodeRef: "some://document/1"
                     }
                  },
                  {
                     node: {
                        isContainer: false,
                        nodeRef: "some://document/2"
                     }
                  }
               ]
            }
         }
      },
      {
         id: "REMOVE_MULTIPLE_FAVOURITES",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Remove multiple favourites",
            publishTopic: "ALF_MULTIPLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               actionTopic: "ALF_PREFERENCE_REMOVE_DOCUMENT_FAVOURITE",
               documents: [
                  {
                     node: {
                        isContainer: true,
                        nodeRef: "some://folder/1"
                     }
                  },
                  {
                     node: {
                        isContainer: false,
                        nodeRef: "some://document/2"
                     }
                  }
               ]
            }
         }
      },
      {
         id: "LIST",
         name: "alfresco/lists/AlfList",
         config: {
            currentData: {
               items: [
                  {
                     node: {
                        nodeRef: "some://folder/1",
                        isContainer: true,
                        properties: {
                           "cm:name": "Folder 1"
                        }
                     },
                     isFavourite: false
                  },
                  {
                     node: {
                        nodeRef: "some://folder/2",
                        isContainer: true,
                        properties: {
                           "cm:name": "Folder 2"
                        }
                     },
                     isFavourite: false
                  },
                  {
                     node: {
                        nodeRef: "some://folder/3",
                        isContainer: true,
                        properties: {
                           "cm:name": "Folder 3"
                        }
                     },
                     isFavourite: false
                  },
                  {
                     node: {
                        nodeRef: "some://document/1",
                        isContainer: false,
                        properties: {
                           "cm:name": "Document 1"
                        }
                     },
                     isFavourite: false
                  },
                  {
                     node: {
                        nodeRef: "some://document/2",
                        isContainer: false,
                        properties: {
                           "cm:name": "Document 2"
                        }
                     },
                     isFavourite: false
                  },
                  {
                     node: {
                        nodeRef: "some://document/3",
                        isContainer: false,
                        properties: {
                           "cm:name": "Document 3"
                        }
                     },
                     isFavourite: false
                  }
               ]
            },
            widgets: [
               {
                  name: "alfresco/lists/views/AlfListView",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/lists/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             id: "NAME",
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "node.properties.cm:name"
                                             }
                                          },
                                          {
                                             id: "FAVOURITE",
                                             name: "alfresco/renderers/Favourite"
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
         name: "aikauTesting/mockservices/PreferenceServiceMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};