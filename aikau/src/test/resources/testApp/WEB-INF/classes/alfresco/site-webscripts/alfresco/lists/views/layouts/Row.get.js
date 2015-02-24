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
         id: "VIEW1",
         name: "alfresco/lists/views/AlfListView",
         config: {
            currentData: {
               items: [
                  {
                     one: "data1",
                     two: "data2",
                     three: "data3"
                  }
               ]
            },
            widgets: [
               {
                  id: "TWO_CELLS",
                  name: "alfresco/lists/views/layouts/Row",
                  config: {
                     additionalCssClasses: "extra",
                     widgets: [
                        {
                           name: "alfresco/lists/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "one"
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "two"
                                    }
                                 }
                              ]
                           }
                        }
                     ]
                  }
               },
               {
                  id: "ONE_CELL",
                  name: "alfresco/lists/views/layouts/Row",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/lists/views/layouts/Cell",
                           config: {
                              colspan: 2,
                              widgets: [
                                 {
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "three"
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