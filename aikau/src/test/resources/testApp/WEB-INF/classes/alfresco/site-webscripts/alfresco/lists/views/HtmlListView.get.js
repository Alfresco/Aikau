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
   widgets: [
      {
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Defaults",
                     widgets: [
                        {
                           id: "DEFAULTS",
                           name: "alfresco/lists/AlfList",
                           config: {
                              currentData: {
                                 items: [
                                    {
                                       name: "one",
                                       displayName: "bob"
                                    },
                                    {
                                       name: "two",
                                       displayName: "ted"
                                    },
                                    {
                                       name: "three",
                                       displayName: "geoff"
                                    },
                                    {
                                       name: "four",
                                       displayName: "trevor"
                                    }
                                 ]
                              },
                              widgets: [
                                 {
                                    name: "alfresco/lists/views/HtmlListView"
                                 }
                              ]
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Overrides propertyToRender and listStyleType",
                     widgets: [
                        {
                           id: "OVERRIDES",
                           name: "alfresco/lists/AlfList",
                           config: {
                              currentData: {
                                 items: [
                                    {
                                       name: "one",
                                       displayName: "bob"
                                    },
                                    {
                                       name: "two",
                                       displayName: "ted"
                                    },
                                    {
                                       name: "three",
                                       displayName: "geoff"
                                    },
                                    {
                                       name: "four",
                                       displayName: "trevor"
                                    }
                                 ]
                              },
                              widgets: [
                                 {
                                    name: "alfresco/lists/views/HtmlListView",
                                    config: {
                                       listStyleType: "square",
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
};