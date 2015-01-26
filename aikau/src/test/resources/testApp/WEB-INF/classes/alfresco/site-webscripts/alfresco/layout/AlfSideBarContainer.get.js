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
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         name: "alfresco/layout/AlfSideBarContainer",
         config: {
            widgets: [
               {
                  name: "alfresco/layout/HorizontalWidgets",
                  align: "sidebar",
                  config: {
                     widgets: [
                        {
                           id: "SIDEBAR_LOGO",
                           name: "alfresco/logo/Logo",
                           config: {
                              logoClasses: "alfresco-logo-only"
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/layout/HorizontalWidgets",
                  config: {
                     widgets: [
                        {
                           id: "MAIN_LOGO",
                           name: "alfresco/logo/Logo",
                           config: {
                              logoClasses: "surf-logo-large"
                           }
                        },
                        {
                           id: "SHOW_BUTTON",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Show Sidebar",
                              publishTopic: "ALF_DOCLIST_SHOW_SIDEBAR",
                              publishPayload: {
                                 selected: true
                              }
                           }
                        },
                        {
                           id: "HIDE_BUTTON",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Hide Sidebar",
                              publishTopic: "ALF_DOCLIST_SHOW_SIDEBAR",
                              publishPayload: {
                                 selected: false
                              }
                           }
                        },
                        {
                           id: "WIDTH_PREFERENCE",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Set Width Preference",
                              publishTopic: "ALF_DOCLIST_SHOW_SIDEBAR",
                              publishPayload: {
                                 selected: false
                              }
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};