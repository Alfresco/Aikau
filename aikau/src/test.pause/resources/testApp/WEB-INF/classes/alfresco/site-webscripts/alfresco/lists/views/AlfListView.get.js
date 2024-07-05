var createList = function(id, label, loadTopic) {
   return {
      name: "alfresco/layout/VerticalWidgets",
      config: {
         id: id,
         widgets: [{
            name: "alfresco/html/Label",
            config: {
               label: label,
               additionalCssClasses: "bold"
            }
         }, {
            name: "alfresco/lists/AlfList",
            config: {
               propertyToken: "name",
               viewModifiers: ["processInstanceTokens"],
               loadDataPublishTopic: loadTopic,
               widgets: [{
                  name: "alfresco/lists/views/AlfListView",
                  config: {
                     widgets: [{
                        name: "alfresco/lists/views/layouts/Row",
                        config: {
                           widgets: [{
                              name: "alfresco/lists/views/layouts/Cell",
                              config: {
                                 widgets: [{
                                    id: "PROPERTY",
                                    name: "alfresco/renderers/PropertyLink",
                                    config: {
                                       propertyToRender: "{propertyToken}"
                                    }
                                 }]
                              }
                           }]
                        }
                     }]
                  }
               }]
            }
         }]
      }
   };
};

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
      "aikauTesting/mockservices/AlfListViewMockService"
   ],
   widgets: [{
      name: "alfresco/layout/HorizontalWidgets",
      config: {
         widgets: [
            createList("LOADING", "Loading", "GET_NON_LOADING_LIST"),
            createList("DATA_LOAD_FAILURE", "Data load failure", "GET_FAILING_LIST_DATA"),
            createList("NO_DATA", "No data", "GET_EMPTY_LIST_DATA"),
            createList("ERROR", "Error", "GET_ERROR_LIST_DATA"),
            createList("SUCCESS", "Successful", "GET_LIST_DATA")
         ]
      }
   }, {
      name: "alfresco/logging/DebugLog"
   }]
};