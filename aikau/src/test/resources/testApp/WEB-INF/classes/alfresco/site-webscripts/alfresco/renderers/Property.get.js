/*jshint maxlen:1000*/
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
         name: "alfresco/lists/views/AlfListView",
         config: {
            id: "LIST",
            currentData: {
               items: [
                  {
                     name: "TestSök <img ='><svg onload=\"window.hacked=true\"'>"
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
         name: "alfresco/lists/views/AlfListView",
         config: {
            id: "LIST",
            currentData: {
               items: [
                  {
                     name: "TestSök <img ='><svg onload=\"window.hacked=true\"'> Lorem ipsum Magna Ut incididunt minim do sunt ut cupidatat adipisicing velit Duis ex aute laborum exercitation aute consectetur veniam nisi dolor aliquip sit non ut ut in occaecat amet occaecat quis sunt exercitation ex in minim incididunt minim non."
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
                                    id: "MAX_LENGTH",
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       maxWidth: "300px",
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
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};