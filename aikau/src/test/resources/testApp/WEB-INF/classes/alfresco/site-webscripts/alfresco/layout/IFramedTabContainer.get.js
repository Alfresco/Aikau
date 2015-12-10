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
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};