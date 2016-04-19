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
         id: "LIST",
         name: "alfresco/lists/AlfList",
         config: {
            currentData: {
               items: [
                  {
                     key: "ONE",
                     item: {
                        properties: {
                           "qshare:sharedId": "Test"
                        }
                     },
                     displayName: "Shared"
                  },
                  {
                     key: "TWO",
                     item: {
                        properties: {}
                     },
                     displayName: "Not Shared"
                  }
               ]
            },
            widgets: [
               {
                  id: "VIEW",
                  name: "alfresco/lists/views/AlfListView",
                  config: {
                     widgets: [
                        {
                           id: "ROW",
                           name: "alfresco/lists/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    id: "CELL1",
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             id: "NAME",
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "displayName"
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
                                             id: "TSA1",
                                             name: "alfresco/renderers/ToggleStateActions",
                                             config: {
                                                itemKeyProperty: "key",
                                                toggleOnWhenPropertySet: true,
                                                toggleStateProperty: "item.properties.qshare:sharedId",
                                                customActions: [
                                                   {
                                                      id: "ALF_TOGGLE_OFF",
                                                      label: "Toggle Off",
                                                      index: "10",
                                                      publishTopic: "ALF_TOGGLE_OFF"
                                                   }
                                                ]
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    id: "CELL3",
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             id: "TSA2",
                                             name: "alfresco/renderers/ToggleStateActions",
                                             config: {
                                                itemKeyProperty: "key",
                                                toggleStateProperty: "displayName",
                                                toggleStateOnValue: "Shared",
                                                toggleOnStateLabel: "Sure thing",
                                                toggleOffStateLabel: "No way",
                                                customActions: [
                                                   {
                                                      id: "ALF_TOGGLE_OFF",
                                                      label: "Toggle Off",
                                                      index: "10",
                                                      publishTopic: "ALF_TOGGLE_OFF"
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
