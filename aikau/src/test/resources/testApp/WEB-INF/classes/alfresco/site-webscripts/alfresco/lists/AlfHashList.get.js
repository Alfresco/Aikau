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
      "alfresco/services/NavigationService"
   ],
   widgets: [
      {
         id: "SET_HASH1",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set hash (shouldn't trigger load)",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            publishPayload: {
               url: "var3=test3",
               type: "HASH"
            }
         }
      },
      {
         id: "SET_HASH2",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set hash (should trigger load)",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            publishPayload: {
               url: "var1=test1&var2=test2&var3=test3",
               type: "HASH"
            }
         }
      },
      {
         id: "HASHLIST1",
         name: "alfresco/lists/AlfHashList",
         config: {
            useHash: true,
            hashVarsForUpdate: [
               "var1",
               "var2"
            ],
            mapHashVarsToPayload: true,
            widgets: [
               {
                  name: "alfresco/lists/views/AlfListView",
                  config: {
                     additionalCssClasses: "bordered",
                     noItemsMessage: "No results",
                     widgets: [
                        {
                           name: "alfresco/lists/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       additionalCssClasses: "mediumpad",
                                       widgets: [
                                          {
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "name"
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
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};