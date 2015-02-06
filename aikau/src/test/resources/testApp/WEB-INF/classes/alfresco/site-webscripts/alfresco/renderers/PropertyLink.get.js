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
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         name: "alfresco/lists/views/AlfListView",
         config: {
            id: "LIST_WITH_HEADER",
            currentData: {
               items: [
                  {name: "Site1", urlname: "site1"},
                  {name: "Site2", urlname: "site2"},
                  {name: "Site3", urlname: "site3"},
                  {name: "Site4", urlname: "site4"}
               ]
            },
            widgetsForHeader: [
               {
                  name: "alfresco/lists/views/layouts/HeaderCell",
                  config: {
                     id: "COLUMN1_HEADER",
                     label: "Column 1"
                  }
               }
            ],
            widgets:[
               {
                  name: "alfresco/lists/views/layouts/Row",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/lists/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/renderers/PropertyLink",
                                    config: {
                                       propertyToRender: "name",
                                       publishTopic: "publishTopic"
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
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};