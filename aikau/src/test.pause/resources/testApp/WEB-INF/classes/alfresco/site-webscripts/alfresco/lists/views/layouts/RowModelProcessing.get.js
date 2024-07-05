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
   widgets:[
      {
         name: "alfresco/lists/views/AlfListView",
         config: {
            currentData: {
               items: [
                  { 
                     name: "Bob",
                     title: "Mr", 
                     attribute: "name"
                  },
                  { 
                     name: "Ted",
                     title: "Dr", 
                     attribute: "title"
                  }
               ]
            },
            widgets:[
               {
                  id: "ROW",
                  name: "alfresco/lists/views/layouts/Row",
                  config: {
                     widgetModelModifiers: ["processCurrentItemTokens"],
                     widgets: [
                        {
                           id: "CELL",
                           name: "alfresco/lists/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    id: "PROPERTY",
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "{attribute}"
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
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};