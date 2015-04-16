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
      "aikauTesting/mockservices/MockCrudService",
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         name: "alfresco/lists/views/AlfListView",
         config: {
            id: "LIST",
            currentData: {
               items: [
                  {
                     name: "Test",
                     option: "1"
                  }
               ]
            },
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
                                    id: "INLINE_EDIT",
                                    name: "alfresco/renderers/InlineEditProperty",
                                    config: {
                                       propertyToRender: "name",
                                       publishTopic: "ALF_CRUD_UPDATE",
                                       publishPayloadType: "PROCESS",
                                       publishPayloadModifiers: ["processCurrentItemTokens"],
                                       publishPayloadItemMixin: true,
                                       publishPayload: {
                                          url: "api/solr/facet-config/{name}"
                                       },
                                       hiddenDataRules: [
                                          {
                                             name: "hiddenData",
                                             rulePassValue: "hidden_update",
                                             ruleFailValue: "",
                                             is: ["New"]
                                          }
                                       ],
                                       renderOnNewLine: true
                                    }
                                 },
                                 {
                                    id: "INLINE_SELECT",
                                    name: "alfresco/renderers/InlineEditSelect",
                                    config: {
                                       propertyToRender: "option",
                                       publishTopic: "ALF_CRUD_UPDATE",
                                       publishPayloadType: "PROCESS",
                                       publishPayloadModifiers: ["processCurrentItemTokens"],
                                       publishPayloadItemMixin: true,
                                       publishPayload: {
                                          url: "api/solr/facet-config/{name}",
                                          succeed: false
                                       },
                                       optionsConfig: {
                                          fixed: [
                                             {label:"One",value:"1"},
                                             {label:"Two",value:"2"},
                                             {label:"Three",value:"3"}
                                          ]
                                       }
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