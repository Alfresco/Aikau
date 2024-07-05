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
                                    id: "SELECT_ALL",
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       label: "All",
                                       publishTopic: "MENU_BAR_SELECT_ITEMS",
                                       publishPayload: {
                                          label: "Select All",
                                          value: "selectAll"
                                       }
                                    }
                                 },
                                 {
                                    id: "SELECT_ALL_BY_ITEMS",
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       label: "All (by items)",
                                       publishTopic: "MENU_BAR_SELECT_ITEMS",
                                       publishPayload: {
                                          availableItemCount: "2",
                                          selectedItemCount: "2"
                                       }
                                    }
                                 },
                                 {
                                    id: "SELECT_SOME_BY_ITEMS",
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       label: "Some (by items)",
                                       publishTopic: "MENU_BAR_SELECT_ITEMS",
                                       publishPayload: {
                                          availableItemCount: "2",
                                          selectedItemCount: "1"
                                       }
                                    }
                                 },
                                 {
                                    id: "SELECT_NONE_BY_ITEMS",
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       label: "None (by items)",
                                       publishTopic: "MENU_BAR_SELECT_ITEMS",
                                       publishPayload: {
                                          availableItemCount: "2",
                                          selectedItemCount: "0"
                                       }
                                    }
                                 },
                                 {
                                    id: "SELECT_NONE",
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
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
         name: "alfresco/logging/DebugLog"
      }
   ]
};