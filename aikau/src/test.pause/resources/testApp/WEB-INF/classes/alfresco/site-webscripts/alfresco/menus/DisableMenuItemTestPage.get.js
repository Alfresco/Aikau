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
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     id: "MENU_BAR_ITEM_1",
                     label: "Menu Bar Item",
                     targetUrl: "MENU_BAR_ITEM_1",
                     disablementTopic: "DISABLEMENT_TOPIC",
                     selectionTopic: "LABEL_TOPIC"
                  }
               },
               {
                  name: "alfresco/menus/AlfMenuBarPopup",
                  config: {
                     id: "DROP_DOWN_MENU_1",
                     label: "Menu Bar Popup",
                     widgets: [
                        {
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              id: "MENU_ITEM_1",
                              label: "Disable Menu Bar Item",
                              publishTopic: "DISABLEMENT_TOPIC",
                              publishPayload: {
                                 value: true
                              }
                           }
                        },
                        {
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              id: "MENU_ITEM_2",
                              label: "Enable Menu Bar Item",
                              publishTopic: "DISABLEMENT_TOPIC",
                              publishPayload: {
                                 value: false
                              }
                           }
                        },
                        {
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              id: "MENU_ITEM_3",
                              label: "Disable Menu Bar Item - bad payload",
                              publishTopic: "DISABLEMENT_TOPIC",
                              publishPayload: {
                                 value: "lolcats"
                              }
                           }
                        },
                        {
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              id: "MENU_ITEM_4",
                              label: "Disable Menu Bar Item - bad TOPIC",
                              publishTopic: "DISABLEMENT_TOPIC_INCORRECT",
                              publishPayload: {
                                 value: true
                              }
                           }
                        },
                        {
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              id: "MENU_ITEM_5",
                              label: "Disable Menu Bar Item - no payload",
                              publishTopic: "DISABLEMENT_TOPIC"
                           }
                        },
                        {
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              id: "MENU_ITEM_6",
                              label: "Relabel Menu Bar Item",
                              publishTopic: "LABEL_TOPIC",
                              publishPayload: {
                                 label: "Thingy"
                              }
                           }
                        },
                        {
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              id: "MENU_ITEM_7",
                              label: "Relabel Menu Bar Item 2",
                              publishTopic: "LABEL_TOPIC",
                              publishPayload: {
                                 value: "Wot-ya-ma-call-it"
                              }
                           }
                        },
                        {
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              id: "MENU_ITEM_8",
                              label: "Relabel Menu Bar Item 3 - faulty",
                              publishTopic: "LABEL_TOPIC",
                              publishPayload: {
                                 incorrect: "Widget"
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