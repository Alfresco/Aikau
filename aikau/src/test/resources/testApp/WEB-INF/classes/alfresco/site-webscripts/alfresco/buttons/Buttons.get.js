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
                           config: {
                              label: "Default",
                              publishTopic: "BUTTON_TOPIC",
                              publishPayload: {
                                 foo: "bar"
                              }
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
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