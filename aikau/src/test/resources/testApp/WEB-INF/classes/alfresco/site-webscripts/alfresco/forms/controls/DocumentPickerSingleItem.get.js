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
      "alfresco/services/DialogService",
      "aikauTesting/mockservices/DocumentPickerTestService",
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/forms/Form",
         id: "FORM",
         config: {
            okButtonPublishTopic: "PUBLISH_FORM",
            widgets: [
               {
                  name: "alfresco/forms/controls/DocumentPicker",
                  config: {
                     id: "DOCUMENT_PICKER",
                     name: "document",
                     label: "Items",
                     currentItem: getMockImage(),
                     useCurrentItemAsValue: true,
                     configForPicker: {
                        widgetsForPickedItems: [
                           {
                              name: "alfresco/pickers/PickedItems",
                              assignTo: "pickedItemsWidget",
                              config: {
                                 singleItemMode: true
                              }
                           }
                        ]
                     }
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

function getMockImage() {
   return {
      "node": {
         "mimetype": "image\/jpeg",
         "isLink": false,
         "aspects": ["cm:auditable", "cm:thumbnailModification", "sys:referenceable", "exif:exif", "cm:titled", "cm:author", "rn:renditioned", "sys:localized", "cm:versionable"],
         "permissions": {
            "roles": ["ALLOWED;GROUP_EVERYONE;Contributor;INHERITED"],
            "inherited": true,
            "user": {
               "ChangePermissions": true,
               "CancelCheckOut": false,
               "CreateChildren": true,
               "Write": true,
               "Delete": true
            }
         },
         "encoding": "UTF-8",
         "nodeRef": "workspace:\/\/SpacesStore\/8285e568-3782-4839-9f53-bf0b6aaacb3c",
         "properties": {
            "cm:modified": {
               "value": "Thu Dec 19 12:09:26 GMT 2013",
               "iso8601": "2013-12-19T12:09:26.689Z"
            },
            "exif:pixelYDimension": "269",
            "cm:content": null,
            "sys:node-uuid": null,
            "exif:pixelXDimension": "187",
            "cm:name": "Brian Griffin.jpg",
            "cm:lastThumbnailModification": ["doclib:1387454968019"],
            "sys:store-protocol": null,
            "sys:locale": null,
            "cm:autoVersion": "true",
            "sys:node-dbid": null,
            "cm:initialVersion": "true",
            "cm:creator": {
               "lastName": "",
               "userName": "admin",
               "displayName": "Administrator",
               "firstName": "Administrator"
            },
            "cm:created": {
               "value": "Thu Dec 19 12:09:26 GMT 2013",
               "iso8601": "2013-12-19T12:09:26.689Z"
            },
            "cm:versionLabel": "1.0",
            "cm:autoVersionOnUpdateProps": "false",
            "cm:modifier": {
               "lastName": "",
               "userName": "admin",
               "displayName": "Administrator",
               "firstName": "Administrator"
            },
            "sys:store-identifier": null
         },
         "type": "cm:content",
         "contentURL": "\/api\/node\/content\/workspace\/SpacesStore\/8285e568-3782-4839-9f53-bf0b6aaacb3c\/Brian%20Griffin.jpg",
         "isContainer": false,
         "size": 6775.0,
         "isLocked": false
      },
      "version": "1.0",
      "webdavUrl": "\/webdav\/Shared\/Brian%20Griffin.jpg",
      "isFavourite": false,
      "likes": {
         "isLiked": false,
         "totalLikes": 0.0
      },
      "location": {
         "repositoryId": "91d4696a-514e-47cb-a28e-5118e527cc64",
         "path": "\/",
         "file": "Brian Griffin.jpg",
         "parent": {}
      },
      "parent": {
         "isLink": false,
         "aspects": ["app:uifacets", "cm:auditable", "sys:referenceable", "cm:titled", "sys:localized"],
         "permissions": {
            "roles": ["ALLOWED;GROUP_EVERYONE;Contributor;DIRECT"],
            "inherited": false,
            "user": {
               "ChangePermissions": true,
               "CancelCheckOut": false,
               "CreateChildren": true,
               "Write": true,
               "Delete": true
            }
         },
         "nodeRef": "workspace:\/\/SpacesStore\/3d6fa5ad-1443-446d-b5c0-347710aa8447",
         "properties": {
            "cm:modified": {
               "value": "Thu Dec 19 12:09:26 GMT 2013",
               "iso8601": "2013-12-19T12:09:26.796Z"
            },
            "sys:node-dbid": null,
            "cm:description": "Folder to store shared stuff ",
            "cm:creator": {
               "lastName": "User",
               "userName": "System",
               "displayName": "System User",
               "firstName": "System"
            },
            "sys:node-uuid": null,
            "cm:created": {
               "value": "Thu Dec 19 11:51:19 GMT 2013",
               "iso8601": "2013-12-19T11:51:19.215Z"
            },
            "cm:name": "Shared",
            "cm:title": "Shared Folder",
            "sys:store-protocol": null,
            "sys:locale": null,
            "cm:modifier": {
               "lastName": "User",
               "userName": "System",
               "displayName": "System User",
               "firstName": "System"
            },
            "sys:store-identifier": null,
            "app:icon": "space-icon-default"
         },
         "type": "cm:folder",
         "isContainer": true,
         "isLocked": false
      },
      "nodeRef": "workspace:\/\/SpacesStore\/8285e568-3782-4839-9f53-bf0b6aaacb3c",
      "fileName": "Brian Griffin.jpg",
      "displayName": "Brian Griffin.jpg",
      "actionGroupId": "document-browse",
      "actions": [{
         "id": "document-download",
         "icon": "document-download",
         "type": "link",
         "label": "actions.document.download",
         "params": {
            "href": "{downloadUrl}"
         },
         "index": "100"
      }, {
         "id": "document-view-content",
         "icon": "document-view-content",
         "type": "link",
         "label": "actions.document.view",
         "params": {
            "href": "{viewUrl}"
         },
         "index": "110"
      }, {
         "id": "document-edit-properties",
         "icon": "document-edit-properties",
         "type": "javascript",
         "label": "actions.document.edit-metadata",
         "params": {
            "function": "onActionDetails"
         },
         "index": "130"
      }, {
         "id": "document-upload-new-version",
         "icon": "document-upload-new-version",
         "type": "javascript",
         "label": "actions.document.upload-new-version",
         "params": {
            "function": "onActionUploadNewVersion"
         },
         "index": "140"
      }, {
         "id": "document-edit-offline",
         "icon": "document-edit-offline",
         "type": "javascript",
         "label": "actions.document.edit-offline",
         "params": {
            "function": "onActionEditOffline"
         },
         "index": "210"
      }, {
         "id": "document-copy-to",
         "icon": "document-copy-to",
         "type": "javascript",
         "label": "actions.document.copy-to",
         "params": {
            "function": "onActionCopyTo"
         },
         "index": "250"
      }, {
         "id": "document-move-to",
         "icon": "document-move-to",
         "type": "javascript",
         "label": "actions.document.move-to",
         "params": {
            "function": "onActionMoveTo"
         },
         "index": "260"
      }, {
         "id": "document-delete",
         "icon": "document-delete",
         "type": "javascript",
         "label": "actions.document.delete",
         "params": {
            "function": "onActionDelete"
         },
         "index": "270"
      }, {
         "id": "document-assign-workflow",
         "icon": "document-assign-workflow",
         "type": "javascript",
         "label": "actions.document.assign-workflow",
         "params": {
            "function": "onActionAssignWorkflow"
         },
         "index": "280"
      }],
      "indicators": [{
         "id": "exif",
         "index": "40",
         "icon": "exif-16.png",
         "label": "status.exif"
      }],
      "metadataTemplate": {
         "id": "default",
         "title": null,
         "banners": [],
         "lines": [{
            "index": "10",
            "template": "{date}{size}",
            "view": ""
         }, {
            "index": "20",
            "template": "{description}",
            "view": "detailed"
         }, {
            "index": "30",
            "template": "{tags}",
            "view": "detailed"
         }, {
            "index": "50",
            "template": "{social}",
            "view": "detailed"
         }]
      }
   };
}