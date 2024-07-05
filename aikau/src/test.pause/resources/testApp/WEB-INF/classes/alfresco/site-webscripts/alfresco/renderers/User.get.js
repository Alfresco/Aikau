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
         id: "USER1",
         name: "alfresco/renderers/User",
         config: {
            currentItem: {
               user: "test"
            },
            propertyToRender: "user",
            renderOnNewLine: true
         }
      },
      {
         id: "USER2",
         name: "alfresco/renderers/User",
         config: {
            currentItem: {
               person: "admin|Administrator"
            },
            propertyToRender: "person",
            renderOnNewLine: true
         }
      },
      {
         id: "USER3",
         name: "alfresco/renderers/User",
         config: {
            currentItem: {
               userName: "abeecher|Alice|Beecher"
            },
            propertyToRender: "userName",
            renderOnNewLine: true,
            userNameProperty: "user",
            displayNameProperty: "displayedAs",
            publishTopic: "USER3",
            publishPayload: {
               userIs: "{user}",
               displayedAs: "{displayedAs}"
            }
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};