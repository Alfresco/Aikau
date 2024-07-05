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
         id: "FULL_SCREEN_WIDGETS",
         name: "alfresco/layout/FullScreenWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/menus/AlfMenuBar",
                  config: {
                     widgets: [
                        {
                           id: "POPUP_MENU",
                           name: "alfresco/menus/AlfMenuBarPopup",
                           config: {
                              iconClass: "alf-configure-icon",
                              widgets: [
                                 {
                                    name: "alfresco/menus/AlfMenuGroup",
                                    config: {
                                       widgets: [
                                          {
                                             id: "FULL_WINDOW",
                                             name: "alfresco/menus/AlfCheckableMenuItem",
                                             config: {
                                                label: "Go Full Window",
                                                iconClass: "alf-fullscreen-icon",
                                                checked: false,
                                                publishTopic: "ALF_FULL_WINDOW"
                                             }
                                          },
                                          {
                                             id: "FULL_SCREEN",
                                             name: "alfresco/menus/AlfCheckableMenuItem",
                                             config: {
                                                label: "Go Full Screen",
                                                iconClass: "alf-fullscreen-icon",
                                                checked: false,
                                                publishTopic: "ALF_FULL_SCREEN"
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
                  id: "HORIZONTAL_WIDGETS",
                  name: "alfresco/layout/HorizontalWidgets",
                  config: {
                     widgets: [
                        {
                           id: "BUTTON",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Button",
                              publishTopic: "BUTTON_CLICKED",
                              publishPayload: {
                                 clicked: true
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
};