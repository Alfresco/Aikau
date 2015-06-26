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
      "alfresco/services/ActionService",
      "alfresco/services/NavigationService",
      "alfresco/services/SearchService"
   ],
   widgets: [
      {
         name: "aikauTesting/mockservices/PreferenceServiceMockXhr"
      },
      {
         name: "aikauTesting/WaitForMockXhrService",
         config: {
            widgets: [
               {
                  id: "FACETS",
                  name: "alfresco/layout/VerticalWidgets",
                  config: {
                     widgets: [
                        {
                           id: "TWISTER_HEADING_LEVEL",
                           name: "alfresco/layout/Twister",
                           config: {
                              label: "Twister with heading level",
                              headingLevel: 3,
                              initiallyOpen: true,
                              widgets: [
                                 {
                                    id: "LOGO1",
                                    name: "alfresco/logo/Logo"
                                 }
                              ]
                           }
                        },
                        {
                           id: "TWISTER_NO_HEADING_LEVEL",
                           name: "alfresco/layout/Twister",
                           config: {
                              label: "Twister with no heading level",
                              initiallyOpen: false,
                              widgets: [
                                 {
                                    id: "LOGO2",
                                    name: "alfresco/logo/Logo"
                                 }
                              ]
                           }
                        },
                        {
                           id: "TWISTER_BAD_HEADING_LEVEL",
                           name: "alfresco/layout/Twister",
                           config: {
                              label: "Twister with faulty heading level 'a'",
                              initiallyOpen: false,
                              twisterPreferenceName: "twister1",
                              headingLevel: "a",
                              widgets: [
                                 {
                                    id: "LOGO3",
                                    name: "alfresco/logo/Logo"
                                 }
                              ]
                           }
                        },
                        {
                           id: "TWISTER_BAD_HEADING_LEVEL_TWO",
                           name: "alfresco/layout/Twister",
                           config: {
                              label: "Twister with heading level 0",
                              headingLevel: 0,
                              initiallyOpen: true,
                              twisterPreferenceName: "twister2",
                              widgets: [
                                 {
                                    id: "LOGO4",
                                    name: "alfresco/logo/Logo"
                                 }
                              ]
                           }
                        },
                        {
                           id: "TWISTER_BAD_HEADING_LEVEL_THREE",
                           name: "alfresco/layout/Twister",
                           config: {
                              label: "Twister with heading level 7",
                              headingLevel: 7,
                              widgets: [
                                 {
                                    id: "LOGO5",
                                    name: "alfresco/logo/Logo"
                                 }
                              ]
                           }
                        },
                        {
                           id: "TWISTER_NULL_LABEL",
                           name: "alfresco/layout/Twister",
                           config: {
                              label: null,
                              widgets: [
                                 {
                                    id: "LOGO6",
                                    name: "alfresco/logo/Logo"
                                 }
                              ]
                           }
                        },
                        {
                           id: "TWISTER_EMPTY_LABEL",
                           name: "alfresco/layout/Twister",
                           config: {
                              label: "",
                              widgets: [
                                 {
                                    id: "LOGO7",
                                    name: "alfresco/logo/Logo"
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