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
   widgets:[
      {
         id: "HIDE_WIDGET_1_BUTTON",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Hide widget 1",
            publishTopic: "WIDGET_1_VISIBILITY",
            publishPayload: {
               show: false
            }
         }
      },
      {
         id: "SHOW_WIDGET_1_BUTTON",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show widget 1",
            publishTopic: "WIDGET_1_VISIBILITY",
            publishPayload: {
               show: true
            }
         }
      },
      {
         id: "HIDE_WIDGET_2_BUTTON",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Hide widget 2",
            publishTopic: "WIDGET_2_VISIBILITY",
            publishPayload: {
               show: false
            }
         }
      },
      {
         id: "SHOW_WIDGET_2_BUTTON",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show widget 2",
            publishTopic: "WIDGET_2_VISIBILITY",
            publishPayload: {
               show: true
            }
         }
      },
      {
         id: "HIDE_WIDGET_3_BUTTON",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Hide widget 3",
            publishTopic: "WIDGET_3_VISIBILITY",
            publishPayload: {
               show: false
            }
         }
      },
      {
         id: "SHOW_WIDGET_3_BUTTON",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show widget 3",
            publishTopic: "WIDGET_3_VISIBILITY",
            publishPayload: {
               show: true
            }
         }
      },
      {
         id: "HIDE_WIDGET_4_BUTTON",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Hide widget 4",
            publishTopic: "WIDGET_4_VISIBILITY",
            publishPayload: {
               show: false
            }
         }
      },
      {
         id: "SHOW_WIDGET_4_BUTTON",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show widget 4",
            publishTopic: "WIDGET_4_VISIBILITY",
            publishPayload: {
               show: true
            }
         }
      },
      {
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  id: "WIDGET_1",
                  name: "alfresco/layout/ClassicWindow",
                  widthPx: 200,
                  config: {
                     title: "Widget 1",
                     visibilityConfig: {
                       initialValue: true,
                       rules: [
                         {
                           topic: "WIDGET_1_VISIBILITY",
                           attribute: "show",
                           is: [true],
                           strict: true
                         }
                       ]
                     }
                  }
               },
               {
                  id: "WIDGET_2",
                  name: "alfresco/layout/ClassicWindow",
                  widthPc: 50,
                  config: {
                     title: "Widget 2",
                     visibilityConfig: {
                       initialValue: true,
                       rules: [
                         {
                           topic: "WIDGET_2_VISIBILITY",
                           attribute: "show",
                           is: [true],
                           strict: true
                         }
                       ]
                     }
                  }
               },
               {
                  id: "WIDGET_3",
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Widget 3",
                     visibilityConfig: {
                       initialValue: false,
                       rules: [
                         {
                           topic: "WIDGET_3_VISIBILITY",
                           attribute: "show",
                           is: [true],
                           strict: true
                         }
                       ]
                     }
                  }
               },
               {
                  id: "WIDGET_4",
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Widget 4",
                     invisibilityConfig: {
                       initialValue: true,
                       rules: [
                         {
                           topic: "WIDGET_4_VISIBILITY",
                           attribute: "show",
                           is: [false],
                           strict: true
                         }
                       ]
                     }
                  }
               },
               {
                  id: "WIDGET_5",
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Widget 5"
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