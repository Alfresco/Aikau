model.jsonModel = {
   services: [
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/menus/AlfMenuBar",
         align: "left",
         config: {
            id: "MENU_BAR",
            widgets: [
               {
                  name: "alfresco/menus/AlfMenuBarPopup",
                  config: {
                     id: "DROP_DOWN_MENU_1",
                     label: "dd1.label",
                     widgets: [
                        {
                           name: "alfresco/menus/AlfMenuGroup",
                           config: {
                              id: "DROP_DOWN_1_GROUP_1",
                              label: "dd1.group1.label",
                              widgets: [
                                 {
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       id: "MENU_ITEM_1",
                                       label: "dd1.group1.mi1",
                                       publishTopic: "KEYBOARD_CLICK",
                                       publishPayload: {
                                          item: "MENU_ITEM_1"
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       id: "MENU_ITEM_2",
                                       label: "dd1.group1.mi2",
                                       publishTopic: "KEYBOARD_CLICK",
                                       publishPayload: {
                                          item: "MENU_ITEM_2"
                                       }
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           name: "alfresco/menus/AlfMenuGroup",
                           config: {
                              id: "DROP_DOWN_1_GROUP_2",
                              label: "dd1.group2.label",
                              widgets: [
                                 {
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       id: "MENU_ITEM_3",
                                       label: "dd1.group1.mi3",
                                       publishTopic: "KEYBOARD_CLICK",
                                       publishPayload: {
                                          item: "MENU_ITEM_3"
                                       }
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           name: "alfresco/menus/AlfMenuGroup",
                           config: {
                              id: "DROP_DOWN_1_GROUP_3",
                              widgets: [
                                 {
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       id: "MENU_ITEM_4",
                                       label: "dd1.group1.mi4",
                                       publishTopic: "KEYBOARD_CLICK",
                                       publishPayload: {
                                          item: "MENU_ITEM_4"
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       id: "MENU_ITEM_5",
                                       label: "dd1.group1.mi5",
                                       publishTopic: "KEYBOARD_CLICK",
                                       publishPayload: {
                                          item: "MENU_ITEM_5"
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       id: "MENU_ITEM_6",
                                       label: "dd1.group1.mi6",
                                       publishTopic: "KEYBOARD_CLICK",
                                       publishPayload: {
                                          item: "MENU_ITEM_6"
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
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     id: "MENU_BAR_ITEM_1",
                     label: "mb.mi1",
                     targetUrl: "MENU_BAR_ITEM_1"
                  }
               },
               {
                  name: "alfresco/menus/AlfMenuBarPopup",
                  config: {
                     id: "DROP_DOWN_MENU_2",
                     label: "dd2.label",
                     widgets: [
                        {
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              id: "MENU_ITEM_7",
                              label: "dd2.mi7",
                              targetUrl: "MENU_ITEM_7"
                           }
                        },
                        {
                           name: "alfresco/menus/AlfMenuItem",
                           config: {
                              id: "MENU_ITEM_8",
                              label: "dd2.mi8",
                              targetUrl: "MENU_ITEM_8"
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/menus/AlfMenuBarPopup",
                  config: {
                     id: "DROP_DOWN_MENU_3",
                     label: "dd3.label",
                     widgets: [
                        {
                           name: "alfresco/menus/AlfMenuGroup",
                           config: {
                              id: "DROP_DOWN_3_GROUP_1",
                              label: "dd3.group1.label",
                              widgets: [
                                 {
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       id: "MENU_ITEM_11",
                                       label: "dd3.group1.mi1",
                                       publishTopic: "KEYBOARD_CLICK",
                                       publishPayload: {
                                          item: "MENU_ITEM_11"
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/menus/AlfCascadingMenu",
                                    config: {
                                       id: "CASCADING_MENU_1",
                                       label: "dd3.cc1.label",
                                       widgets: [
                                          {
                                             name: "alfresco/menus/AlfMenuGroup",
                                             config: {
                                                id: "CASCADING_MENU_1_GROUP_1",
                                                label: "dd3.cc1.group1.label",
                                                widgets: [
                                                   {
                                                      name: "alfresco/menus/AlfMenuItem",
                                                      config: {
                                                         id: "MENU_ITEM_12",
                                                         label: "dd3.cc1.group1.mi12",
                                                         publishTopic: "KEYBOARD_CLICK",
                                                         publishPayload: {
                                                            item: "MENU_ITEM_11"
                                                         }
                                                      }
                                                   },
                                                   {
                                                      name: "alfresco/menus/AlfCascadingMenu",
                                                      config: {
                                                         id: "CASCADING_MENU_2",
                                                         label: "dd3.cc2.label",
                                                         widgets: [
                                                            {
                                                               name: "alfresco/menus/AlfMenuItem",
                                                               config: {
                                                                  id: "MENU_ITEM_13",
                                                                  label: "dd3.cc2.group1.mi13",
                                                                  publishTopic: "KEYBOARD_CLICK",
                                                                  publishPayload: {
                                                                     item: "MENU_ITEM_13"
                                                                  }
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
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       id: "MENU_ITEM_14",
                                       label: "dd3.group1.mi2",
                                       publishTopic: "KEYBOARD_CLICK",
                                       publishPayload: {
                                          item: "MENU_ITEM_14"
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
                  name: "alfresco/menus/AlfMenuBarPopup",
                  config: {
                     id: "DROP_DOWN_MENU_4",
                     label: "dd4.label",
                     iconClass: "alf-configure-icon",
                     widgets: [
                        {
                           name: "alfresco/menus/AlfMenuGroup",
                           config: {
                              id: "DROP_DOWN_4_GROUP_1",
                              label: "dd4.group1.label",
                              widgets: [
                                 {
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       id: "MENU_ITEM_9",
                                       label: "dd4.group1.mi1",
                                       iconClass: "alf-edit-icon",
                                       publishTopic: "KEYBOARD_CLICK",
                                       publishPayload: {
                                          item: "MENU_ITEM_9"
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/logo/Logo"
                                 },
                                 {
                                    name: "alfresco/menus/AlfMenuItem",
                                    config: {
                                       id: "MENU_ITEM_10",
                                       label: "dd4.group1.mi2",
                                       iconClass: "alf-cog-icon",
                                       publishTopic: "KEYBOARD_CLICK",
                                       publishPayload: {
                                          item: "MENU_ITEM_10"
                                       }
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
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};