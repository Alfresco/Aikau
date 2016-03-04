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
      {
         name: "alfresco/services/actions/ChangeTypeService",
         config: {
            types: [
               {
                  name: "cm:folder"
               },
               {
                  name: "cm:content",
                  label: "Content",
                  subTypes: [
                     {
                        name: "cm:sub-content",
                        label: "Sub-Content",
                        subTypes: [
                           {
                              name: "cm:super-sub-content"
                           }
                        ]
                     }
                  ]
               }
            ]
         }
      }
   ],
   widgets: [
      {
         id: "CHANGE_TYPE_1",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Change Type",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  "id": "document-change-type",
                  "icon": "document-change-type",
                  "type": "javascript",
                  "label": "actions.document.change-type",
                  "params": {
                     "function": "onActionChangeType"
                  },
                  "index": "300"
               },
               document: {
                  node: {
                     nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                     type: "cm:content"
                  },
                  displayName: "Some Node Title"
               }
            }
         }
      },
      {
         id: "CHANGE_TYPE_2",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Change Type (no metadata)",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  "id": "document-change-type",
                  "icon": "document-change-type",
                  "type": "javascript",
                  "label": "actions.document.change-type",
                  "params": {
                     "function": "onActionChangeType"
                  },
                  "index": "300"
               },
               document: {
                  node: {
                     nodeRef: "workspace://SpacesStore/f8394454-0651-48a5-b583-d067c7d03339"
                  },
                  displayName: "Some Node Title"
               }
            }
         }
      },
      {
         name: "aikauTesting/mockservices/ChangeTypeMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};