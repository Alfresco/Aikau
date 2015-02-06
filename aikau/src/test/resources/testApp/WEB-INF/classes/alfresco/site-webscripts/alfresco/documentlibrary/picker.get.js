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
      "alfresco/services/DocumentService",
      "alfresco/services/SearchService",
      "alfresco/services/ActionService",
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         name: "alfresco/forms/Form",
         config: {
            okButtonLabel: "Search...",
            okButtonPublishTopic: "ALF_SEARCH_REQUEST",
            okButtonPublishGlobal: true,
            showCancelButton: false,
            widgets: [
               {
                  name: "alfresco/forms/controls/DojoValidationTextBox",
                  config: {
                     label: "Search",
                     name: "term"
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/search/AlfSearchList",
         config: {
            widgets: [
               {
                  name: "alfresco/lists/views/AlfListView",
                  config: {
                     widgets: [
                        {
                           name:  "alfresco/lists/views/layouts/XhrLayout",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       width: "20px",
                                       widgets: [
                                       ]
                                    }
                                 },
                                 {
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       width: "100px",
                                       widgets: [
                                          {
                                             name: "alfresco/renderers/Thumbnail"
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "displayName"
                                             }
                                          }
                                       ]
                                    }
                                 }
                              ],
                              widgetsForXhrData: [
                                 {
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       width: "20px",
                                       widgets: [
                                          {
                                             name: "alfresco/renderers/Indicators"
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       width: "100px",
                                       widgets: [
                                          {
                                             name: "alfresco/renderers/Thumbnail"
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             name: "alfresco/lists/views/layouts/Column",
                                             config: {
                                                widgets: [
                                                   {
                                                      name: "alfresco/lists/views/layouts/Cell",
                                                      config: {
                                                         widgets: [
                                                            {
                                                               name: "alfresco/renderers/InlineEditProperty",
                                                               config: {
                                                                  propertyToRender: "node.properties.cm:name",
                                                                  postParam: "prop_cm_name",
                                                                  renderSize: "large",
                                                                  renderAsLink: true
                                                               }
                                                            },
                                                            {
                                                               name: "alfresco/renderers/InlineEditProperty",
                                                               config: {
                                                                  propertyToRender: "node.properties.cm:title",
                                                                  postParam: "prop_cm_title",
                                                                  renderedValuePrefix: "(",
                                                                  renderedValueSuffix: ")",
                                                                  renderFilter: [
                                                                     {
                                                                        property: "node.properties.cm:title",
                                                                        values: [
                                                                           ""
                                                                        ],
                                                                        negate: true
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
                                                               name: "alfresco/renderers/Date"
                                                            },
                                                            {
                                                               name: "alfresco/renderers/Size"
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
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             name: "alfresco/renderers/Actions"
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
}

;