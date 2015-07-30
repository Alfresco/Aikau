var propertyLinkWidgets = [
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
   ],
   propertyLinkWidgetsNoTopic = [
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
                           name: "alfresco/renderers/InlineEditPropertyLink",
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
                              ]
                           }
                        }
                     ]
                  }
               }
            ]
         }
      }
   ];

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
         id: "LIST_TOPIC_NOSCOPE",
         config: {
            currentData: {
               items: [
                  {
                     name: "Test item (topic, no scope)"
                  }
               ]
            },
            widgets: propertyLinkWidgets
         }
      },
      {
         name: "alfresco/lists/views/AlfListView",
         id: "LIST_TOPIC_SCOPED",
         config: {
            pubSubScope: "SCOPED_",
            currentData: {
               items: [
                  {
                     name: "Test item (topic, scoped)"
                  }
               ]
            },
            widgets: propertyLinkWidgets
         }
      },
      {
         name: "alfresco/lists/views/AlfListView",
         id: "LIST_NOTOPIC_SCOPED",
         config: {
            pubSubScope: "SCOPED_",
            currentData: {
               items: [
                  {
                     name: "Test item (no topic, scoped)"
                  }
               ]
            },
            widgets: propertyLinkWidgetsNoTopic
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};