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
      "alfresco/services/DocumentService",
      "alfresco/services/actions/WorkflowService"
   ],
   widgets: [
      {
         id: "SINGLE_VIA_ACTION_SERVICE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Single Node",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  "id": "document-assign-workflow",
                  "icon": "document-assign-workflow",
                  "type": "javascript",
                  "label": "actions.document.assign-workflow",
                  "params": {
                     "function": "onActionAssignWorkflow"
                  },
                  "index": "100"
               },
               document: {
                  node: {
                     nodeRef: "workspace://SpacesStore/node1"
                  },
                  displayName: "Some Node Title"
               }
            }
         }
      },
      {
         id: "MULTIPLE_VIA_ACTION_SERVICE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Multiple Nodes",
            publishTopic: "ALF_MULTIPLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: "onActionAssignWorkflow",
               documents: [
                  {
                     node: {
                        nodeRef: "workspace://SpacesStore/node2"
                     }
                  },
                  {
                     node: {
                        nodeRef: "workspace://SpacesStore/node3"
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
                     displayName: "Document",
                     node: {
                        nodeRef: "workspace://SpacesStore/node4",
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
                                             name: "alfresco/renderers/actions/StartWorkflow"
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
         name: "alfresco/logging/DebugLog"
      }
   ]
};