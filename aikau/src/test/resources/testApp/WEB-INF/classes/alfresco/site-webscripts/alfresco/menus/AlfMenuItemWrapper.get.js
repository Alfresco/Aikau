model.jsonModel = {
   services: [
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/menus/AlfMenuBar",
         config: {
            widgets: [
               {
                  name: "alfresco/menus/AlfMenuBarPopup",
                  config: {
                     id: "DROP_DOWN",
                     label: "Menu Item Wrappers",
                     widgets: [
                        {
                           name: "alfresco/menus/AlfMenuGroup",
                           config: {
                              id: "GROUP",
                              widgets: [
                                 {
                                    name: "alfresco/buttons/AlfButton",
                                    config: {
                                       id: "BUTTON1",
                                       label: "Button 1",
                                       publishTopic: "CLICKED_BUTTON_1"
                                    }
                                 },
                                 {
                                    name: "alfresco/logo/Logo",
                                    config: {
                                       id: "LOGO"
                                    }
                                 },
                                 {
                                    name: "alfresco/buttons/AlfButton",
                                    config: {
                                       id: "BUTTON2",
                                       label: "Button 2",
                                       publishTopic: "CLICKED_BUTTON_2"
                                    }
                                 },
                                 {
                                    name: "alfresco/menus/AlfMenuItemWrapper"
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
}
;