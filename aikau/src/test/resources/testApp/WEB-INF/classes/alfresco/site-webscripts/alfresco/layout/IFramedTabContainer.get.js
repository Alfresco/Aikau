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
         id: "HIDE_IFRAME",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Hide IFrame",
            publishTopic: "IFRAME",
            publishPayload: {
               value: "HIDE"
            }
         }
      },
      {
         id: "SHOW_IFRAME",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show IFrame",
            publishTopic: "IFRAME",
            publishPayload: {
               value: "SHOW"
            }
         }
      },
      {
         id: "IFRAME",
         name: "alfresco/integration/IFrame",
         config: {
            // src: "tp/ws/Buttons",
            src: "tp/ws/AlfTabContainer",
            srcType: "PAGE_RELATIVE",
            width: 550,
            height: 200,
            visibilityConfig: {
               initialValue: false,
               rules: [
                  {
                     topic: "IFRAME",
                     attribute: "value",
                     isNot: ["HIDE"]
                  }
               ]
            }
         }
      },
      // {
      //    name: "alfresco/layout/VerticalWidgets",
      //    config: {
      //       widgets: [
      //          {
      //             name: "alfresco/layout/AlfTabContainer",
      //             config: {
      //                height: "100%",
      //                tabSelectionTopic: "TABCONTAINER_SELECT_TAB_TOPIC",
      //                tabDisablementTopic: "TABCONTAINER_DISABLE_TAB_TOPIC",
      //                tabAdditionTopic: "TABCONTAINER_ADD_TAB_TOPIC",
      //                tabDeletionTopic: "TABCONTAINER_DELETE_TAB_TOPIC",
      //                widgets: [
      //                   {
      //                      id: "LIST_TAB",
      //                      name: "alfresco/layout/VerticalWidgets",
      //                      title: "Documents",
      //                      config: {
      //                         widgets: [
      //                            {
      //                               name: "alfresco/lists/AlfList",
      //                               config: {
      //                                  currentData: {
      //                                     items: [
      //                                        {
      //                                           name: "One"
      //                                        },
      //                                        {
      //                                           name: "Two"
      //                                        },
      //                                        {
      //                                           name: "Three"
      //                                        }
      //                                     ]
      //                                  },
      //                                  widgets: [
      //                                     {
      //                                        name: "alfresco/lists/views/AlfListView",
      //                                        config: {
      //                                           widgets: [
      //                                              {
      //                                                 name: "alfresco/lists/views/layouts/Row",
      //                                                 config: {
      //                                                    widgets: [
      //                                                       {
      //                                                          name: "alfresco/lists/views/layouts/Cell",
      //                                                          config: {
      //                                                             widgets: [
      //                                                                {
      //                                                                   name: "alfresco/renderers/PropertyLink",
      //                                                                   config: {
      //                                                                      propertyToRender: "name",
      //                                                                      useCurrentItemAsPayload: false,
      //                                                                      publishTopic: "TABCONTAINER_ADD_TAB_TOPIC",
      //                                                                      publishPayloadType: "PROCESS",
      //                                                                      publishPayloadModifiers: ["processCurrentItemTokens"],
      //                                                                      publishPayload: {
      //                                                                         widgets: [
      //                                                                            {
      //                                                                               name: "alfresco/layout/VerticalWidgets",
      //                                                                               title: "{name}",
      //                                                                               closable: true,
      //                                                                               selected: true,
      //                                                                               config: {
      //                                                                                  widgets: [
      //                                                                                     {
      //                                                                                        name: "alfresco/html/Label",
      //                                                                                        config: {
      //                                                                                           label: "{name}"
      //                                                                                        }
      //                                                                                     },
      //                                                                                     {
      //                                                                                        id: "SELECT_FOR_{name}",
      //                                                                                        name: "alfresco/forms/controls/Select",
      //                                                                                        config: {
      //                                                                                           fieldId: "SELECT",
      //                                                                                           name: "select",
      //                                                                                           label: "Select...",
      //                                                                                           value: "{name}",
      //                                                                                           description: "An example select form control",
      //                                                                                           optionsConfig: {
      //                                                                                              fixed: [
      //                                                                                                 {label: "One", value: "One"},
      //                                                                                                 {label: "Two", value: "Two"},
      //                                                                                                 {label: "Three", value: "Three"}
      //                                                                                              ]
      //                                                                                           }
      //                                                                                        }
      //                                                                                     }
      //                                                                                  ]
      //                                                                               }
      //                                                                            }
      //                                                                         ]
      //                                                                      }
      //                                                                   }
      //                                                                }
      //                                                             ]
      //                                                          }
      //                                                       }
      //                                                    ]
      //                                                 }
      //                                              }
      //                                           ]
      //                                        }
      //                                     }
      //                                  ]
      //                               }
      //                            }
      //                         ]
      //                      }
      //                   }
      //                ]
      //             }
      //          }
      //       ],
      //       visibilityConfig: {
      //          initialValue: false,
      //          rules: [
      //             {
      //                topic: "IFRAME",
      //                attribute: "value",
      //                isNot: ["HIDE"]
      //             }
      //          ]
      //       }
      //    }
      // },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};