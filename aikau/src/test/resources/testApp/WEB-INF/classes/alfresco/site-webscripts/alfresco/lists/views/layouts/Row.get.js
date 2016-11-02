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
                  name: "alfresco/lists/views/layouts/Row",
                  config: {
                     focusHighlighting: true,
                     additionalCssClasses: "extra",
                     widgets: [
                        {
                           id: "CELL1",
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
                           id: "CELL2",
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
                  name: "alfresco/lists/views/layouts/Row",
                  config: {
                     publishTopic: "TESTING",
                     publishPayload: {
                        test: "{two}"
                     },
                     publishPayloadType: "PROCESS",
                     publishPayloadModifiers: ["processCurrentItemTokens"],
                     widgets: [
                        {
                           id: "CELL3",
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
         name: "alfresco/logging/DebugLog"
      }
   ]
};