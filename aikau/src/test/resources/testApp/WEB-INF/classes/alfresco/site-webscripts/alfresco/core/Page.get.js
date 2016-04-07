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
      "alfresco/services/CrudService",
      "aikauTesting/services/ThrowsInitException",
      "alfresco/services/SearchService"
   ],
   widgets: [
      {
         id: "SEARCH_LIST",
         name: "alfresco/search/AlfSearchList",
         config: {
            useHash: true,
            widgets: [
               {
                  name: "alfresco/lists/views/HtmlListView"
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/PaginatedSearchListMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};
