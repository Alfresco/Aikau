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
         name: "alfresco/layout/VerticalWidgets",
         config: {
            widgetMarginBottom: 30,
            widgets: [
               {
                  name: "alfresco/layout/HorizontalWidgets",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/buttons/AlfButton",
                           id: "DEFAULT_BUTTON",
                           config: {
                              label: "Default",
                              title: "Custom title",
                              publishTopic: "BUTTON_TOPIC",
                              publishPayload: {
                                 foo: "bar"
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           id: "DEFAULT_BUTTON_HOVER",
                           config: {
                              additionalCssClasses: "dijitButtonHover",
                              label: "Hover",
                              publishTopic: "BUTTON_TOPIC",
                              publishPayload: {
                                 foo: "bar"
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           id: "DEFAULT_BUTTON_ACTIVE",
                           config: {
                              additionalCssClasses: "dijitButtonActive",
                              label: "Pressed",
                              publishTopic: "BUTTON_TOPIC",
                              publishPayload: {
                                 foo: "bar"
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           id: "DEFAULT_BUTTON_DISABLED",
                           config: {
                              label: "Disabled",
                              disabled: true,
                              publishTopic: "BUTTON_TOPIC",
                              publishPayload: {
                                 foo: "bar"
                              }
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/layout/HorizontalWidgets",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/buttons/AlfButton",
                           id: "CALL_TO_ACTION_BUTTON",
                           config: {
                              additionalCssClasses: "call-to-action",
                              label: "Default",
                              publishTopic: "BUTTON_TOPIC",
                              publishPayload: {
                                 foo: "bar"
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           id: "CALL_TO_ACTION_BUTTON_HOVER",
                           config: {
                              additionalCssClasses: "call-to-action dijitButtonHover",
                              label: "Hover",
                              publishTopic: "BUTTON_TOPIC",
                              publishPayload: {
                                 foo: "bar"
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           id: "CALL_TO_ACTION_BUTTON_ACTIVE",
                           config: {
                              additionalCssClasses: "call-to-action dijitButtonActive",
                              label: "Pressed",
                              publishTopic: "BUTTON_TOPIC",
                              publishPayload: {
                                 foo: "bar"
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           id: "CALL_TO_ACTION_BUTTON_DISABLED",
                           config: {
                              additionalCssClasses: "call-to-action",
                              label: "Disabled",
                              disabled: true,
                              publishTopic: "BUTTON_TOPIC",
                              publishPayload: {
                                 foo: "bar"
                              }
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/layout/HorizontalWidgets",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/buttons/AlfButton",
                           id: "PRIMARY_CALL_TO_ACTION_BUTTON",
                           config: {
                              additionalCssClasses: "primary-call-to-action",
                              label: "Default",
                              publishTopic: "BUTTON_TOPIC",
                              publishPayload: {
                                 foo: "bar"
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           id: "PRIMARY_CALL_TO_ACTION_BUTTON_HOVER",
                           config: {
                              additionalCssClasses: "primary-call-to-action dijitButtonHover",
                              label: "Hover",
                              publishTopic: "BUTTON_TOPIC",
                              publishPayload: {
                                 foo: "bar"
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           id: "PRIMARY_CALL_TO_ACTION_BUTTON_ACTIVE",
                           config: {
                              additionalCssClasses: "primary-call-to-action dijitButtonActive",
                              label: "Pressed",
                              publishTopic: "BUTTON_TOPIC",
                              publishPayload: {
                                 foo: "bar"
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           id: "PRIMARY_CALL_TO_ACTION_BUTTON_DISABLED",
                           config: {
                              additionalCssClasses: "primary-call-to-action",
                              label: "Disabled",
                              disabled: true,
                              publishTopic: "BUTTON_TOPIC",
                              publishPayload: {
                                 foo: "bar"
                              }
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/forms/SingleTextFieldForm",
                  config: {
                     okButtonLabel: "Search",
                     okButtonIconClass: "alf-white-search-icon",
                     okButtonClass: "call-to-action",
                     textFieldName: "search",
                     textBoxIconClass: "alf-search-icon"
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