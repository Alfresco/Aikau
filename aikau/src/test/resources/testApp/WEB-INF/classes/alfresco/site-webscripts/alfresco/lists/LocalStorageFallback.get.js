var views = [
   {
      name: "alfresco/lists/views/AlfListView",
      config: {
         widgets: [
            {
               name: "alfresco/lists/views/layouts/Row",
               config: {
                  widgets: [
                     {
                        name: "alfresco/lists/views/layout/Cell",
                        config: {
                           widgets: [
                              {
                                 name: "alfresco/renderers/Property",
                                 config: {
                                    propertyToRender: "name"
                                 }
                              }
                           ]
                        }
                     }
                  ]
               }
            }
         ]
      }
   }
];

/* global page */
var type = page.url.args.listType;
var listWidget;
switch (type) {

   case "CurrentFilter":
      listWidget = {
         id: "LIST",
         name: "alfresco/lists/AlfHashList",
         config: {
            useHash: true,
            useLocalStorageHashFallback: false,
            loadDataPublishTopic: "LOAD",
            currentFilter: {
               key1: "value1",
               key2: "value2"
            },
            widgets: views
         }
      };
      break;

   case "CurrentFilterWithLocalStorage":
      listWidget = {
         id: "LIST",
         name: "alfresco/lists/AlfHashList",
         config: {
            useHash: true,
            useLocalStorageHashFallback: true,
            loadDataPublishTopic: "LOAD",
            currentFilter: {
               key1: "value1",
               key2: "value2"
            },
            widgets: views
         }
      };
      break;

   case "LocalStorage":
      listWidget = {
         id: "LIST",
         name: "alfresco/lists/AlfHashList",
         config: {
            useHash: true,
            useLocalStorageHashFallback: true,
            loadDataPublishTopic: "LOAD",
            updateInstanceValues: true,
            hashVarsForUpdate: [
               "update"
            ],
            mapHashVarsToPayload: true,
            widgets: views
         }
      };
      break;

   default: 
      listWidget = {
         id: "LIST",
         name: "alfresco/lists/AlfHashList",
         config: {
            useHash: true,
            useLocalStorageHashFallback: false,
            loadDataPublishTopic: "LOAD",
            widgets: views
         }
      };
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
      "alfresco/services/NavigationService"
   ],
   widgets: [
      listWidget,
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};