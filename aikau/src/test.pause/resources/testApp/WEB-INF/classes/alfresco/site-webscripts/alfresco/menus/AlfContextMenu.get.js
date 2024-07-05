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
   widgets: [
      {
         id: "LOGO",
         name: "alfresco/logo/Logo"
      },
      {
         id: "CLASSIC_WINDOW",
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Has Context Menu",
            widgets: [
               {
                  name: "alfresco/menus/AlfContextMenu",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/menus/AlfMenuGroup",
                           config: {
                              widgets: [
                                 {
                                    id: "MI1",
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       label: "Menu Item 1",
                                       publishTopic: "TOPIC1",
                                       publishPayload: {
                                          key1: "value1"
                                       }
                                    }
                                 },
                                 {
                                    id: "MI2",
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       label: "Menu Item 2",
                                       publishTopic: "TOPIC2",
                                       publishPayload: {
                                          key2: "value2"
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
      },
      {
         name: "alfresco/menus/AlfContextMenu",
         config: {
            targetNodeIds: ["LOGO"],
            widgets: [
               {
                  name: "alfresco/menus/AlfMenuGroup",
                  config: {
                     widgets: [
                        {
                           id: "MI3",
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              label: "Menu Item 3",
                              publishTopic: "TOPIC3",
                              publishPayload: {
                                 key3: "value3"
                              }
                           }
                        },
                        {
                           id: "MI4",
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              label: "Menu Item 4",
                              publishTopic: "TOPIC4",
                              publishPayload: {
                                 key4: "value4"
                              }
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
}
;