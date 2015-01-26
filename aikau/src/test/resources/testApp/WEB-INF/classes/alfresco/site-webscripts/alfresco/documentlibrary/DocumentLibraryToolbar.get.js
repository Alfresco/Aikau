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
         id: "TOOLBAR",
         name: "alfresco/documentlibrary/AlfToolbar",
         config: {
            widgets: [
               {
                  id: "LEFT_MENU_BAR",
                  name: "alfresco/menus/AlfMenuBar",
                  align: "left",
                  config: {
                     widgets: [
                        {
                           id: "CREATE_CONTENT_MENU",
                           name: "alfresco/documentlibrary/AlfCreateContentMenuBarPopup",
                           config: {
                              widgets: [
                                 {
                                    id: "CREATE_CONTENT_MENU_GROUP1",
                                    name: "alfresco/menus/AlfMenuGroup",
                                    config: {
                                       widgets: []
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           id: "UPLOAD_BUTTON",
                           name: "alfresco/documentlibrary/AlfCreateContentMenuBarItem",
                           config: {
                              label: "Upload",
                              iconClass: "alf-upload-icon",
                              publishTopic: "ALF_SHOW_UPLOADER"
                           }
                        },
                        {
                           id: "SYNC_TO_CLOUD_BUTTON",
                           name: "alfresco/documentlibrary/AlfCloudSyncFilteredMenuBarItem",
                           config: {
                              label: "Sync to Cloud",
                              publishTopic: "ALF_SYNC_CURRENT_LOCATION"
                           }
                        },
                        {
                           id: "UNSYNC_FROM_CLOUD_BUTTON",
                           name: "alfresco/documentlibrary/AlfCloudSyncFilteredMenuBarItem",
                           config: {
                              label: "Unsync from Cloud",
                              invertFilter: true,
                              publishTopic: "ALF_UNSYNC_CURRENT_LOCATION"
                           }
                        },
                        {
                           id: "SELECTED_ITEMS_MENU",
                           name: "alfresco/documentlibrary/AlfSelectedItemsMenuBarPopup",
                           config: {
                              label: "Selected Items",
                              widgets: [
                                 {
                                    id: "SELECTED_ITEMS_MENU_GROUP1",
                                    name: "alfresco/menus/AlfMenuGroup",
                                    config: {
                                       widgets: [
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
                  id: "PAGINATOR",
                  name: "alfresco/documentlibrary/AlfDocumentListPaginator",
                  align: "right"
               },
               {
                  id: "RIGHT_MENU_BAR",
                  name: "alfresco/menus/AlfMenuBar",
                  align: "right",
                  config: {
                     widgets: [
                        {
                           id: "POPUP_MENU",
                           name: "alfresco/menus/AlfMenuBarPopup",
                           config: {
                              iconClass: "alf-configure-icon",
                              widgets: [
                                 {
                                    id: "VIEW_SELECTION_GROUP",
                                    name: "alfresco/documentlibrary/AlfViewSelectionGroup"
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
         name: "alfresco/documentlibrary/AlfDocumentList",
         config: {
            additionalControlsTarget: "TOOLBAR",
            view: "V1",
            widgets: [
               {
                  name: "alfresco/documentlibrary/views/AlfDocumentListView",
                  config: {
                     viewSelectionConfig: {
                        label: "View 1",
                        value: "V1"
                     }
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