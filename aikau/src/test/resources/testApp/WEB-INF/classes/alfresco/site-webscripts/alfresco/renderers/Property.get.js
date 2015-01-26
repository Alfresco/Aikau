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
            id: "LIST",
            currentData: {
               items: [
                  {
                     name: "Test"
                  }
               ]
            },
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
                                    id: "BASIC",
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "name"
                                    }
                                 },
                                 {
                                    id: "PREFIX_SUFFIX",
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "name",
                                       renderedValuePrefix: "(",
                                       renderedValueSuffix: ")"
                                    }
                                 },
                                 {
                                    id: "NEW_LINE",
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "name",
                                       renderOnNewLine: true
                                    }
                                 },
                                 {
                                    id: "WARN1",
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "missing",
                                       warnIfNotAvailable: true
                                    }
                                 },
                                 {
                                    id: "WARN2",
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "description",
                                       warnIfNotAvailable: true
                                    }
                                 },
                                 {
                                    id: "HOVER",
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "name",
                                       onlyShowOnHover: true
                                    }
                                 },
                                 {
                                    id: "LABEL",
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       label: "Label",
                                       propertyToRender: "name"
                                    }
                                 },
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