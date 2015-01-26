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
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         name: "alfresco/documentlibrary/views/AlfDocumentListView",
         config: {
            id: "LIST_WITH_HEADER",
            currentData: {
               items: [
                  {col1: "A", col2:"B",col3:"C"},
                  {col1: "D", col2:"E",col3:"F"},
                  {col1: "G", col2:"H",col3:"I"},
                  {col1: "J", col2:"K",col3:"L"}
               ]
            },
            widgetsForHeader: [
               {
                  name: "alfresco/documentlibrary/views/layouts/HeaderCell",
                  config: {
                     id: "COLUMN1_HEADER",
                     label: "Column 1",
                     sortable: true,
                     sortValue: "col1",
                     toolTipMsg: "This is column 1"
                  }
               },
               {
                  name: "alfresco/documentlibrary/views/layouts/HeaderCell",
                  config: {
                     id: "COLUMN2_HEADER",
                     label: "Column 2",
                     sortable: true,
                     sortValue: "col2",
                     toolTipMsg: "This is column 2"
                  }
               },
               {
                  name: "alfresco/documentlibrary/views/layouts/HeaderCell",
                  config: {
                     id: "COLUMN3_HEADER",
                     label: "Column 3",
                     sortable: false
                  }
               }
            ],
            widgets:[
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
                                       propertyToRender: "col1",
                                       renderAsLink: false
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           name: "alfresco/documentlibrary/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "col2",
                                       renderAsLink: false
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           name: "alfresco/documentlibrary/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "col3",
                                       renderAsLink: false
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