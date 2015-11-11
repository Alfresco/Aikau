/*jshint maxlen:1000*/
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
      "alfresco/services/ErrorReporter",
      "alfresco/services/DialogService",
      "aikauTesting/mockservices/CommentsListMockService"
   ],
   widgets: [
      {
         name: "alfresco/renderers/CommentsList",
         id: "COMMENT_LIST",
         config: {
            addCommentsFullScreen: true,
            addCommentsPadding: 0,
            pubSubScope: "COMMENTS1_",
            currentItem: {
               node: {
                  nodeRef: "workspace://SpacesStore/4fd42b12-361a-4e02-a1da-9131e6fa074d",
                  permissions: {
                     user: {
                        CreateChildren: true
                     }
                  }
               }
            }
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};