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
   widgets:[
      {
         name: "alfresco/layout/DynamicGrid",
         config: {
            widgets: [
               {
                  gridWidth: 3,
                  gridHeight: 4,
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Dashlet 1",
                     widgets: [
                        {
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Button"
                           }
                        }
                     ]
                  }
               },
               {
                  gridWidth: 5,
                  gridHeight: 2,
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Dashlet 2",
                     widgets: [
                        {
                           name: "alfresco/logo/Logo"
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Dashlet 3",
                     widgets: [
                        {
                           name: "alfresco/menus/AlfMenuBar",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/menus/AlfMenuBarItem",
                                    config: {
                                       label: "Menu Item"
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