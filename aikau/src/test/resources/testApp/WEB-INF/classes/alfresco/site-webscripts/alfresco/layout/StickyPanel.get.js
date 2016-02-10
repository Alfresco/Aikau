// Easily change number of widgets in panel (just used to vertically fill it)
var multipleWidgets = [],
   singleWidget = {
      name: "alfresco/html/Heading",
      config: {
         level: 3,
         label: "This is a heading"
      }
   },
   numWidgets = 10;
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
      }
   ],
   widgets:[
      {
         name: "alfresco/html/Heading",
         id: "PAGE_HEADING",
         config: {
            level: 3,
            label: "Page used for development only. This widget should be instantiated through the NotificationService."
         }
      },
      {
         name: "alfresco/layout/StickyPanel",
         id: "STICKY_PANEL",
         config: {
            panelWidth: 400,
            widgets: multipleWidgets
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};