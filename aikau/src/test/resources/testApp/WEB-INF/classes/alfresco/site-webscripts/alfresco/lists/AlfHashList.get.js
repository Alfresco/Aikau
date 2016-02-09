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
      "alfresco/services/NavigationService",
      "aikauTesting/mockservices/ListMockService"
   ],
   widgets: [
      {
         id: "SET_HASH1",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set hash (shouldn't trigger load - no update vars)",
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
            label: "Set hash (shouldn't trigger load - missing required var)",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            publishPayload: {
               url: "var1=test1&var3=test3",
               type: "HASH"
            }
         }
      },
      {
         id: "SET_HASH3",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set hash (shouldn't trigger load - var3 not equal to required value)",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            publishPayload: {
               url: "var1=test1&var2=test2&var3=pickle",
               type: "HASH"
            }
         }
      },
      {
         id: "SET_HASH4",
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
         name: "alfresco/html/Heading",
         config: {
            label: "For alignment"
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
            hashVarsForUpdateRequired: [
               "var1",
               "var2"
            ],
            hashVarsForUpdateMustEqual: [
               {
                  name: "var3",
                  value: "test3"
               }
            ],
            mapHashVarsToPayload: true,
            widgets: [
               {
                  name: "alfresco/lists/views/AlfListView",
                  config: {
                     additionalCssClasses: "bordered",
                     noItemsMessage: "No results",
                     widgetsForHeader: [
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              id: "COLUMN1_HEADER",
                              label: "Header"
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              id: "COLUMN1_HEADER",
                              label: "Header"
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              id: "COLUMN1_HEADER",
                              label: "Header"
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              id: "COLUMN1_HEADER",
                              label: "Header"
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              id: "COLUMN1_HEADER",
                              label: "Header"
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              id: "COLUMN1_HEADER",
                              label: "Header"
                           }
                        }
                     ],
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
         name: "aikauTesting/mockservices/ListMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};