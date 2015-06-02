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
         id: "TOGGLE_DEVELOPER_MODE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Toggle Developer Mode",
            publishTopic: "ALF_TOGGLE_DEVELOPER_MODE"
         }
      },
      {
         name: "alfresco/html/Label",
         config: {
            label: "No id"
         }
      },
      {
         id: "LABEL",
         name: "alfresco/html/Label",
         config: {
            label: "Has id"
         }
      },
      {
         name: "alfresco/navigation/Link",
         id: "LINK",
         config: {
            label: "Test link",
            title: "This link will do a test publish",
            publishTopic: "LINK_CLICKED"
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};