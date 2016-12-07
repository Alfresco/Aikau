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
      }
   ],
   widgets:[
      {
         name: "alfresco/lists/views/AlfListView",
         config: {
            id: "LIST_WITH_HEADER",
            currentData: {
               items: [
                  {col1: true},
                  {col1: "true"},
                  {col1: 1},
                  {col1: "1"},
                  {col1: false},
                  {col1: "false"},
                  {col1: 0},
                  {col1: "0"},
                  {col1: "whatever"},
                  {col1: null}
               ]
            },
            widgetsForHeader: [
               {
                  name: "alfresco/lists/views/layouts/HeaderCell",
                  config: {
                     id: "COLUMN1_HEADER",
                     label: "YESNO (default)"
                  }
               },
               {
                  name: "alfresco/lists/views/layouts/HeaderCell",
                  config: {
                     id: "COLUMN2_HEADER",
                     label: "TRUEFALSE"
                  }
               },
               {
                  name: "alfresco/lists/views/layouts/HeaderCell",
                  config: {
                     id: "COLUMN3_HEADER",
                     label: "IMAGE"
                  }
               },
               {
                  name: "alfresco/lists/views/layouts/HeaderCell",
                  config: {
                     id: "COLUMN4_HEADER",
                     label: "BAD TYPE"
                  }
               },
               {
                  name: "alfresco/lists/views/layouts/HeaderCell",
                  config: {
                     id: "COLUMN5_HEADER",
                     label: "MISSING DATA"
                  }
               },
               {
                  name: "alfresco/lists/views/layouts/HeaderCell",
                  config: {
                     id: "COLUMN6_HEADER",
                     label: "NO PROPERTY"
                  }
               }
            ],
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
                                    name: "alfresco/renderers/Boolean",
                                    config: {
                                       propertyToRender: "col1"
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
                                    name: "alfresco/renderers/Boolean",
                                    config: {
                                       propertyToRender: "col1",
                                       displayType: "TRUEFALSE"
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
                                    name: "alfresco/renderers/Boolean",
                                    config: {
                                       propertyToRender: "col1",
                                       displayType: "IMAGE"
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
                                    name: "alfresco/renderers/Boolean",
                                    config: {
                                       propertyToRender: "col1",
                                       displayType: "NOTVALID"
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
                                    name: "alfresco/renderers/Boolean",
                                    config: {
                                       propertyToRender: "notAValidColumn",
                                       displayType: "YESNO"
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
                                    name: "alfresco/renderers/Boolean",
                                    config: {
                                       propertyToRender: null,
                                       displayType: "YESNO"
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