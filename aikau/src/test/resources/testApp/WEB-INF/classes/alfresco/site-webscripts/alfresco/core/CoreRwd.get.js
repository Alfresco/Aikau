model.jsonModel = {
   services: [
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/menus/AlfMenuBar",
         align: "left",
         config: {
            id: "MENU_BAR",
            widgets: [
               {
                  name: "alfresco/menus/AlfMenuBarPopup",
                  config: {
                     id: "DROP_DOWN_MENU_1",
                     label: "Drop Down 1",
                     minRwdWidth: 800,
                     maxRwdWidth: 5000,
                     widgets: [
                        {
                           name: "alfresco/menus/AlfMenuGroup",
                           config: {
                              id: "DROP_DOWN_1_GROUP_1",
                              label: "Drop Down Group",
                              widgets: [
                                 {
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       id: "MENU_ITEM_1",
                                       label: "Menu Item 1"
                                    }
                                 },
                                 {
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       id: "MENU_ITEM_2",
                                       label: "Menu Item 2"
                                    }
                                 }
                              ]
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/menus/AlfMenuBarPopup",
                  config: {
                     id: "DROP_DOWN_MENU_2",
                     label: "Drop Down 2",
                     minRwdWidth: 800,
                     widgets: []
                  }
               },
               {
                  name: "alfresco/menus/AlfMenuBarPopup",
                  config: {
                     id: "DROP_DOWN_MENU_3",
                     label: "Drop Down 3",
                     maxRwdWidth: 5000,
                     widgets: []
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