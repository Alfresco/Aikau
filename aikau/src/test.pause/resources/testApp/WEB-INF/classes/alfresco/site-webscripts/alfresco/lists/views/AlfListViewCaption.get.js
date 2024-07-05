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
      name: "alfresco/lists/AlfList",
      config: {
         propertyToken: "name",
         viewModifiers: ["processInstanceTokens"],
         loadDataPublishTopic: "GET_LIST_DATA",
         widgets: [{
            name: "alfresco/lists/views/AlfListView",
            config: {
               a11yCaption: "Caption: <script>alert('XSS');</script>",
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
   }, {
      name: "alfresco/logging/DebugLog"
   }]
};