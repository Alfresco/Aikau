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
         id: "DELETE_CONTENT_1",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Delete Content",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  type: "javascript",
                  params: {
                     "function": "onActionDelete"
                  }
               },
               document: {
                  nodeRef: "workspace/SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                  displayName: "Some Node Title"
               }
            }
         }
      },
      {
         id: "DELETE_CONTENT_2",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Delete Content (different node data)",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  type: "javascript",
                  params: {
                     "function": "onActionDelete"
                  }
               },
               document: {
                  node: {
                     nodeRef: "workspace/SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                     properties: {
                        "cm:name": "Some Node"
                     }
                  }
               }
            }
         }
      },
      {
         id: "EDIT_BASIC_METADATA",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Edit basic metadata",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  type: "javascript",
                  params: {
                     "function": "onActionDetails"
                  }
               },
               document: {
                  node: {
                     nodeRef: "workspace/SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                     properties: {
                        "cm:name": "Some Node",
                        "cm:title": "With this title",
                        "cm:description": "And this description"
                     }
                  }
               }
            }
         }
      },
      {
         id: "EDIT_BASIC_METADATA_NODEREF_ONLY",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Edit basic metadata (nodeRef only)",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  type: "javascript",
                  params: {
                     "function": "onActionDetails"
                  }
               },
               document: {
                  node: {
                     nodeRef: "workspace/SpacesStore/f8394454-0651-48a5-b583-d067c7d03339"
                  }
               }
            }
         }
      },
      {
         name: "aikauTesting/mockservices/CreateContentMockXhr"
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};