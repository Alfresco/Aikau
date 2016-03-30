function getPropertyLinkWidgets(id) {
   return [
      {
         name: "alfresco/lists/views/layouts/Row",
         config: {
            widgets: [
               {
                  name: "alfresco/lists/views/layouts/Cell",
                  config: {
                     widgets: [
                        {
                           id: id,
                           name: "alfresco/renderers/InlineEditPropertyLink",
                           config: {
                              permissionProperty: null,
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
   ];
}

function getPropertyLinkWidgetsNoTopic(id) {
   return [
      {
         name: "alfresco/lists/views/layouts/Row",
         config: {
            widgets: [
               {
                  name: "alfresco/lists/views/layouts/Cell",
                  config: {
                     widgets: [
                        {
                           id: id,
                           name: "alfresco/renderers/InlineEditPropertyLink",
                           config: {
                              permissionProperty: null,
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
}

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
            widgets: getPropertyLinkWidgets("INLINE_EDIT_1")
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
            widgets: getPropertyLinkWidgets("INLINE_EDIT_2")
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
            widgets: getPropertyLinkWidgetsNoTopic("INLINE_EDIT_3")
         }
      },
      {
         name: "alfresco/lists/views/AlfListView",
         id: "LIST_UMLAUTS",
         config: {
            currentData: {
               items: [
                  {
                     name: "test äöü test"
                  }
               ]
            },
            widgets: getPropertyLinkWidgets("INLINE_EDIT_4")
         }
      },
      {
         name: "alfresco/lists/views/AlfListView",
         id: "LIST_XSS",
         config: {
            currentData: {
               items: [
                  {
                     name: "<img src=\"1\" onerror=\"window.hackedProperty=true\">"
                  }
               ]
            },
            widgets: getPropertyLinkWidgets("INLINE_EDIT_5")
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};