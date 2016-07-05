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
      "alfresco/services/FormsRuntimeService",
      "alfresco/services/DialogService"
   ],
   widgets: [
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show Edit Simple DocLib Node",
            publishTopic: "ALF_FORM_REQUEST",
            publishPayload: {
               itemKind: "node",
               itemId: "some://dummy/node",
               formId: "doclib-simple-metadata",
               mode: "edit"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show View Default Node",
            publishTopic: "ALF_FORM_REQUEST",
            publishPayload: {
               itemKind: "node",
               itemId: "some://dummy/node",
               mode: "view"
            }
         }
      },
      {
         name: "alfresco/layout/DynamicWidgets",
         config: {
            subscriptionTopic: "ALF_FORM_REQUEST_SUCCESS"
         }
      },
      {
         name: "aikauTesting/mockservices/FormsRuntimeMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};