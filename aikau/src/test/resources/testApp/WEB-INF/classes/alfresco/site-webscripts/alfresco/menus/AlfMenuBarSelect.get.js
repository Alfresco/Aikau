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
                  name: "alfresco/menus/AlfMenuBarSelect",
                  config: {
                     id: "MENU_BAR_SELECT",
                     label: "Select (label)...",
                     selectionTopic: "MENU_BAR_SELECT",
                     widgets: [
                        {
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              id: "SELECT_MENU_ITEM_1",
                              label: "Option 1",
                              publishTopic: "MENU_BAR_SELECT",
                              publishPayload: {
                                 label: "Option 1 Selected"
                              }
                           }
                        },
                        {
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              id: "SELECT_MENU_ITEM_2",
                              label: "Option 2",
                              publishTopic: "MENU_BAR_SELECT",
                              publishPayload: {
                                 label: "Option 2 Selected"
                              }
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/menus/AlfMenuBarSelect",
                  config: {
                     id: "MENU_BAR_SELECT_VALUE",
                     label: "Select (value)...",
                     selectionTopic: "MENU_BAR_SELECT_VALUE",
                     widgets: [
                        {
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              id: "SELECT_MENU_ITEM_3",
                              label: "Value = Alpha",
                              publishTopic: "MENU_BAR_SELECT_VALUE",
                              publishPayload: {
                                 value: "Alpha"
                              }
                           }
                        },
                        {
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              id: "SELECT_MENU_ITEM_4",
                              label: "Value = Beta",
                              publishTopic: "MENU_BAR_SELECT_VALUE",
                              publishPayload: {
                                 value: "Beta"
                              }
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/menus/AlfMenuBarSelect",
                  config: {
                     id: "MENU_BAR_SELECT_WITH_ICON",
                     label: "Select (show icon)...",
                     updateIconOnSelection: true,
                     selectionTopic: "MENU_BAR_SELECT_WITH_ICONS",
                     widgets: [
                        {
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              id: "SELECT_MENU_ITEM_5",
                              iconClass: "alf-textdoc-icon",
                              publishTopic: "MENU_BAR_SELECT_WITH_ICONS",
                              publishPayload: {
                                 iconClass: "alf-textdoc-icon"
                              }
                           }
                        },
                        {
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              id: "SELECT_MENU_ITEM_6",
                              iconClass: "alf-htmldoc-icon",
                              publishTopic: "MENU_BAR_SELECT_WITH_ICONS",
                              publishPayload: {
                                 iconClass: "alf-textdoc-icon"
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
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "SET_WITH_LABEL",
            label: "Set With Label",
            publishTopic: "MENU_BAR_SELECT",
            publishPayload: {
               label: "Alternative Label"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "SET_WITH_VALUE",
            label: "Set With Value",
            publishTopic: "MENU_BAR_SELECT_VALUE",
            publishPayload: {
               label: "Alternative Value"
            }
         }
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
}
;