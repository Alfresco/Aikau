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
         name: "alfresco/lists/AlfList",
         config: {
            currentData: {
               items: [
                  {
                     name: "one"
                  },
                  {
                     name: "two"
                  },
                  {
                     name: "three"
                  },
                  {
                     name: "four"
                  }
               ]
            },
            widgets: [
               {
                  name: "alfresco/lists/views/HtmlListView",
                  config: {
                     propertyToRender: "name"
                  }
               }
            ]
         }
      }
   ]
};