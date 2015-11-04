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
         name: "alfresco/logging/DebugLog"
      }
   ]
};

var numTwisters = 1;
for (var twisterIdx = 0; twisterIdx < numTwisters; twisterIdx++) {
   model.jsonModel.widgets.unshift({
      name: "aikauTesting/widgets/layout/ResizingTwister",
      // name: "alfresco/layout/Twister",
      id: "TWISTER_" + twisterIdx,
      config: {
         label: "Twister label",
         initiallyOpen: false,
         widgets: [
            {
               name: "alfresco/logo/Logo"
            }
         ]
      }
   });
}
