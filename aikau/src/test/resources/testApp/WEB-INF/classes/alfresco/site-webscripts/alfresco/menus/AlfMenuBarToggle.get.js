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
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/menus/AlfMenuBar",
         config: {
            widgets: [
               {
                  name: "alfresco/menus/AlfMenuBarToggle",
                  config: {
                     id: "BASIC_MENU_BAR_TOGGLE",
                     subscriptionTopic: "ALF_DOCLIST_SORT_FIELD_SELECTION",
                     subscriptionAttribute: "direction",
                     checkedValue: "ascending"
                  }
               },
               {
                  name: "alfresco/menus/AlfMenuBarToggle",
                  config: {
                     id: "MENU_BAR_TOGGLE_CUSTOM_LABEL",
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
                  name: "alfresco/menus/AlfMenuBarToggle",
                  config: {
                     checked: false,
                     id: "MENU_BAR_TOGGLE_WITH_ICON",
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
               }
            ]
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "TEST_BUTTON_ASC",
            label: "Set toggle state ascending",
            publishTopic: "ALF_DOCLIST_SORT_FIELD_SELECTION",
            publishPayload: {
               direction: "ascending"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "TEST_BUTTON_DESC",
            label: "Set toggle state descending",
            publishTopic: "ALF_DOCLIST_SORT_FIELD_SELECTION",
            publishPayload: {
               direction: "descending"
            }
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