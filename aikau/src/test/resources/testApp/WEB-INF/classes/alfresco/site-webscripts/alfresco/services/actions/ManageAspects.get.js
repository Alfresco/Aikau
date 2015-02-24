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
   // We want to test...
   // 1. Request where aspects are provided
   // 2. Request where aspects must be retrieved
   // 3. Request where aspect retrieval fails
   // 4. Request where update fails
   // 5. Request using service where some aspects are not addable
   // 6. Request using service where some aspects are not removable
   widgets: [
      {
         id: "MANAGE_ASPECTS1",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Manage Aspects (no aspects in payload)",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: "onActionManageAspects",
               document: {
                  nodeRef: "workspace/SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                  displayName: "Some Node Title"
               }
            }
         }
      },
      {
         id: "MANAGE_ASPECTS2",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Manage Aspects (includes current aspects)",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: "onActionManageAspects",
               document: {
                  nodeRef: "workspace/SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                  displayName: "Some Other Node Title",
                  node: {
                     aspects: [
                        "cm:generalclassifiable",
                        "cm:complianceable",
                        "cm:effectivity"
                     ]
                  }
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
               action: "onActionManageAspects",
               document: {
                  nodeRef: "going://to/fail",
                  displayName: "No Data Node"
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
               action: "onActionManageAspects",
               document: {
                  nodeRef: "going://to/fail",
                  displayName: "Save Fail Node",
                  node: {
                     aspects: [
                        "cm:generalclassifiable"
                     ]
                  }
               }
            }
         }
      },
      {
         name: "aikauTesting/mockservices/ManageAspectsMockXhr"
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};