<import resource="classpath:alfresco/site-webscripts/org/alfresco/aikau/{aikauVersion}/libs/doclib/doclib.lib.js">

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

var includeSortMenu = false;
if (page.url.args["includeSortMenu"])
{
   includeSortMenu = page.url.args["includeSortMenu"] === "true";
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
            label: "Use ?useHash=false&useInfiniteScroll=false&includeSortMenu=true request parameters to disable infinite scroll and hashing"
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

if (includeSortMenu)
{
   model.jsonModel.widgets.splice(1, 0, {
      name: "alfresco/menus/AlfMenuBar",
      config: {
         widgets: [
            {
               id: "DOCLIB_SORT_FIELD_SELECT",
               name: "alfresco/menus/AlfMenuBarSelect",
               config: {
                  selectionTopic: "ALF_DOCLIST_SORT_FIELD_SELECTION",
                  widgets: [
                     {
                        id: "DOCLIB_SORT_FIELD_SELECT_GROUP",
                        name: "alfresco/menus/AlfMenuGroup",
                        config: {
                           widgets: getDocLibSortOptions({})
                        }
                     }
                  ]
               }
            }
         ]
      }
   });
}