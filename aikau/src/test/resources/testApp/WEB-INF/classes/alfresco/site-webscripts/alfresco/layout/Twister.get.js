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
         name: "aikauTesting/WaitForMockXhrService",
         config: {
            widgets: [
               {
                  id: "SIDBAR",
                  name: "alfresco/layout/AlfSideBarContainer",
                  config: {
                     widgets: [
                        {
                           id: "FACETS",
                           name: "alfresco/layout/VerticalWidgets",
                           align: "sidebar",
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
                                       preferenceName: "twister1",
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
                                       preferenceName: "twister2",
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
                        },
                        {
                           id: "MAIN",
                           name: "alfresco/layout/VerticalWidgets",
                           config: {
                              widgets: [
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
                                    id: "AUTO_WIDTH_TWISTER",
                                    name: "alfresco/layout/Twister",
                                    config: {
                                       label: "Resizing Twister",
                                       initiallyOpen: true,
                                       headingLevel: 3,
                                       width: "AUTO",
                                       widgets: [
                                          {
                                             id: "HORIZONTAL1",
                                             name: "alfresco/layout/HorizontalWidgets",
                                             config: {
                                                widgets: [
                                                   {
                                                      name: "alfresco/layout/ClassicWindow",
                                                      config: {
                                                         title: "Watch me grow and shrink!"
                                                      }
                                                   }
                                                ]
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    id: "FIXED_WIDTH_TWISTER",
                                    name: "alfresco/layout/Twister",
                                    config: {
                                       label: "Fixed Width Twister",
                                       initiallyOpen: true,
                                       headingLevel: 3,
                                       width: "500px",
                                       widgets: [
                                          {
                                             id: "HORIZONTAL1",
                                             name: "alfresco/layout/HorizontalWidgets",
                                             config: {
                                                widgets: [
                                                   {
                                                      name: "alfresco/layout/ClassicWindow",
                                                      config: {
                                                         title: "Watch me stay the same size!"
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
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/PreferenceServiceMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};