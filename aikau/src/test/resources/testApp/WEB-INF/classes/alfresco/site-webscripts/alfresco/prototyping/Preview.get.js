var widgets = [
   {
      id: "PREVIEW_BUTTON",
      name: "alfresco/buttons/AlfButton",
      config: {
         label: "Button"
      }
   }
];
var stringifiedWidgets = JSON.stringify(widgets);

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
         id: "UPDATE_PREVIEW",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Update preview",
            publishTopic: "ALF_GENERATE_PAGE_PREVIEW",
            publishPayload: {
               stringified: true,
               widgets: stringifiedWidgets
            }
         }
      },
      {
         id: "WINDOW",
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Preview",
            widgets: [
               {
                  id: "PREVIEW",
                  name: "alfresco/prototyping/Preview",
                  config: {
                     pageDefinition: {
                        widgets: [
                           {
                              id: "LOGO",
                              name: "alfresco/logo/Logo"
                           }
                        ]
                     }
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