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
      "alfresco/services/ContentService"
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
         name: "aikauTesting/mockservices/CreateContentMockXhr"
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};