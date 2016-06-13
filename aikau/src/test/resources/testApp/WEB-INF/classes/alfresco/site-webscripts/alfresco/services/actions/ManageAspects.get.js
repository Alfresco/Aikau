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
      "alfresco/services/NotificationService",
      "alfresco/services/DialogService",
      "alfresco/services/ActionService",
      {
         name: "alfresco/services/actions/ManageAspectsService",
         config: {
            availableAspects: ["cm:generalclassifiable",
                               "cm:complianceable",
                               "cm:effectivity",
                               "cm:summarizable",
                               "cm:versionable",
                               "cm:templatable",
                               "cm:emailed",
                               "emailserver:aliasable",
                               "app:inlineeditable",
                               "cm:geographic",
                               "exif:exif",
                               "audio:audio",
                               "cm:indexControl",
                               "dp:restrictable"],
            addableAspects: ["cm:generalclassifiable",
                             "cm:complianceable",
                             "cm:summarizable",
                             "cm:versionable",
                             "cm:templatable",
                             "cm:emailed",
                             "emailserver:aliasable",
                             "app:inlineeditable"],
            removableAspects: ["cm:generalclassifiable"]
         }
      }
   ],
   widgets: [
      {
         id: "MANAGE_ASPECTS1",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Manage Aspects (no aspects in payload)",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  "id": "document-manage-aspects",
                  "icon": "document-manage-aspects",
                  "type": "javascript",
                  "label": "actions.document.manage-aspects",
                  "params": {
                     "function": "onActionManageAspects"
                  },
                  "index": "300"
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
         id: "MANAGE_ASPECTS3",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Manage Aspects (fail on aspect request)",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  "id": "document-manage-aspects",
                  "icon": "document-manage-aspects",
                  "type": "javascript",
                  "label": "actions.document.manage-aspects",
                  "params": {
                     "function": "onActionManageAspects"
                  },
                  "index": "300"
               },
               document: {
                  displayName: "No Data Node",
                  node: {
                     nodeRef: "fail://to/retrieve"
                  }
               }
            }
         }
      },
      {
         id: "MANAGE_ASPECTS4",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Manage Aspects (fail on save)",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  "id": "document-manage-aspects",
                  "icon": "document-manage-aspects",
                  "type": "javascript",
                  "label": "actions.document.manage-aspects",
                  "params": {
                     "function": "onActionManageAspects"
                  },
                  "index": "300"
               },
               document: {
                  displayName: "Save Fail Node",
                  node: {
                     nodeRef: "fail://to/save"
                  }
               }
            }
         }
      },
      {
         name: "aikauTesting/mockservices/ManageAspectsMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};