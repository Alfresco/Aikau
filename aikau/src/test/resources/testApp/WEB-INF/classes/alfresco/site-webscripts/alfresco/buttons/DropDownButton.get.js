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
         name: "alfresco/layout/VerticalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/layout/LeftAndRight",
                  config: {
                     widgetsLeft: [
                        {
                           name: "alfresco/buttons/DropDownButton",
                           config: {
                              label: "Drop down 1",
                              widgets: [
                                 {
                                    name: "alfresco/logo/Logo"
                                 }
                              ]
                           }
                        }
                     ],
                     widgetsRight: [
                        {
                           name: "alfresco/buttons/DropDownButton",
                           config: {
                              label: "Drop down 2",
                              widgets: [
                                 {
                                    name: "alfresco/logo/Logo",
                                    config: {
                                       logoClasses: "surf-logo-large"
                                    }
                                 }
                              ]
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