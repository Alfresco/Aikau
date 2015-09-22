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
      "alfresco/services/DocumentService",
      "alfresco/services/actions/CopyMoveService"
   ],
   widgets: [
      {
         id: "SINGLE_COPY_VIA_ACTION_SERVICE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Single Node",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  "icon": "document-copy-to",
                  "type": "javascript",
                  "label": "actions.document.copy-to",
                  "params": {
                     "function": "onActionCopyTo"
                  },
                  "index": "100"
               },
               document: {
                  node: {
                     nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4d"
                  },
                  displayName: "Some Node Title"
               }
            }
         }
      },
      {
         id: "MULTIPLE_COPY_VIA_ACTION_SERVICE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Multiple Nodes",
            publishTopic: "ALF_MULTIPLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: "onActionCopyTo",
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
                        nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4f"
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
                                             name: "alfresco/renderers/actions/CopyTo"
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
         name: "aikauTesting/mockservices/DownloadArchiveMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};