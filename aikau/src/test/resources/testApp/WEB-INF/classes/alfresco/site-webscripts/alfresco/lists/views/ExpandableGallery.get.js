model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true,
               warn: true,
               error: true
            }
         }
      },
      "alfresco/services/DocumentService"
   ],
   widgets: [
      {
         id: "TOOLBAR",
         name: "alfresco/documentlibrary/AlfToolbar"
      },
      {
         id: "DOCLIST",
         name: "alfresco/documentlibrary/AlfDocumentList",
         config: {
            useHash: false,
            additionalControlsTarget: "TOOLBAR",
            currentPageSize:40,
            widgets: [
               {
                  name: "alfresco/documentlibrary/views/AlfGalleryView",
                  config: {
                     columns: 10,
                     enableHighlighting: true,
                     itemKeyProperty: "nodeRef",
                     expandTopics: ["EXPAND"],
                     widgets: [
                        {
                           id: "CELL_CONTAINER",
                           name: "alfresco/lists/views/layouts/CellContainer",
                           config: {
                              publishTopic: "EXPAND",
                              publishPayload: {
                                 widgets: [
                                    {
                                       name: "alfresco/forms/Form",
                                       config: {
                                          showOkButton: true,
                                          okButtonPublishTopic: "POST",
                                          okButtonLabel: "Update",
                                          showCancelButton: false,
                                          value: "{node}",
                                          widgets: [
                                             {
                                                name: "alfresco/forms/controls/TextBox",
                                                config: {
                                                   label: "Name",
                                                   name: "properties.cm:name"
                                                }
                                             },
                                             {
                                                name: "alfresco/forms/controls/TextBox",
                                                config: {
                                                   label: "Title",
                                                   name: "properties.cm:title"
                                                }
                                             },
                                             {
                                                name: "alfresco/forms/controls/TextArea",
                                                config: {
                                                   label: "Description",
                                                   name: "properties.cm:description"
                                                }
                                             }
                                          ]
                                       }
                                    }
                                 ]
                              },
                              publishPayloadType: "PROCESS",
                              publishPayloadModifiers: ["processCurrentItemTokens"],
                              publishPayloadItemMixin: true,
                              widgets: [
                                 {
                                    id: "EXPAND_LINK",
                                    name: "alfresco/renderers/PropertyLink",
                                    config: {
                                       label: "Alternative",
                                       publishTopic: "EXPAND",
                                       publishPayloadType: "PROCESS",
                                       publishPayloadModifiers: ["processCurrentItemTokens"],
                                       useCurrentItemAsPayload: false,
                                       publishPayload: {
                                          nodeRef: "{nodeRef}",
                                          widgets: [
                                             {
                                                id: "EXPANDED_LIST",
                                                name: "alfresco/lists/AlfList",
                                                config: {
                                                   currentData: {
                                                      items: [
                                                         {
                                                            name: "{displayName}"
                                                         }
                                                      ]
                                                   },
                                                   pubSubScope: "EditCaveatGroupListView",
                                                   waitForPageWidgets: false,
                                                   widgets: [
                                                      {
                                                         id: "EXPANDED_LIST_VIEW",
                                                         name: "alfresco/lists/views/AlfListView",
                                                         config: {
                                                            additionalCssClasses: "bordered",
                                                            widgets: [
                                                               {
                                                                  name: "alfresco/lists/views/layouts/Row",
                                                                  config: {
                                                                     widgets: [
                                                                        {
                                                                           name: "alfresco/lists/views/layouts/Cell",
                                                                           config: {
                                                                              widgets: [
                                                                                 {
                                                                                    id: "EXPANDED_LIST_INLINE_EDIT",
                                                                                    name: "alfresco/renderers/InlineEditProperty",
                                                                                    config: {
                                                                                       propertyToRender: "name",
                                                                                       postParam: "fake",
                                                                                       publishTopic: "ALT_INLINE_EDIT_SAVE",
                                                                                       publishPayloadType: "PROCESS",
                                                                                       publishPayloadModifiers: ["processCurrentItemTokens"],
                                                                                       publishPayloadItemMixin: true,
                                                                                       publishPayload: {
                                                                                          data: "{name}"
                                                                                       },
                                                                                       publishGlobal: true
                                                                                    }
                                                                                 }
                                                                              ]
                                                                           }
                                                                        }
                                                                     ]
                                                                  }
                                                               }
                                                            ],
                                                            widgetsForAppendix: [
                                                               {
                                                                  name: "alfresco/lists/views/layouts/Row",
                                                                  config: {
                                                                     widgets: [
                                                                        {
                                                                           name: "alfresco/lists/views/layouts/Cell",
                                                                           config: {
                                                                              colspan: 2,
                                                                              widgets: [
                                                                                 {
                                                                                    id: "APPENDIX_FORM",
                                                                                    name: "alfresco/forms/Form",
                                                                                    config: {
                                                                                       okButtonPublishTopic: "SAVE",
                                                                                       scopeFormControls: false,
                                                                                       widgets: [
                                                                                          {
                                                                                             id: "APPENDIX_TEXTBOX",
                                                                                             name: "alfresco/forms/controls/TextBox",
                                                                                             config: {
                                                                                                fieldId: "APPENDIX_TEXTBOX",
                                                                                                name: "test",
                                                                                                value: ""
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
                                                   ]
                                                }
                                             }
                                          ]
                                       }
                                    }
                                 },
                                 {
                                    id: "PROPERTY",
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "node.properties.cm:name"
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
         name: "alfresco/testing/NodesMockXhr",
         config: {
            totalItems: 40,
            folderRatio: [100]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};