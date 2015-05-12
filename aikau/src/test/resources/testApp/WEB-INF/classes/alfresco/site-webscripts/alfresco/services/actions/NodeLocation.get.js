model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true,
               warn: true,
               error: true
            }
         }
      },
      {
         name: "alfresco/services/actions/NodeLocationService",
         config: {
            sitePageTemplate: "share-site-page" // This explicitly configures a URI template as it would be found in Share
         }
      },
      {
         name: "alfresco/services/actions/NodeLocationService",
         config: {
            pubSubScope: "CUSTOM_",
            useAikauPages: true,
            siteUrl: "document-libarary",
            nonSiteUrl: "repo"
         }
      },
      "alfresco/services/ActionService"
   ],
   widgets: [
      {
         id: "SITE_NODE_DEFAULT",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Locate site node (default)",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: "onActionLocate",
               document: {
                  location: {
                     path: "/some/random/path",
                     site: {
                        name: "site1"
                     }
                  },
                  nodeRef: "workspace/SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                  displayName: "Some Node Title"
               }
            }
         }
      },
      {
         id: "NODE_DEFAULT",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Locate repo node (default)",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: "onActionLocate",
               document: {
                  location: {
                     path: "/another/random/path"
                  },
                  nodeRef: "workspace/SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                  displayName: "Some Node Title"
               }
            }
         }
      },
      {
         id: "SITE_NODE_CUSTOM",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Locate site node (custom)",
            pubSubScope: "CUSTOM_",
            publishTopic: "ALF_LOCATE_DOCUMENT",
            publishPayload: {
               item: {
                  location: {
                     path: "/some/random/path",
                     site: {
                        name: "site1"
                     }
                  },
                  nodeRef: "workspace/SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                  displayName: "Some Node Title"
               }
            }
         }
      },
      {
         id: "NODE_CUSTOM",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Locate repo node (custom)",
            pubSubScope: "CUSTOM_",
            publishTopic: "ALF_LOCATE_DOCUMENT",
            publishPayload: {
               item: {
                  location: {
                     path: "/another/random/path"
                  },
                  nodeRef: "workspace/SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
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