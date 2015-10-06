// jshint undef:false
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
      "alfresco/services/ActionService",
      "alfresco/services/ContentService",
      "alfresco/services/DocumentService"
   ],
   widgets: [
      {
         id: "SINGLE_DELETE_VIA_ACTION_SERVICE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Single Node",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  "id": "document-delete",
                  "icon": "document-delete",
                  "type": "javascript",
                  "label": "actions.document.delete",
                  "params": {
                     "function": "onActionDelete"
                  },
                  "index": "100"
               },
               document: {
                  node: {
                     nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e"
                  },
                  displayName: "Some Node Title"
               }
            }
         }
      },
      {
         id: "MULTIPLE_DELETE_VIA_ACTION_SERVICE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Multiple Nodes",
            publishTopic: "ALF_MULTIPLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: "onActionDelete",
               documents: [
                  {
                     displayName: "Node 1",
                     node: {
                        nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e"
                     }
                  },
                  {
                     displayName: "Node 2",
                     node: {
                        nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e"
                     }
                  }
               ]
            }
         }
      },
      {
         id: "LIST",
         name: "alfresco/lists/views/AlfListView",
         config: {
            pubSubScope: "SCOPED_",
            currentData: {
               items: [
                  {
                     displayName: "Folder node",
                     node: {
                        aspects: [],
                        nodeRef: "some://dummy/node",
                        isLocked: false,
                        isContainer: true,
                        permissions: {
                           user: {
                              Write: true
                           }
                        },
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
                                    id: "DISPLAY_NAME",
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "displayName"
                                    }
                                 },
                                 {
                                    id: "ACTIONS",
                                    name: "alfresco/renderers/Actions",
                                    config: {
                                       widgetsForActions: [
                                          {
                                             name: "alfresco/renderers/actions/Delete"
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
         name: "aikauTesting/mockservices/GenericMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};