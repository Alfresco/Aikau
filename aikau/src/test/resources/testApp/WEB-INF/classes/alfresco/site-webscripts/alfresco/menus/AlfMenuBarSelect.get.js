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
                  id: "MENU_BAR_SELECT",
                  name: "alfresco/menus/AlfMenuBarSelect",
                  config: {
                     label: "Select (label)...",
                     selectionTopic: "MENU_BAR_SELECT",
                     widgets: [
                        {
                           id: "SELECT_MENU_ITEM_1",
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              label: "Option 1",
                              publishTopic: "MENU_BAR_SELECT",
                              publishPayload: {
                                 label: "Option 1 Selected"
                              }
                           }
                        },
                        {
                           id: "SELECT_MENU_ITEM_2",
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
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
                  id: "MENU_BAR_SELECT_VALUE",
                  name: "alfresco/menus/AlfMenuBarSelect",
                  config: {
                     label: "Select (value)...",
                     selectionTopic: "MENU_BAR_SELECT_VALUE",
                     widgets: [
                        {
                           id: "SELECT_MENU_ITEM_3",
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              label: "Value = Alpha",
                              publishTopic: "MENU_BAR_SELECT_VALUE",
                              publishPayload: {
                                 value: "Alpha"
                              }
                           }
                        },
                        {
                           id: "SELECT_MENU_ITEM_4",
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
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
                  id: "MENU_BAR_SELECT_WITH_ICON",
                  name: "alfresco/menus/AlfMenuBarSelect",
                  config: {
                     label: "Select (show icon)...",
                     updateIconOnSelection: true,
                     selectionTopic: "MENU_BAR_SELECT_WITH_ICONS",
                     widgets: [
                        {
                           id: "SELECT_MENU_ITEM_5",
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              iconClass: "alf-textdoc-icon",
                              publishTopic: "MENU_BAR_SELECT_WITH_ICONS",
                              publishPayload: {
                                 iconClass: "alf-textdoc-icon"
                              }
                           }
                        },
                        {
                           id: "SELECT_MENU_ITEM_6",
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              iconClass: "alf-htmldoc-icon",
                              publishTopic: "MENU_BAR_SELECT_WITH_ICONS",
                              publishPayload: {
                                 iconClass: "alf-htmldoc-icon"
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
         id: "SET_WITH_LABEL",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set With Label",
            publishTopic: "MENU_BAR_SELECT",
            publishPayload: {
               label: "Alternative Label"
            }
         }
      },
      {
         id: "SET_WITH_VALUE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set With Value",
            publishTopic: "MENU_BAR_SELECT_VALUE",
            publishPayload: {
               label: "Alternative Value"
            }
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};