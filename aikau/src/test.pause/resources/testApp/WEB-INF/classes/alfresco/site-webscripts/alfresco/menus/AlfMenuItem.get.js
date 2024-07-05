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
         id: "MENU_BAR",
         name: "alfresco/menus/AlfMenuBar",
         config: {
            widgets: [
               {
                  id: "MENU_BAR_POPUP",
                  name: "alfresco/menus/AlfMenuBarPopup",
                  config: {
                     label: "Drop down menu",
                     title: "menu.item.label",
                     widgets: [
                        {
                           id: "PROCESS_PAYLOAD_MENU_ITEM",
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              currentItem: {
                                 some: {
                                    data: "test"
                                 }
                              },
                              label: "Processed Payload",
                              title: "menu.item.label",
                              publishTopic: "PROCESSED_PAYLOAD",
                              publishPayloadType: "PROCESS",
                              publishPayloadModifiers: ["processCurrentItemTokens"],
                              publishPayload: {
                                 value: "{some.data}"
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
         name: "alfresco/logging/DebugLog"
      }
   ]
};