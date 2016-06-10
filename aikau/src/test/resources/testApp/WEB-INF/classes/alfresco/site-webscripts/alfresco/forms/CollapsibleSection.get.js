model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true,
               warn: true,
               error: true
            }
         }
      }
   ],
   widgets: [
      {
         id: "FORM1",
         name: "alfresco/forms/Form",
         config: {
            pubSubScope: "FORM1_",
            okButtonPublishTopic: "SAVE",
            value: {
               select: "TWO",
               textbox: "Some value"
            },
            widgets: [
               {
                  id: "CS1",
                  name: "alfresco/forms/CollapsibleSection",
                  config: {
                     label: "Collapse Me",
                     widgets: [
                        {
                           id: "TB1",
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              fieldId: "TB1",
                              name: "textbox",
                              label: "Some Text",
                              description: "Created to ensure that initial value is published"
                           }
                        }
                     ]
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