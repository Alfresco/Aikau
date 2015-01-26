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
                  name: "alfresco/menus/AlfMenuBarSelectItems",
                  config: {
                     id: "MENU_BAR_SELECT_ITEMS",
                     label: "Select Items",
                     notificationTopic: "ITEMS_SELECTED",
                     selectionTopic: "MENU_BAR_SELECT_ITEMS",
                     widgets: [
                        {
                           name: "alfresco/menus/AlfMenuGroup",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       id: "SELECT_ALL",
                                       label: "All",
                                       publishTopic: "MENU_BAR_SELECT_ITEMS",
                                       publishPayload: {
                                          label: "Select All",
                                          value: "selectAll"
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       id: "SELECT_ALL_BY_ITEMS",
                                       label: "All (by items)",
                                       publishTopic: "MENU_BAR_SELECT_ITEMS",
                                       publishPayload: {
                                          availableItemCount: "2",
                                          selectedItemCount: "2"
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       id: "SELECT_SOME_BY_ITEMS",
                                       label: "Some (by items)",
                                       publishTopic: "MENU_BAR_SELECT_ITEMS",
                                       publishPayload: {
                                          availableItemCount: "2",
                                          selectedItemCount: "1"
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       id: "SELECT_NONE_BY_ITEMS",
                                       label: "None (by items)",
                                       publishTopic: "MENU_BAR_SELECT_ITEMS",
                                       publishPayload: {
                                          availableItemCount: "2",
                                          selectedItemCount: "0"
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       id: "SELECT_NONE",
                                       label: "None",
                                       publishTopic: "MENU_BAR_SELECT_ITEMS",
                                       publishPayload: {
                                          label: "Select None",
                                          value: "selectNone"
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
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
}
;