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
      "aikauTesting/mockservices/MockCrudService"
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
                     option: "1",
                     node: {
                        nodeRef: "dummy://node/1",
                        permissions: {
                           user: {
                              Write: true
                           }
                        }
                     },
                     isEnabled: true
                  },
                  {
                     name: "Test 2",
                     option: "2",
                     node: {
                        nodeRef: "dummy://node/2",
                        permissions: {
                           user: {
                              Write: false
                           }
                        }
                     },
                     isEnabled: false
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
                                       label: "Label",
                                       propertyToRender: "name",
                                       permissionProperty: "node.permissions.user.Write",
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
                                       renderOnNewLine: true,
                                       editSubscriptionsTopics: ["EDIT_PROPERTY"]
                                    }
                                 },
                                 {
                                    id: "INLINE_SELECT",
                                    name: "alfresco/renderers/InlineEditSelect",
                                    config: {
                                       propertyToRender: "option",
                                       permissionProperty: "node.permissions.user.Write",
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
                                 },
                                 {
                                    id: "INLINE_EDIT_NO_VALUE",
                                    name: "alfresco/renderers/InlineEditProperty",
                                    config: {
                                       propertyToRender: "title",
                                       permissionProperty: "node.permissions.user.Write",
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
                                    id: "INLINE_EDIT_NO_VALUE_WITH_WARNING",
                                    name: "alfresco/renderers/InlineEditProperty",
                                    config: {
                                       propertyToRender: "title",
                                       permissionProperty: "node.permissions.user.Write",
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
                                       renderOnNewLine: true,
                                       renderedValuePrefix: "(",
                                       renderedValueSuffix: ")",
                                       warnIfNotAvailable: true,
                                       warnIfNotAvailableMessage: "No property set"
                                    }
                                 },
                                 {
                                    id: "INLINE_SELECT_WITH_BOOLEAN_VALUES",
                                    name: "alfresco/renderers/InlineEditSelect",
                                    config: {
                                       propertyToRender: "isEnabled",
                                       refreshCurrentItem: true,
                                       publishTopic: "ALF_CRUD_UPDATE",
                                       publishPayloadType: "PROCESS",
                                       publishPayloadModifiers: ["processCurrentItemTokens"],
                                       publishPayloadItemMixin: false,
                                       publishPayload: {
                                          filterID: "{filterID}",
                                          url: "api/facet/facet-config/{filterID}",
                                          noRefresh: true,
                                          successMessage: "Hurrah, it worked"
                                       },
                                       optionsConfig: {
                                          fixed: [
                                             {
                                                label: "Yes",
                                                value: "true"
                                             },
                                             {
                                                label: "No",
                                                value: "false"
                                             }
                                          ]
                                       },
                                       valueDisplayMap: [
                                          {
                                             label: "Yes",
                                             value: true
                                          },
                                          {
                                             label: "No",
                                             value: false
                                          }
                                       ]
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
                                    id: "EDIT_ACTION",
                                    name: "alfresco/renderers/PublishAction",
                                    config: {
                                       publishTopic: "EDIT_PROPERTY",
                                       publishPayloadType: "CURRENT_ITEM"
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