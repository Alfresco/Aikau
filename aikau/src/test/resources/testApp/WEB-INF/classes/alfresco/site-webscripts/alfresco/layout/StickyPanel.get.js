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
for(var i = 0; i < numWidgets; i++) {
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
   widgets:[
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
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};