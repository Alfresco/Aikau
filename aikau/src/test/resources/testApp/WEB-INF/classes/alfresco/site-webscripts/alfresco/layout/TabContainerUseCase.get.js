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
         name: "alfresco/layout/AlfTabContainer",
         config: {
            height: "500px",
            tabSelectionTopic: "TABCONTAINER_SELECT_TAB_TOPIC",
            tabDisablementTopic: "TABCONTAINER_DISABLE_TAB_TOPIC",
            tabAdditionTopic: "TABCONTAINER_ADD_TAB_TOPIC",
            tabDeletionTopic: "TABCONTAINER_DELETE_TAB_TOPIC",
            widgets: [
               {
                  id: "LIST_TAB",
                  name: "alfresco/layout/VerticalWidgets",
                  title: "Documents",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/lists/AlfList",
                           config: {
                              currentData: {
                                 items: [
                                    {
                                       name: "One"
                                    },
                                    {
                                       name: "Two"
                                    },
                                    {
                                       name: "Three"
                                    }
                                 ]
                              },
                              widgets: [
                                 {
                                    name: "alfresco/lists/views/AlfListView",
                                    config: {
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
                                                               name: "alfresco/renderers/PropertyLink",
                                                               config: {
                                                                  propertyToRender: "name",
                                                                  useCurrentItemAsPayload: false,
                                                                  publishTopic: "TABCONTAINER_ADD_TAB_TOPIC",
                                                                  publishPayloadType: "PROCESS",
                                                                  publishPayloadModifiers: ["processCurrentItemTokens"],
                                                                  publishPayload: {
                                                                     widgets: [
                                                                        {
                                                                           name: "alfresco/html/Label",
                                                                           title: "{name}",
                                                                           closable: true,
                                                                           selected: true,
                                                                           config: {
                                                                              label: "{name}"
                                                                           }
                                                                        }
                                                                     ]
                                                                  }
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
         name: "alfresco/logging/DebugLog"
      }
   ]
};