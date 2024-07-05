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
      },
      "alfresco/services/NavigationService"
   ],
   widgets: [
      {
         name: "alfresco/menus/AlfMenuBar",
         config: {
            widgets: [
               {
                  id: "BASIC_MENU_BAR_TOGGLE",
                  name: "alfresco/menus/AlfMenuBarToggle",
                  config: {
                     subscriptionTopic: "ALF_DOCLIST_SORT_FIELD_SELECTION",
                     subscriptionAttribute: "direction",
                     checkedValue: "ascending"
                  }
               },
               {
                  id: "MENU_BAR_TOGGLE_CUSTOM_LABEL",
                  name: "alfresco/menus/AlfMenuBarToggle",
                  config: {
                     checked: true,
                     subscriptionTopic: "ALF_DOCLIST_SORT_FIELD_SELECTION",
                     subscriptionAttribute: "direction",
                     checkedValue: "ascending",
                     onConfig: {
                        label: "On (Custom Label)",
                        publishTopic: "CLICK",
                        publishPayload: {
                           clicked: "TOGGLE_WITH_LABEL",
                           value: "ON"
                        }
                     },
                     offConfig: {
                        label: "Off (Custom Label)",
                        publishTopic: "CLICK",
                        publishPayload: {
                           clicked: "TOGGLE_WITH_LABEL",
                           value: "OFF"
                        }
                     }
                  }
               },
               {
                  id: "MENU_BAR_TOGGLE_WITH_ICON",
                  name: "alfresco/menus/AlfMenuBarToggle",
                  config: {
                     checked: false,
                     subscriptionTopic: "ALF_DOCLIST_SORT_FIELD_SELECTION",
                     subscriptionAttribute: "direction",
                     checkedValue: "ascending",
                     onConfig: {
                        label: "On (Custom Label)",
                        iconClass: "alf-sort-ascending-icon",
                        publishTopic: "CLICK",
                        publishPayload: {
                           clicked: "TOGGLE_WITH_ICON",
                           value: "ON"
                        }
                     },
                     offConfig: {
                        label: "Off (Custom Label)",
                        iconClass: "alf-sort-descending-icon",
                        publishTopic: "CLICK",
                        publishPayload: {
                           clicked: "TOGGLE_WITH_ICON",
                           value: "OFF"
                        }
                     }
                  }
               },
               {
                  id: "MENU_BAR_TOGGLE_USE_HASH",
                  name: "alfresco/menus/AlfMenuBarToggle",
                  config: {
                     hashName: "sortAscending",
                     checked: false,
                     subscriptionTopic: "CUSTOM",
                     subscriptionAttribute: "sortAscending",
                     checkedValue: "true",
                     onConfig: {
                        label: "Ascending",
                        iconClass: "alf-sort-ascending-icon",
                        publishTopic: "CLICK",
                        publishPayload: {
                           clicked: "TOGGLE_WITH_ICON",
                           value: "descending"
                        }
                     },
                     offConfig: {
                        label: "Descending",
                        iconClass: "alf-sort-descending-icon",
                        publishTopic: "CLICK",
                        publishPayload: {
                           clicked: "TOGGLE_WITH_ICON",
                           value: "ascending"
                        }
                     }
                  }
               }
            ]
         }
      },
      {
         id: "TEST_BUTTON_ASC",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set toggle state ascending",
            publishTopic: "ALF_DOCLIST_SORT_FIELD_SELECTION",
            publishPayload: {
               direction: "ascending"
            }
         }
      },
      {
         id: "TEST_BUTTON_DESC",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set toggle state descending",
            publishTopic: "ALF_DOCLIST_SORT_FIELD_SELECTION",
            publishPayload: {
               direction: "descending"
            }
         }
      },
      {
         id: "SET_HASH",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set Hash",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            publishPayload: {
               url: "sortAscending=false",
               type: "HASH"
            }
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};