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
            footerHeight: 100,
            widgets: [
               {
                  name: "alfresco/layout/VerticalWidgets",
                  align: "sidebar",
                  config: {
                     widgets: [
                        {
                           id: "SIDEBAR_LOGO",
                           name: "alfresco/logo/Logo",
                           config: {
                              logoClasses: "alfresco-logo-only"
                           }
                        },
                        {
                           name: "alfresco/layout/Twister",
                           id: "SIDEBAR_TWISTER",
                           config: {
                              label: "Large twister (700px)",
                              initiallyOpen: false,
                              widgets: [
                                 {
                                    name: "alfresco/layout/SimplePanel", 
                                    config: {
                                       height: "700px", 
                                       additionalStyles: {
                                          background: "#cfc",
                                          border: "1px solid #0c0",
                                          marginRight: "25px"
                                       }
                                    }
                                 },
                              ]
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/layout/VerticalWidgets",
                  config: {
                     widgets: [
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
                        },
                        {
                           name: "alfresco/html/Spacer",
                           config: {
                              height: "20px"
                           }
                        },
                        {
                           name: "alfresco/html/Heading",
                           config: {
                              level: 3,
                              label: "Debug log"
                           }
                        },
                        {
                           name: "alfresco/layout/SimplePanel", 
                           config: {
                              height: "300px", 
                              additionalStyles: {
                                 background: "#fff",
                                 border: "1px solid #666",
                                 padding: "10px"
                              },
                              widgets: [
                                 {
                                    name: "alfresco/logging/DebugLog"
                                 } 
                              ]
                           }
                        },
                        {
                           name: "alfresco/layout/Twister",
                           id: "MAIN_TWISTER",
                           config: {
                              label: "Small twister (200px)",
                              initiallyOpen: false,
                              widgets: [
                                 {
                                    name: "alfresco/layout/SimplePanel", 
                                    config: {
                                       height: "200px", 
                                       additionalStyles: {
                                          background: "#ccf",
                                          border: "1px solid #00c"
                                       }
                                    }
                                 },
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
         name: "alfresco/html/Spacer",
         config: {
            height: "10px"
         }
      },
      {
         name: "alfresco/layout/SimplePanel", 
         config: {
            height: "75px", 
            additionalStyles: {
               border: "1px solid #fcc"
            },
            widgets: [
               {
                  name: "alfresco/html/Heading",
                  config: {
                     level: 3,
                     label: "I'm 75px tall"
                  }
               } 
            ]
         }
      }
   ]
};