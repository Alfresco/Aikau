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
      "alfresco/services/CloudSyncService"
   ],
   widgets: [
      {
         id: "FORM",
         name: "alfresco/forms/Form",
         config: {
            okButtonPublishTopic: "POST_FORM",
            setValueTopic: "SET_FORM_VALUE",
            scopeFormControls: false,
            value: {
               hidden2: "initial value"
            },
            widgets: [
               {
                  id: "REVEAL_TREE",
                  name: "alfresco/forms/controls/CheckBox", 
                  config: {
                     fieldId: "REVEAL_TREE",
                     label: "Show Tree",
                     description: "Check to reveal the tree field",
                     name: "showTree",
                     value: false
                  }
               },
               {
                  id: "TREE",
                  name: "alfresco/forms/controls/Tree",
                  config: {
                     fieldId: "TREE",
                     label: "Select path",
                     description: "Select a path from the tree",
                     name: "path",
                     optionsConfig: {
                        publishTopic: "ALF_GET_CLOUD_PATH",
                        publishPayload: {
                           username: "tony@alfresco.com",
                           remoteTenantId: "alfresco.com",
                           remoteSiteId: "site1"
                        }
                     },
                     validateWhenHidden: true,
                     visibilityConfig: {
                        initialValue: false,
                        rules: [
                           {
                              targetId: "REVEAL_TREE",
                              is: [true]
                           }
                        ]
                     },
                     requirementConfig: {
                        initialValue: true
                     },
                     treeNodeDisablementConfig: {
                        rules: [
                           {
                              property: "item.aspects",
                              contains: ["sync:synced"]
                           }
                        ]
                     }
                  }
               }
            ]
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