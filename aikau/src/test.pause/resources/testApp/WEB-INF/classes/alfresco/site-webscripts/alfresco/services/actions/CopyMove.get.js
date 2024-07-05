// jshint undef:false
// jshint sub:true
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
      "alfresco/services/SiteService",
      {
         name: "alfresco/services/actions/CopyMoveService",
         config: {
            repoNodeRef: page.url.args["repoNodeRef"] || "alfresco://company/home",
            copyAPI: page.url.args["copyAPI"] ||"slingshot/doclib/action/copy-to/node/",
            supportLinkCreation: true
         }
      }
   ],
   widgets: [
      {
         id: "COPY1",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Copy (via ActionService)",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  type: "javascript",
                  params: {
                     "function": "onActionCopyTo"
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
         id: "MOVE1",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Move (via ActionService)",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  type: "javascript",
                  params: {
                     "function": "onActionMoveTo"
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
         id: "COPY2",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Multiple Copy (via ActionService)",
            publishTopic: "ALF_MULTIPLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: "onActionCopyTo",
               documents: [
                  {
                     displayName: "Node 1",
                     node: {
                        nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e"
                     }
                  }
               ]
            }
         }
      },
      {
         name: "aikauTesting/mockservices/CopyMoveServiceMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};