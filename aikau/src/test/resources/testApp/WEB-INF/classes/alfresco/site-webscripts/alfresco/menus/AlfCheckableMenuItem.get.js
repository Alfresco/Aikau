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
                     id: "CHECKABLE_MENU_ITEMS_DROPDOWN",
                     label: "Checkable Menu Items",
                     widgets: [
                        {
                           name: "alfresco/menus/AlfMenuGroup",
                           config: {
                              id: "BASIC_CHECKABLE_ITEM_GROUP",
                              label: "Individual",
                              widgets: [
                                 {
                                    name: "alfresco/menus/AlfCheckableMenuItem",
                                    config: {
                                       id: "CHECKABLE_1",
                                       label: "Checkable (no payload)",
                                       value: "OP1",
                                       publishTopic: "CHECKABLE_1"
                                    }
                                 },
                                 {
                                    name: "alfresco/menus/AlfCheckableMenuItem",
                                    config: {
                                       id: "CHECKABLE_2",
                                       label: "Checkable (additional payload)",
                                       value: "OP2",
                                       checked: true,
                                       publishTopic: "CHECKABLE_2",
                                       publishPayload: {
                                          clicked: "CHECKABLE_2"
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/menus/AlfCheckableMenuItem",
                                    config: {
                                       id: "CHECKABLE_3",
                                       label: "Checkable (no topic)",
                                       value: "OP3"
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           name: "alfresco/menus/AlfMenuGroup",
                           config: {
                              id: "GROUPED_CHECKABLE_ITEMS",
                              label: "Grouped",
                              widgets: [
                                 {
                                    name: "alfresco/menus/AlfCheckableMenuItem",
                                    config: {
                                       id: "GROUPED_CHECKABLE_1",
                                       label: "Grouped Checkable 1",
                                       checked: true,
                                       group: "CHECKABLE_GROUP",
                                       value: "OP1",
                                       publishTopic: "GROUPED_CHECKABLE_1"
                                    }
                                 },
                                 {
                                    name: "alfresco/menus/AlfCheckableMenuItem",
                                    config: {
                                       id: "GROUPED_CHECKABLE_2",
                                       label: "Grouped Checkable 2",
                                       group: "CHECKABLE_GROUP",
                                       value: "OP2",
                                       publishTopic: "GROUPED_CHECKABLE_2"
                                    }
                                 },
                                 {
                                    name: "alfresco/menus/AlfCheckableMenuItem",
                                    config: {
                                       id: "GROUPED_CHECKABLE_3",
                                       label: "Grouped Checkable 3",
                                       group: "CHECKABLE_GROUP",
                                       value: "OP3",
                                       publishTopic: "GROUPED_CHECKABLE_3"
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
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "SET_CHECKABLE_1",
            label: "Set Checkable 1",
            publishTopic: "CHECKABLE_1",
            publishPayload: {
               value: "OP1",
               selected: "true"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "UNSET_CHECKABLE_1",
            label: "Unset Checkable 1",
            publishTopic: "CHECKABLE_1",
            publishPayload: {
               value: "OP1",
               selected: false
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "SET_GROUPED_CHECKABLE_2",
            label: "Set Grouped Checkable 2",
            publishTopic: "GROUPED_CHECKABLE_2",
            publishPayload: {
               value: "OP2",
               selected: true
            }
         }
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
}
;