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
      },
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/menus/AlfMenuBar",
         config: {
            currentItem: {
               w: ["one","two","three"],
               x: "a",
               y: "b",
               z: "c",
               tokens: {
                  t1: "one",
                  t2: "a"
               }
            },
            widgets: [
               {
                  id: "MBI9",
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     label: "Should appear (contains pass)",
                     renderFilter: [
                        {
                           property: "w",
                           contains: ["two"]
                        }
                     ]
                  }
               },
               {
                  id: "MBI10",
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     label: "Should appear (containsAll pass)",
                     renderFilter: [
                        {
                           property: "w",
                           containsAll: ["one","three"]
                        }
                     ]
                  }
               },
               {
                  id: "MBI11",
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     label: "Should not appear (contains fail)",
                     renderFilter: [
                        {
                           property: "w",
                           contains: ["four"]
                        }
                     ]
                  }
               },
               {
                  id: "MBI12",
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     label: "Should not appear (containsAll fail)",
                     renderFilter: [
                        {
                           property: "w",
                           containsAll: ["two","four"]
                        }
                     ]
                  }
               },
               {
                  id: "MBI13",
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     label: "Should appear (is token)",
                     renderFilter: [
                        {
                           substituteTokens: true,
                           property: "x",
                           values: ["{tokens.t2}"]
                        }
                     ]
                  }
               },
               {
                  id: "MBI14",
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     label: "Should appear (contains token)",
                     renderFilter: [
                        {
                           substituteTokens: true,
                           property: "w",
                           contains: ["{tokens.t1}"]
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     id: "MBI1",
                     label: "Should Appear (pass rule)",
                     publishTopic: "MBI1",
                     renderFilter: [
                        {
                           property: "x",
                           values: ["a"]
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     id: "MBI2",
                     label: "Should not appear",
                     publishTopic: "MBI2",
                     renderFilter: [
                        {
                           property: "x",
                           values: ["1"]
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     id: "MBI3",
                     label: "Should appear (negate)",
                     publishTopic: "MBI3",
                     renderFilter: [
                        {
                           property: "x",
                           values: ["1","2"],
                           negate: true
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     id: "MBI3a",
                     label: "Should NOT appear (negate)",
                     publishTopic: "MBI3a",
                     renderFilter: [
                        {
                           property: "x",
                           values: ["a","b"],
                           negate: true
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     id: "MBI4",
                     label: "Should appear (absent)",
                     publishTopic: "MBI4",
                     renderFilter: [
                        {
                           property: "absent",
                           values: ["will not matter"],
                           renderOnAbsentProperty: true
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     id: "MBI5",
                     label: "Should appear (AND)",
                     publishTopic: "MBI5",
                     renderFilter: [
                        {
                           property: "x",
                           values: ["k", "a"]
                        },
                        {
                           property: "y",
                           values: ["b", "y"]
                        },
                        {
                           property: "z",
                           values: ["i", "c"]
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     id: "MBI6",
                     label: "Should not appear (FAILED AND)",
                     publishTopic: "MBI6",
                     renderFilter: [
                        {
                           property: "x",
                           values: ["k", "a"]
                        },
                        {
                           property: "y",
                           values: ["j"]
                        },
                        {
                           property: "z",
                           values: ["i", "c"]
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     id: "MBI7",
                     label: "Should appear (OR)",
                     publishTopic: "MBI7",
                     renderFilterMethod: "ANY",
                     renderFilter: [
                        {
                           property: "x",
                           values: ["k", "a"]
                        },
                        {
                           property: "y",
                           values: ["false"]
                        },
                        {
                           property: "z",
                           values: ["wrong"]
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     id: "MBI8",
                     label: "Should not appear (OR)",
                     publishTopic: "MBI8",
                     renderFilterMethod: "ANY",
                     renderFilter: [
                        {
                           property: "y",
                           values: ["false"]
                        },
                        {
                           property: "z",
                           values: ["wrong"]
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/menus/AlfMenuBarPopup",
                  config: {
                     id: "DD1",
                     label: "Drop Down 1",
                     widgets: [
                        {
                           name: "alfresco/menus/AlfMenuGroup",
                           config: {
                              currentItem: {
                                 a: "x",
                                 b: "y",
                                 c: "z"
                              },
                              label: "Group 1",
                              widgets: [
                                 {
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       id: "MI1",
                                       label: "Should appear (inherited)",
                                       publishTopic: "MI1",
                                       renderFilter: [
                                          {
                                             property: "a",
                                             values: ["e", "f", "x"]
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       id: "MI2",
                                       label: "Should not appear (old property)",
                                       publishTopic: "MI2",
                                       renderFilter: [
                                          {
                                             property: "x",
                                             values: ["will not exist"]
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
         name: "alfresco/logging/DebugLog"
      }
   ]
};