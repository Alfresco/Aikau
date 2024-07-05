// Easily change number of widgets in panel (just used to vertically fill it)
var multipleWidgets = [],
   singleWidget = {
      name: "alfresco/html/Heading",
      config: {
         level: 3,
         label: "This is a heading"
      }
   },
   numWidgets = 8;
for (var i = 0; i < numWidgets; i++) {
   multipleWidgets.push(singleWidget);
}

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
      "alfresco/services/NotificationService"
   ],
   widgets: [
      {
         name: "alfresco/layout/FixedHeaderFooter",
         config: {
            height: "auto",
            widgetsForHeader: [
               {
                  name: "alfresco/buttons/AlfButton",
                  id: "OPEN_STICKY_PANEL",
                  config: {
                     label: "Open StickyPanel",
                     publishTopic: "ALF_DISPLAY_STICKY_PANEL",
                     publishPayload: {
                        title: "This is a sticky panel",
                        widgets: multipleWidgets,
                        width: 500,
                        warnIfOpen: false
                     }
                  }
               }
            ],
            widgets: [
               {
                  name: "alfresco/logging/DebugLog"
               }
            ],
            widgetsForFooter: [
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
               }
            ]
         }
      }
   ]
};