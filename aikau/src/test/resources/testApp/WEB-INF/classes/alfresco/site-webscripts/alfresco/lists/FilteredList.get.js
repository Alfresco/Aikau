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
      "aikauTesting/mockservices/FilteredListMockService"
   ],
   widgets: [
      {
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  id: "SEPARATE",
                  name: "alfresco/layout/TitleDescriptionAndContent",
                  config: {
                     title: "Separate Widgets",
                     description: "This shows separate form control and list widgets configured to work together",
                     widgets: [
                        {
                           id: "TEXTBOX",
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              fieldId: "FILTER",
                              name: "name",
                              placeHolder: "Filter by name",
                              label: "Filter results",
                              description: "Enter a value that the name must contain"
                           }
                        },
                        {
                           id: "LIST",
                           name: "alfresco/lists/AlfList",
                           config: {
                              filteringTopics: ["_valueChangeOf_FILTER"],
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
                        }
                     ]
                  }
               },
               {
                  id: "COMPOSITE",
                  name: "alfresco/layout/TitleDescriptionAndContent",
                  config: {
                     title: "Composite widgets",
                     description: "This a single configured AlfFilteredList widget",
                     widgets: [
                        {
                           name: "alfresco/lists/AlfFilteredList",
                           config: {
                              pubSubScope: "COMPOSITE_",
                              filteringTopics: ["_valueChangeOf_FILTER"],
                              widgetsForFilters: [
                                 {
                                    id: "COMPOSITE_TEXTBOX",
                                    name: "alfresco/forms/controls/TextBox",
                                    config: {
                                       fieldId: "TEXTBOX_FILTER",
                                       name: "name",
                                       placeHolder: "Filter by name",
                                       label: "Name filter"
                                    }
                                 },
                                 {
                                    id: "COMPOSITE_DROPDOWN",
                                    name: "alfresco/forms/controls/FilteringSelect",
                                    config: {
                                       fieldId: "DROPDOWN_FILTER",
                                       name: "description",
                                       label: "Description filter",
                                       optionsConfig: {
                                          fixed: [
                                             {
                                                label: "",
                                                value: ""
                                             },
                                             {
                                                label: "moo",
                                                value: "moo"
                                             },
                                             {
                                                label: "woof",
                                                value: "woof"
                                             }
                                          ],
                                          queryAttribute: "label",
                                          labelAttribute: "label",
                                          valueAttribute: "value"
                                       }
                                    }
                                 }
                              ],
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
                                                   },
                                                   {
                                                      name: "alfresco/lists/views/layouts/Cell",
                                                      config: {
                                                         additionalCssClasses: "mediumpad",
                                                         widgets: [
                                                            {
                                                               name: "alfresco/renderers/Property",
                                                               config: {
                                                                  propertyToRender: "description"
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
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};