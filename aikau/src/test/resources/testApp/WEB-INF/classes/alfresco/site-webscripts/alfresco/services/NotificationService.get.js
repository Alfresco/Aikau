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
               message: "This is a longer message. I shall Lorem Ipsum it. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum auctor feugiat tristique. Nulla sed egestas elit. Quisque malesuada eget felis eget auctor. Aenean mattis quam nisl, sit amet sollicitudin ex posuere eget."
            }
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