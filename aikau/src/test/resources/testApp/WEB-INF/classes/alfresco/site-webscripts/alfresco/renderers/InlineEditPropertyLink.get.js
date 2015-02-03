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
                  name: "alfresco/documentlibrary/views/layouts/Row",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/lists/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    id: "INLINE_EDIT",
                                    name: "alfresco/renderers/InlineEditPropertyLink",
                                    config: {
                                       propertyToRender: "name",
                                       linkPublishTopic: "TEST_PROPERTY_LINK_CLICK",
                                       linkPublishPayload: {},
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
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};