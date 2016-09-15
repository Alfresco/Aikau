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
      "alfresco/services/DialogService",
      "alfresco/services/UserService",
      "alfresco/services/CrudService"
   ],
   widgets: [
      {
         id: "EDIT_NODE",
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
         id: "VIEW_NODE",
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
         id: "CREATE_WORKFLOW",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Create workflow",
            publishTopic: "ALF_FORM_REQUEST",
            publishPayload: {
               itemKind: "workflow",
               itemId: "activiti%24activitiAdhoc",
               mode: "create",
               formConfig: {
                  formId: "CREATE_WORKFLOW_FORM",
                  formSubmissionPayloadMixin: {
                     alfResponseScope: "CREATE_WORKFLOW_SCOPE_"
                  }
               }
            }
         }
      },
      {
         id: "EDIT_TASK",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Edit task",
            publishTopic: "ALF_FORM_REQUEST",
            publishPayload: {
               itemKind: "task",
               itemId: "activiti$79",
               mode: "edit",
               formConfig: {
                  useDialog: true,
                  formId: "EDIT_TASK_FORM",
                  dialogTitle: "Edit Task",
                  formSubmissionPayloadMixin: {
                     alfResponseScope: "EDIT_TASK_SCOPE_"
                  }
               }
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