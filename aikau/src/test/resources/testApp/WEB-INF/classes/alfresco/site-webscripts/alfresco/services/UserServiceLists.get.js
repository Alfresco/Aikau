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
         name: "alfresco/lists/AlfFilteredList",
         config: {
            loadDataPublishTopic: "ALF_GET_USERS",
            sortField: "fullName",
            filteringTopics: ["_valueChangeOf_FILTER"],
            widgetsForFilters: [
               {
                  id: "COMPOSITE_TEXTBOX",
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     fieldId: "FILTER",
                     name: "filter",
                     placeHolder: "Filter by name",
                     label: "Name filter"
                  }
               }
            ],
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
