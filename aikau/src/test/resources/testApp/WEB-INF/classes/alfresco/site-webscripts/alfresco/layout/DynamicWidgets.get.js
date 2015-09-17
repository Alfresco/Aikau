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
         name: "alfresco/layout/VerticalWidgets",
         config: {
            widgets: [
               {
                  id: "BUTTON1",
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: "Create logo",
                     publishTopic: "SHOW_WIDGET_MODEL",
                     publishPayload: {
                        widgets: [
                           {
                              id: "LOGO1",
                              name: "alfresco/logo/Logo"
                           }
                        ]
                     }
                  }
               },
               {
                  id: "BUTTON2",
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: "Create label",
                     publishTopic: "SHOW_WIDGET_MODEL",
                     publishPayload: {
                        widgets: [
                           {
                              id: "LABEL1",
                              name: "alfresco/html/Label",
                              config: {
                                 label: "A label"
                              }
                           }
                        ]
                     }
                  }
               },
               {
                  id: "CW1",
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Widget Models Will Be Rendered Here...",
                     widgets: [
                        {
                           id: "DW1",
                           name: "alfresco/layout/DynamicWidgets",
                           config: {
                              subscriptionTopic: "SHOW_WIDGET_MODEL"
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