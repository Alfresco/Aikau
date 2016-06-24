/* global url, model */
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
      "alfresco/services/UserService"
   ],
   widgets: [
      {
         name: "alfresco/lists/AlfSortablePaginatedList",
         config: {
            loadDataPublishTopic: "ALF_GET_USERS",
            loadDataPublishPayload: {
               alfResponseTopic: "ALF_GET_USERS_SUCCESS"
            },
            widgets: [
               {
                  name: "alfresco/lists/views/HtmlListView",
                  config: {
                     propertyToRender: "displayName"
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/UserMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};
