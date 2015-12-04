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
      "alfresco/services/ActionService"
   ],
   widgets: [
      {
         id: "DOCUMENT_SELECTED_BUTTON",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Publish document selected event",
            publishTopic: "ALF_DOCLIST_DOCUMENT_SELECTED",
            publishPayload: {
               value: {
                  node: getTestNode()
               }
            }
         }
      },
      {
         id: "DOCUMENT_DESELECTED_BUTTON",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Publish document de-selected event",
            publishTopic: "ALF_DOCLIST_DOCUMENT_DESELECTED",
            publishPayload: {
               value: {
                  node: getTestNode()
               }
            }
         }
      },
      {
         id: "EDIT_OFFLINE_SUCCESS",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Edit Offline Success",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  "id": "document-edit-offline",
                  "icon": "document-edit-offline",
                  "type": "javascript",
                  "label": "actions.document.edit-offline",
                  "params": {
                     "function": "onActionEditOffline"
                  },
                  "index": "100"
               },
               document: {
                  node: getTestNode()
               }
            }
         }
      },
      {
         id: "EDIT_OFFLINE_FAILURE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Edit Offline Failure",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  "id": "document-edit-offline",
                  "icon": "document-edit-offline",
                  "type": "javascript",
                  "label": "actions.document.edit-offline",
                  "params": {
                     "function": "onActionEditOffline"
                  },
                  "index": "100"
               },
               document: {
                  node: getTestNode("workspace:\/\/SpacesStore\/b0037179-f105-4858-9d8f-44bfb0f67d8b"),
                  displayName: "Another document"
               }
            }
         }
      },
      {
         name: "aikauTesting/mockservices/ActionServiceMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};

// Put this into a function (use hoisting to keep code tidy), to avoid repetition
function getTestNode(nodeRef) {
   return {
      "isLink": false,
      "aspects": ["cm:auditable", "cm:thumbnailModification", "sys:referenceable", "cm:titled", "rn:renditioned", "cm:author", "cm:taggable", "sys:localized", "cm:generalclassifiable", "app:inlineeditable"],
      "properties": {
         "cm:modified": {
            "value": "Wed Mar 11 13:47:09 GMT 2015",
            "iso8601": "2015-03-11T13:47:09.072Z"
         },
         "cm:taggable": null,
         "cm:categories": [{
            "name": "British English",
            "path": "\/Languages\/English",
            "nodeRef": nodeRef || "workspace:\/\/SpacesStore\/bdd65b2d-8b03-45f0-89fe-701723df1afa"
         }],
         "cm:content": null,
         "sys:node-uuid": null,
         "app:editInline": "true",
         "cm:name": "Another document",
         "cm:lastThumbnailModification": ["pdf:1426081599646", "doclib:1426081635555"],
         "sys:store-protocol": null,
         "sys:locale": null,
         "sys:node-dbid": null,
         "cm:description": "",
         "cm:creator": {
            "lastName": "",
            "userName": "admin",
            "displayName": "Administrator",
            "firstName": "Administrator"
         },
         "cm:created": {
            "value": "Wed Mar 11 13:46:38 GMT 2015",
            "iso8601": "2015-03-11T13:46:38.088Z"
         },
         "cm:title": "",
         "cm:author": "",
         "cm:modifier": {
            "lastName": "",
            "userName": "admin",
            "displayName": "Administrator",
            "firstName": "Administrator"
         },
         "sys:store-identifier": null
      },
      "type": "cm:content",
      "isLocked": false,
      "size": 12,
      "mimetypeDisplayName": "Plain Text",
      "mimetype": "text\/plain",
      "encoding": "UTF-8",
      "permissions": {
         "roles": ["ALLOWED;GROUP_site_site5_SiteContributor;SiteContributor;INHERITED", 
                   "ALLOWED;GROUP_site_site5_SiteCollaborator;SiteCollaborator;INHERITED", 
                   "ALLOWED;GROUP_site_site5_SiteConsumer;SiteConsumer;INHERITED", 
                   "ALLOWED;GROUP_EVERYONE;SiteConsumer;INHERITED", 
                   "ALLOWED;GROUP_site_site5_SiteManager;SiteManager;INHERITED", 
                   "ALLOWED;GROUP_EVERYONE;ReadPermissions;INHERITED"],
         "inherited": true,
         "user": {
            "ChangePermissions": true,
            "CancelCheckOut": false,
            "CreateChildren": true,
            "Write": true,
            "Delete": true,
            "Unlock": false
         }
      },
      "nodeRef": nodeRef || "workspace:\/\/SpacesStore\/b0037179-f105-4858-9d8f-44bfb0f67d8a",
      "isContainer": false,
      "contentURL": "\/slingshot\/node\/content\/workspace\/SpacesStore\/b0037179-f105-4858-9d8f-44bfb0f67d8a\/Another%20document"
   };
}