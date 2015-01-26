model.jsonModel = {
   services: [
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/pickers/Picker",
         config: {
            widgetsForPickedItems: [
               {
                  name: "alfresco/pickers/PickedItems",
                  assignTo: "pickedItemsWidget",
                  config: {
                     itemKey: "name",
                     widgets: [
                        {
                           name: "alfresco/documentlibrary/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/documentlibrary/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "name"
                                             }
                                          },
                                          {
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "title",
                                                renderedValuePrefix: "(",
                                                renderedValueSuffix: ")",
                                                renderSize: "small"
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    name: "alfresco/documentlibrary/views/layouts/Cell",
                                    config: {
                                       width: "20px",
                                       widgets: [
                                          {
                                             name: "alfresco/renderers/PublishAction",
                                             config: {
                                                iconClass: "delete-16",
                                                publishTopic: "ALF_ITEM_REMOVED"
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
            ],
            widgetsForRootPicker: [
               {
                  name: "alfresco/menus/AlfVerticalMenuBar",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/menus/AlfMenuBarItem",
                           config: {
                              label: "All",
                              publishTopic: "ALF_ADD_PICKER",
                              publishPayload: {
                                 currentPickerDepth: 0,
                                 picker: {
                                    name: "alfresco/pickers/PropertyPicker",
                                    config: {
                                       currentPickerDepth: 1,
                                       url: "api/properties"
                                    }
                                 }
                              }
                           }
                        },
                        {
                           name: "alfresco/menus/AlfMenuBarItem",
                           config: {
                              label: "Aspects",
                              publishTopic: "ALF_ADD_PICKER",
                              publishPayload: {
                                 currentPickerDepth: 0,
                                 picker: {
                                    name: "alfresco/pickers/PropertyPicker",
                                    config: {
                                       currentPickerDepth: 1,
                                       url: "api/classes?cf=aspect"
                                    }
                                 }
                              }
                           }
                        },
                        {
                           name: "alfresco/menus/AlfMenuBarItem",
                           config: {
                              label: "Types",
                              publishTopic: "ALF_ADD_PICKER",
                              publishPayload: {
                                 currentPickerDepth: 0,
                                 picker: {
                                    name: "alfresco/pickers/PropertyPicker",
                                    config: {
                                       generatePubSubScope: true,
                                       url: "api/classes?cf=type",
                                       widgets: [
                                          {
                                             name: "alfresco/documentlibrary/views/AlfDocumentListView",
                                             config: {
                                                widgets: [
                                                   {
                                                      name: "alfresco/documentlibrary/views/layouts/Row",
                                                      config: {
                                                         widgets: [
                                                            {
                                                               name: "alfresco/documentlibrary/views/layouts/Cell",
                                                               config: {
                                                                  widgets: [
                                                                     {
                                                                        name: "alfresco/renderers/PropertyLink",
                                                                        config: {
                                                                           propertyToRender: "title",
                                                                           useCurrentItemAsPayload: false,
                                                                           publishTopic: "ALF_ADD_PICKER",
                                                                           publishPayload: {
                                                                              currentPickerDepth: 1,
                                                                              picker: {
                                                                                 name: "alfresco/pickers/PropertyPicker",
                                                                                 config: {
                                                                                    generatePubSubScope: true,
                                                                                    url: "api/classes/{name}/properties"
                                                                                 }
                                                                              }
                                                                           },
                                                                           publishToParent: true,
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
                                 }
                              }
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