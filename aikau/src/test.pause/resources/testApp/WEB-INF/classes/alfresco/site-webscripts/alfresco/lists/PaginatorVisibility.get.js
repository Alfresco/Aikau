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
      }
   ],
   widgets: [
      {
         id: "PROVIDE_DATA",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Provide Data",
            publishTopic: "GET_DATA_SUCCESS",
            publishPayload: {
               items: [
                  {
                     name: "Test"
                  }
               ]
            }
         }
      },
      {
         id: "RELOAD_DATA",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Request Reload",
            publishTopic: "RELOAD_DATA"
         }
      },
      {
         id: "PAGINATOR",
         name: "alfresco/lists/Paginator",
         config: {
            hideWhenLoading: true,
            loadDataPublishTopic: "GET_DATA"
         }
      },
      {
         id: "LIST",
         name: "alfresco/lists/AlfList",
         config: {
            loadDataPublishTopic: "GET_DATA",
            reloadDataTopic: "RELOAD_DATA",
            widgets: [
               {
                  name: "alfresco/lists/views/HtmlListView",
                  config: {
                     listStyleType: "square",
                     propertyToRender: "name"
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};