/* global page */
/* jshint sub:true */
var useHash = true;
if (page.url.args["useHash"])
{
   useHash = page.url.args["useHash"] === "true";
}
var useInfiniteScroll = true;
if (page.url.args["useInfiniteScroll"])
{
   useInfiniteScroll = page.url.args["useInfiniteScroll"] === "true";
}

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
      "alfresco/services/NavigationService",
      "alfresco/services/DocumentService",
      "alfresco/services/InfiniteScrollService"
   ],
   widgets: [
      {
         name: "alfresco/html/Label",
         config: {
            label: "Use ?useHash=false&useInfiniteScroll=false request parameters to disable infinite scroll and hashing"
         }
      },
      {
         id: "DOCUMENT_LIST",
         name: "alfresco/documentlibrary/AlfDocumentList",
         config: {
            sortField: null,
            useHash: useHash,
            useInfiniteScroll: useInfiniteScroll,
             widgets: [
               {
                  id: "TABLE_VIEW",
                  name: "alfresco/documentlibrary/views/AlfTableView"
               }
            ]
         }
      },
      {
         name: "alfresco/testing/NodesMockXhr",
         config: {
            totalItems: 4,
            folderRatio: [100]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};