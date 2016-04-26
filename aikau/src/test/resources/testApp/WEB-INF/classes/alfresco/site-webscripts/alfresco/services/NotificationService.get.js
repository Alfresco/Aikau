/*jshint maxlen:500*/
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
      "alfresco/services/NotificationService",
      "alfresco/services/DialogService",
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/html/Spacer",
         config: {
            height: "50vh"
         }
      },
      {
         name: "alfresco/layout/LeftAndRight",
         config: {
            widgetsLeft: [
               {
                  name: "alfresco/buttons/AlfButton",
                  id: "LEFT_BUTTON",
                  config: {
                     label: "Left button",
                     publishTopic: "LEFT_BUTTON_PUSHED"
                  }
               }
            ],
            widgetsRight: [
               {
                  name: "alfresco/buttons/AlfButton",
                  id: "RIGHT_BUTTON",
                  config: {
                     label: "Right button",
                     publishTopic: "RIGHT_BUTTON_PUSHED"
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "NOTIFICATION_BUTTON_SMALL",
         config: {
            label: "Display notification (short)",
            publishTopic: "ALF_DISPLAY_NOTIFICATION",
            publishPayload: {
               message: "This is a message.",
               publishTopic: "ALF_NOTIFICATION_DESTROYED"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "NOTIFICATION_BUTTON_MEDIUM",
         config: {
            label: "Display notification (medium)",
            publishTopic: "ALF_DISPLAY_NOTIFICATION",
            publishPayload: {
               message: "This is my test notification message. It is of, what I consider to be, a medium length."
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "NOTIFICATION_BUTTON_LARGE",
         config: {
            label: "Display notification (long)",
            publishTopic: "ALF_DISPLAY_NOTIFICATION",
            publishPayload: {
               message: "This is a longer message. I shall Lorem Ipsum it. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum auctor feugiat tristique. Nulla sed egestas elit. Quisque malesuada eget felis eget auctor. Aenean mattis quam nisl, sit amet sollicitudin ex posuere eget.",
               closeTopic: "CLOSE_ME",
               publishTopic: "ALF_NOTIFICATION_DESTROYED"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "CLOSE_NOTIFICATION_BUTTON",
         config: {
            label: "Close long notification",
            publishTopic: "CLOSE_ME"
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "DIALOG_BUTTON",
         config: {
            label: "Display dialog",
            publishTopic: "ALF_CREATE_DIALOG_REQUEST",
            publishPayload: {
               dialogTitle: "Dialog title",
               widgetsContent: [
                  {
                     name: "alfresco/html/Heading",
                     config: {
                        label: "This is a label to help extend the dialog to cover the notification",
                        level: 3
                     }
                  },
                  {
                     name: "alfresco/buttons/AlfButton",
                     id: "NOTIFICATION_BUTTON_DIALOG",
                     config: {
                        label: "This is a really long label to make sure the button and dialog hide the notification",
                        publishTopic: "ALF_DISPLAY_NOTIFICATION",
                        publishPayload: {
                           message: "This is an in-dialog message."
                        }
                     }
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "STICKY_PANEL_BUTTON",
         config: {
            label: "Display sticky panel",
            publishTopic: "ALF_DISPLAY_STICKY_PANEL",
            publishPayload: {
               title: "My sticky panel title",
               width: 500,
               padding: 0,
               widgets: [
                  {
                     name: "alfresco/html/Heading",
                     config: {
                        label: "This is some text to go inside the sticky panel",
                        level: 3
                     }
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "UPDATE_PANEL_TITLE_BUTTON",
         config: {
            label: "Update panel title (and check XSS)",
            publishTopic: "ALF_STICKY_PANEL_SET_TITLE",
            publishPayload: {
               title: "<img src=\"1\" onerror=\"window.hackedPanel=true\">"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "NOTIFICATION_WIDGETS_BUTTON",
         config: {
            label: "Display non-closing notification with widgets",
            publishTopic: "ALF_DISPLAY_NOTIFICATION",
            publishPayload: {
               message: "This is a message",
               publishTopic: "ALF_NOTIFICATION_DESTROYED",
               autoClose: false,
               notificationId: "NON_CLOSING_NOTIFICATION",
               widgets: [{
                  name: "alfresco/buttons/AlfButton",
                  id: "IN_NOTIFICATION_BUTTON",
                  config: {
                     label: "Push me!",
                     publishTopic: "PUBLISH_FROM_NOTIFICATION"
                  }
               }]
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "NOTIFICATION_INLINE_LINK_BUTTON",
         config: {
            label: "Display notification with inline link",
            publishTopic: "ALF_DISPLAY_NOTIFICATION",
            publishPayload: {
               message: "This is a message",
               publishTopic: "ALF_NOTIFICATION_DESTROYED",
               wordsPerSecond: 3,
               inlineLink: {
                  label: "Perform action",
                  publishTopic: "PUBLISH_BY_NOTIFICATION_LINK",
                  publishPayload: {
                     sampleValue: "foo"
                  }
               }
            }
         }
      },
      {
         name: "alfresco/html/Spacer",
         config: {
            height: "500px"
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "NOTIFICATION_BUTTON_SCROLLED",
         config: {
            label: "Display notification (use when scrolled)",
            publishTopic: "ALF_DISPLAY_NOTIFICATION",
            publishPayload: {
               message: "This is another test notification message."
            }
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};