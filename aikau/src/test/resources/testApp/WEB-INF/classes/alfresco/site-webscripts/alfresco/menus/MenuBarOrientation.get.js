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
         name: "alfresco/html/Spacer",
         config: {
            height: "20px"
         }
      },
      {
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Menu opens upwards",
                     widgets: [
                        {
                           id: "MENUBAR1",
                           name: "alfresco/menus/AlfMenuBar",
                           config: {
                              popupMenusAbove: true,
                              widgets: [
                                 {
                                    id: "POPUP_MENU",
                                    name: "alfresco/menus/AlfMenuBarPopup",
                                    config: {
                                       label: "Movin' on up",
                                       widgets: [
                                          {
                                             id: "MENU_ITEM_1",
                                             name: "alfresco/menus/AlfMenuItem",
                                             config: {
                                                label: "Item 1"
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
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Menu opens downwards",
                     widgets: [
                        {
                           id: "MENUBAR2",
                           name: "alfresco/menus/AlfMenuBar",
                           config: {
                              widgets: [
                                 {
                                    id: "DROPDOWN_MENU",
                                    name: "alfresco/menus/AlfMenuBarPopup",
                                    config: {
                                       label: "Down, down, deeper and down",
                                       widgets: [
                                          {
                                             id: "MENU_ITEM_2",
                                             name: "alfresco/menus/AlfMenuItem",
                                             config: {
                                                label: "Item 2"
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