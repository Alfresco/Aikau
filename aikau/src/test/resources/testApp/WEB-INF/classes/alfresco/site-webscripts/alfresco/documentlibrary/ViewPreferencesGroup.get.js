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
         id: "SET_METADATA_1",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set owned node with default view",
            publishTopic: "ALF_CURRENT_NODEREF_CHANGED",
            publishPayload: {
               node: {
                  parent: {
                     properties: {
                        "app:defaultViewId": "VIEW1",
                        "cm:creator": "guest"
                     }
                  }
               }
            }
         }
      },
      {
         id: "SET_METADATA_2",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set owned node with different view",
            publishTopic: "ALF_CURRENT_NODEREF_CHANGED",
            publishPayload: {
               node: {
                  parent: {
                     properties: {
                        "app:defaultViewId": "VIEW2",
                        "cm:creator": "guest"
                     }
                  }
               }
            }
         }
      },
      {
         id: "SET_METADATA_3",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set unowned node default view",
            publishTopic: "ALF_CURRENT_NODEREF_CHANGED",
            publishPayload: {
               node: {
                  parent: {
                     properties: {
                        "app:defaultViewId": "VIEW1",
                        "cm:creator": "someoneelse"
                     }
                  }
               }
            }
         }
      },
      {
         id: "SET_METADATA_4",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set unowned node no view",
            publishTopic: "ALF_CURRENT_NODEREF_CHANGED",
            publishPayload: {
               node: {
                  parent: {
                     properties: {
                        "cm:creator": "someoneelse"
                     }
                  }
               }
            }
         }
      },
      {
         id: "MENU_BAR",
         name: "alfresco/menus/AlfMenuBar",
         config: {
            widgets: [
               {
                  id: "SET_VIEW_1",
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     label: "Set view 1",
                     publishTopic: "ALF_DOCLIST_SELECT_VIEW",
                     publishPayload: {
                        value: "VIEW1",
                        label: "View 1"
                     }
                  }
               },
               {
                  id: "SET_VIEW_2",
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     label: "Set view 2",
                     publishTopic: "ALF_DOCLIST_SELECT_VIEW",
                     publishPayload: {
                        value: "VIEW2",
                        label: "View 2"
                     }
                  }
               },
               {
                  id: "DROP_DOWN_MENU",
                  name: "alfresco/menus/AlfMenuBarPopup",
                  config: {
                     label: "Menu",
                     widgets: [
                        {
                           id: "VPG1",
                           name: "alfresco/documentlibrary/ViewPreferencesGroup",
                           config: {
                              isSiteManager: true
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/lists/views/AlfListView",
         config: {
            viewSelectionConfig: {
               label: "View 1",
               value: "VIEW1"
            }
         }
      },
      {
         name: "alfresco/lists/views/AlfListView",
         config: {
            viewSelectionConfig: {
               label: "View 2",
               value: "VIEW2"
            }
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};