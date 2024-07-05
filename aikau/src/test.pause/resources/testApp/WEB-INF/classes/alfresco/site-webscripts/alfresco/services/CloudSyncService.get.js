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
      "alfresco/services/CloudSyncService",
      "alfresco/services/DialogService",
      "alfresco/services/NotificationService"
   ],
   widgets: [
      {
         id: "UNAUTHENTICATED",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Request to sync (unauthenticated)",
            publishTopic: "ALF_INIT_CLOUD_SYNC",
            publishPayload: {
               nodes: [
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
         name: "aikauTesting/mockservices/CloudSyncMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};
