// jshint undef:false
// jshint -W069
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
      "alfresco/services/ActionService",
      {
         name: "alfresco/services/actions/SimpleWorkflowService",
         config: {
            useAikauPages: true
         }
      }
   ],
   widgets: [
      {
         id: "APPROVE_SUCCESS",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Approve Success",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  id: "document-approve",
                  type: "javascript",
                  params: {
                     "function": "onActionSimpleRepoAction"
                  }
               },
               document: {
                  nodeRef: "some://node/one"
               }
            }
         }
      },
      {
         id: "APPROVE_FAILURE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Approve Failure",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  id: "document-approve",
                  type: "javascript",
                  params: {
                     "function": "onActionSimpleRepoAction"
                  }
               },
               document: {
                  nodeRef: "some://node/two"
               }
            }
         }
      },
      {
         id: "REJECT_SUCCESS",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Reject Success",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  id: "document-reject",
                  type: "javascript",
                  params: {
                     "function": "onActionSimpleRepoAction"
                  }
               },
               document: {
                  nodeRef: "some://node/three"
               }
            }
         }
      },
      {
         id: "REJECT_FAILURE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Reject Failure",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  id: "document-reject",
                  type: "javascript",
                  params: {
                     "function": "onActionSimpleRepoAction"
                  }
               },
               document: {
                  nodeRef: "some://node/four"
               }
            }
         }
      },
      {
         id: "ASSIGN",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Assign workflow",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  type: "javascript",
                  params: {
                     "function": "onActionAssignWorkflow"
                  }
               },
               document: {
                  nodeRef: "workspace/SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                  displayName: "Some Node Title",
                  fileName: "File 1"
               }
            }
         }
      },
      {
         name: "aikauTesting/mockservices/SimpleWorkflowMockXhr",
         config: {
            responseCode: page.url.args["responseCode"] || 200
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};