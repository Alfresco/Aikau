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
      "alfresco/services/actions/EditOnlineService"
   ],
   widgets: [
      {
         id: "EDIT_ONLINE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Edit Online",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  "id": "document-edit-online",
                  "icon": "document-edit-online",
                  "type": "javascript",
                  "label": "actions.document.edit-online",
                  "params": {
                     "function": "onActionEditOnline"
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
         name: "alfresco/logging/DebugLog"
      }
   ]
};