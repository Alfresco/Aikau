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
      "alfresco/services/DialogService",
      "alfresco/services/ContentService",
      "alfresco/services/UploadService"
   ],
   widgets:[
      {
         id: "LIST",
         name: "alfresco/lists/views/AlfListView",
         config: {
            currentData: {
               items: [
                  {
                     displayName: "Folder node",
                     node: {
                        aspects: [],
                        nodeRef: "some://dummy/node",
                        isLocked: false,
                        isContainer: true,
                        properties: {}
                     }
                  },
                  {
                     displayName: "Basic node",
                     node: {
                        aspects: [],
                        nodeRef: "some://dummy/node",
                        isLocked: false,
                        isContainer: false,
                        permissions: {
                           user: {
                              Write: true
                           }
                        },
                        properties: {}
                     }
                  },
                  {
                     displayName: "Working copy (user owned)",
                     node: {
                        aspects: ["cm:workingcopy"],
                        nodeRef: "some://dummy/node",
                        isLocked: false,
                        isContainer: false,
                        permissions: {
                           user: {
                              Write: true
                           }
                        },
                        properties: {
                           "cm:workingCopyOwner": {
                              userName: "guest"
                           }
                        }
                     }
                  },
                  {
                     displayName: "Working copy (other owner)",
                     node: {
                        aspects: ["cm:workingcopy"],
                        nodeRef: "some://dummy/node",
                        isLocked: false,
                        isContainer: false,
                        permissions: {
                           user: {
                              Write: true
                           }
                        },
                        properties: {
                           "cm:workingCopyOwner": {
                              userName: "not_me"
                           }
                        }
                     }
                  },
                  {
                     displayName: "Locked (lock owner)",
                     node: {
                        aspects: [],
                        nodeRef: "some://dummy/node",
                        isLocked: true,
                        isContainer: false,
                        permissions: {
                           user: {
                              Write: true
                           }
                        },
                        properties: {
                           "cm:lockOwner": "guest"
                        }
                     }
                  },
                  {
                     displayName: "Locked (other owner)",
                     node: {
                        aspects: [],
                        nodeRef: "some://dummy/node",
                        isLocked: true,
                        isContainer: false,
                        permissions: {
                           user: {
                              Write: true
                           }
                        },
                        properties: {
                           "cm:lockOwner": "bob"
                        }
                     }
                  },
                  {
                     displayName: "Node Lock",
                     node: {
                        aspects: [],
                        nodeRef: "some://dummy/node",
                        isLocked: false,
                        isContainer: false,
                        permissions: {
                           user: {
                              Write: true
                           }
                        },
                        properties: {
                           "cm:lockType": "NODE_LOCK"
                        }
                     }
                  },
                  {
                     displayName: "No write permission",
                     node: {
                        aspects: [],
                        nodeRef: "some://dummy/node",
                        isLocked: false,
                        isContainer: false
                     }
                  }
               ]
            },
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
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "displayName"
                                    }
                                 },
                                 {
                                    name: "alfresco/renderers/Actions"
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
         name: "aikauTesting/mockservices/UploadMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};