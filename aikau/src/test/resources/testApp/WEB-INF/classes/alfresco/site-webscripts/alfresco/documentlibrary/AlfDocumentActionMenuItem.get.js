var createAlfDocumentActionMenuItem = function (config) {
   return {
      id: config.id,
      name: "alfresco/documentlibrary/AlfDocumentActionMenuItem",
      config: {
         id: config.actionType,
         label: config.label,
         iconImage: config.icon,
         type: "action-link",
         permission: config.permission || "",
         asset: "document",
         href: "",
         hasAspect: config.hasAspect || "",
         notAspect: config.notAspect || "",
         publishTopic: "ALF_SELECTED_DOCUMENTS_ACTION_REQUEST",
         publishPayload: {
            action: config.actionType
         }
      }
   };
};

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
      "alfresco/services/ActionService"
   ],
   widgets: [
      {
         id: "MENU_BAR",
         name: "alfresco/menus/AlfMenuBar",
         config: {
            widgets: [
               {
                  id: "SELECTED_ITEMS_MENU",
                  name: "alfresco/documentlibrary/AlfSelectedItemsMenuBarPopup",
                  config: {
                     label: "Selected Items",
                     itemKeyProperty: "nodeRef",
                     widgets: [
                        {
                           id: "SELECTED_ITEMS_ACTIONS_GROUP",
                           name: "alfresco/menus/AlfMenuGroup",
                           config: {
                              widgets: [
                                 createAlfDocumentActionMenuItem({
                                    id: "DOWNLOAD",
                                    actionType: "onActionDownload",
                                    icon: "document-download",
                                    label: "Download"
                                 }),
                                 createAlfDocumentActionMenuItem({
                                    id: "COPY",
                                    actionType: "onActionCopyTo",
                                    icon: "document-copy-to",
                                    label: "Copy",
                                    notAspect: "smf:smartFolder,smf:smartFolderChild"
                                 }),
                                 createAlfDocumentActionMenuItem({
                                    id: "MOVE",
                                    actionType: "onActionMoveTo",
                                    icon: "document-move-to",
                                    label: "Move",
                                    notAspect: "smf:smartFolder,smf:smartFolderChild",
                                    permission: "Delete"
                                 }),
                                 createAlfDocumentActionMenuItem({
                                    id: "START_WORKFLOW",
                                    actionType: "onActionAssignWorkflow",
                                    icon: "document-assign-workflow",
                                    label: "Start workflow",
                                    asset: "document"
                                 }),
                                 createAlfDocumentActionMenuItem({
                                    id: "CLOUD_SYNC",
                                    actionType: "onActionCloudSyncRequest",
                                    icon: "document-request-sync",
                                    label: "Request Cloud Sync",
                                    hasAspect: "sync:syncSetMemberNode",
                                    notAspect: "smf:smartFolder,smf:smartFolderChild",
                                    syncMode: "ON_PREMISE"
                                 })
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
         id: "LIST",
         name: "alfresco/lists/AlfList",
         config: {
            currentData: {
               items: [
                  {
                     displayName: "Folder",
                     node: {
                        nodeRef: "some://fake/node1",
                        isContainer: true,
                        permissions: {
                           inherited: false,
                           roles: ["ALLOWED;GROUP_EVERYONE;Contributor;DIRECT"],
                           user: {
                              Delete: true,
                              Write: true,
                              CancelCheckOut: false,
                              ChangePermissions: true,
                              CreateChildren: true,
                              "Unlock": false
                           }
                        },
                        aspects: ["cm:titled", "cm:auditable", "sys:referenceable", "sys:localized", "app:uifacets"]
                     }
                  },
                  {
                     displayName: "Document",
                     node: {
                        nodeRef: "some://fake/node2",
                        isContainer: false,
                        permissions: {
                           inherited: false,
                           roles: ["ALLOWED;GROUP_EVERYONE;Contributor;DIRECT"],
                           user: {
                              Delete: true,
                              Write: true,
                              CancelCheckOut: false,
                              ChangePermissions: true,
                              CreateChildren: true,
                              "Unlock": false
                           }
                        },
                        aspects: ["cm:titled", "cm:auditable", "sys:referenceable", "sys:localized", "app:uifacets"]
                     }
                  }
               ]
            },
            widgets: [
               {
                  id: "VIEW",
                  name: "alfresco/lists/views/AlfListView",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/lists/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    id: "SELECTOR_CELL",
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       width: 20,
                                       widgets: [
                                          {
                                             id: "SELECTOR",
                                             name: "alfresco/renderers/Selector"
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             id: "PROPERTY",
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "displayName"
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
         name: "alfresco/logging/DebugLog"
      }
   ]
};