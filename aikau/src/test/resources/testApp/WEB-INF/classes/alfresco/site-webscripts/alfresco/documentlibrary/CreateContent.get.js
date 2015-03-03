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
      "alfresco/services/actions/CreateTemplateContentService",
      "alfresco/services/DialogService"
   ],
   widgets: [
      {
         name: "alfresco/menus/AlfMenuBar",
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
                              widgets: [
                                 {
                                    id: "CREATE_XML_DOC_1",
                                    name: "alfresco/documentlibrary/AlfCreateContentMenuItem",
                                    config: {
                                       iconImage: "/share/res/components/images/filetypes/xml-file-16.png",
                                       label: "XML",
                                       index: "0",
                                       permission: "CreateChildren",
                                       publishTopic: "ALF_CREATE_CONTENT_1",
                                       publishPayload: {
                                          action: "",
                                          type: null,
                                          params: {}
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
                  id: "POPUP_MENU",
                  name: "alfresco/menus/AlfMenuBarPopup",
                  config: {
                     label: "Standard Popup Menu",
                     widgets: [
                        {
                           id: "CREATE_CONTENT_MENU_GROUP2",
                           name: "alfresco/menus/AlfMenuGroup",
                           config: {
                              widgets: [
                                 {
                                    id: "CREATE_XML_DOC_2",
                                    name: "alfresco/documentlibrary/AlfCreateContentMenuItem",
                                    config: {
                                       iconImage: "/share/res/components/images/filetypes/xml-file-16.png",
                                       label: "XML",
                                       index: "0",
                                       permission: "CreateChildren",
                                       publishTopic: "ALF_CREATE_CONTENT_2",
                                       publishPayload: {
                                          action: "",
                                          type: null,
                                          params: {}
                                       }
                                    }
                                 },
                                 {
                                    id: "CREATE_TEMPLATES",
                                    name: "alfresco/documentlibrary/AlfCreateTemplateContentMenu",
                                    config: {
                                       label: "Create content from node template"
                                    }
                                 },
                                 {
                                    id: "CREATE_FOLDER_TEMPLATES",
                                    name: "alfresco/documentlibrary/AlfCreateTemplateContentMenu",
                                    config: {
                                       label: "Create content from folder template",
                                       _templatesUrl: "slingshot/doclib/folder-templates",
                                       templateType: "folder",
                                       targetNodeRef: "some://dummy/node"
                                    }
                                 }
                              ]
                           }
                        }
                     ]
                  }
               },
               {
                  id: "CREATE_CONTENT_MENUBAR_ITEM",
                  name: "alfresco/documentlibrary/AlfCreateContentMenuBarItem",
                  config: {
                     label: "Create Content",
                     publishTopic: "ALF_CREATE_CONTENT_3"
                  }
               }
            ]
         }
      },
      {
         id: "GRANT_CREATE_PERMISSION",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Grant Create Permission",
            publishTopic: "ALF_DOCLIST_USER_ACCESS_CHANGED",
            publishPayload: {
               userAccess: {
                  CreateChildren: true
               }
            }
         }
      },
      {
         id: "DENY_CREATE_PERMISSION",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Deny Create Permission",
            publishTopic: "ALF_DOCLIST_USER_ACCESS_CHANGED",
            publishPayload: {
               userAccess: {
                  CreateChildren: false
               }
            }
         }
      },
      {
         id: "SET_PATH",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set Path Filter",
            publishTopic: "ALF_HASH_CHANGED",
            publishPayload: {
               path: "/"
            }
         }
      },
      {
         id: "SET_OTHER_FILTER",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set Tag Filter",
            publishTopic: "ALF_HASH_CHANGED",
            publishPayload: {
               tag: "test"
            }
         }
      },
      {
         name: "aikauTesting/mockservices/CreateContentMockXhr"
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};