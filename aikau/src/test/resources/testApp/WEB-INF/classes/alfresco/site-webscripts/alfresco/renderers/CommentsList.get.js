/*jshint maxlen:1000*/
model.jsonModel = {
   services: [{
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true
            }
         }
      },
      "alfresco/services/ErrorReporter"
   ],
   widgets: [{
      name: "alfresco/renderers/CommentsList",
      config: {
         currentItem: {
            node: {
               nodeRef: "workspace:\/\/SpacesStore\/4307d3f5-7d49-461a-bf86-b9510956ee2f"
            }
         }
      }
   }, {
      name: "aikauTesting/mockservices/CommentsListMockXhr"
   }, {
      name: "alfresco/logging/DebugLog"
         // name: "alfresco/logging/SubscriptionLog"
   }, {
      name: "aikauTesting/TestCoverageResults"
   }]
};