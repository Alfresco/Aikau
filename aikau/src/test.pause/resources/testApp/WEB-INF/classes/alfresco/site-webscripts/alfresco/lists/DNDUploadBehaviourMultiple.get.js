// jshint maxlen:false
// Data object to use for the lists/views...
var data = {
   items: [
      {
         nodeRef: "workspace://SpacesStore/f8394454-0651-48a5-b583-d067c7d03339",
         type: "folder",
         name: "test1",
         displayName: "Normal result 1",
         title: "Normal result title",
         modifiedBy: "Barry Smith",
         modifiedOn: "13th December 2010",
         modifiedByUser: "bsmith",
         description: "Normal result description",
         site: {
            title: "Normal result site title",
            shortName: "normalResult"
         },
         path: "/one/two/three/four",
         size: 283746,

         // From regular node
         node: {
            nodeRef: "workspace://SpacesStore/f8394454-0651-48a5-b583-d067c7d03339",
            isContainer: true,
            permissions: {
               roles: ["ALLOWED;GROUP_site_site1_SiteConsumer;SiteConsumer;DIRECT", "ALLOWED;GROUP_site_site1_SiteManager;SiteManager;DIRECT", "ALLOWED;GROUP_site_site1_SiteCollaborator;SiteCollaborator;DIRECT", "ALLOWED;GROUP_site_site1_SiteContributor;SiteContributor;DIRECT"],
               inherited: false,
               user: {
                  ChangePermissions: true,
                  CancelCheckOut: false,
                  CreateChildren: true,
                  Write: true,
                  Delete: true,
                  Unlock: false
               }
            }
         }
      },
      {
         nodeRef: "workspace://SpacesStore/f8394454-0651-48a5-b583-d067c7d03339",
         type: "folder",
         name: "test2",
         displayName: "Normal result 2",
         title: "Normal result title",
         modifiedBy: "Barry Smith",
         modifiedOn: "13th December 2010",
         modifiedByUser: "bsmith",
         description: "Normal result description",
         site: {
            title: "Normal result site title",
            shortName: "normalResult"
         },
         path: "/one/two/three/four",
         size: 283746,

         // From regular node
         node: {
            nodeRef: "workspace://SpacesStore/f8394454-0651-48a5-b583-d067c7d03339",
            isContainer: true,
            permissions: {
               roles: ["ALLOWED;GROUP_site_site1_SiteConsumer;SiteConsumer;DIRECT", "ALLOWED;GROUP_site_site1_SiteManager;SiteManager;DIRECT", "ALLOWED;GROUP_site_site1_SiteCollaborator;SiteCollaborator;DIRECT", "ALLOWED;GROUP_site_site1_SiteContributor;SiteContributor;DIRECT"],
               inherited: false,
               user: {
                  ChangePermissions: true,
                  CancelCheckOut: false,
                  CreateChildren: true,
                  Write: true,
                  Delete: true,
                  Unlock: false
               }
            }
         }
      },
      {
         nodeRef: "workspace://SpacesStore/f8394454-0651-48a5-b583-d067c7d03339",
         type: "folder",
         name: "test3",
         displayName: "Normal result 3",
         title: "Normal result title",
         modifiedBy: "Barry Smith",
         modifiedOn: "13th December 2010",
         modifiedByUser: "bsmith",
         description: "Normal result description",
         site: {
            title: "Normal result site title",
            shortName: "normalResult"
         },
         path: "/one/two/three/four",
         size: 283746,

         // From regular node
         node: {
            nodeRef: "workspace://SpacesStore/f8394454-0651-48a5-b583-d067c7d03339",
            isContainer: true,
            permissions: {
               roles: ["ALLOWED;GROUP_site_site1_SiteConsumer;SiteConsumer;DIRECT", "ALLOWED;GROUP_site_site1_SiteManager;SiteManager;DIRECT", "ALLOWED;GROUP_site_site1_SiteCollaborator;SiteCollaborator;DIRECT", "ALLOWED;GROUP_site_site1_SiteContributor;SiteContributor;DIRECT"],
               inherited: false,
               user: {
                  ChangePermissions: true,
                  CancelCheckOut: false,
                  CreateChildren: true,
                  Write: true,
                  Delete: true,
                  Unlock: false
               }
            }
         }
      },
      {
         nodeRef: "workspace://SpacesStore/f8394454-0651-48a5-b583-d067c7d03339",
         type: "folder",
         name: "test4",
         displayName: "Normal result 4",
         title: "Normal result title",
         modifiedBy: "Barry Smith",
         modifiedOn: "13th December 2010",
         modifiedByUser: "bsmith",
         description: "Normal result description",
         site: {
            title: "Normal result site title",
            shortName: "normalResult"
         },
         path: "/one/two/three/four",
         size: 283746,

         // From regular node
         node: {
            nodeRef: "workspace://SpacesStore/f8394454-0651-48a5-b583-d067c7d03339",
            isContainer: true,
            permissions: {
               roles: ["ALLOWED;GROUP_site_site1_SiteConsumer;SiteConsumer;DIRECT", "ALLOWED;GROUP_site_site1_SiteManager;SiteManager;DIRECT", "ALLOWED;GROUP_site_site1_SiteCollaborator;SiteCollaborator;DIRECT", "ALLOWED;GROUP_site_site1_SiteContributor;SiteContributor;DIRECT"],
               inherited: false,
               user: {
                  ChangePermissions: true,
                  CancelCheckOut: false,
                  CreateChildren: true,
                  Write: true,
                  Delete: true,
                  Unlock: false
               }
            }
         }
      }
   ]
};

// Function to create a thumbnail with the option to stop it from being draggable
// When the thumbnail isn't draggable it can still be dragged but the browser treats it
// as a file (which enables us to check the DND upload highlighting!)
function getThumbnail(options) {
   var thumbnail = {
      id: options.id + "_THUMBNAIL",
      name: "alfresco/renderers/Thumbnail",
      config: {}
   };
   if (options.draggableThumbnail === true || options.draggableThumbnail === false)
   {
      thumbnail.config.isDraggable = options.draggableThumbnail;
   }
   if (options.thumbnailSuppress === true || options.thumbnailSuppress === false)
   {
      thumbnail.config.suppressDndUploading = options.thumbnailSuppress;
   }
   return thumbnail;
}

// Function to create a view with the options to configure DND upload hightlighting
// suppression, whether or not to make the thumbnail draggable and whether or not
// to set data directly on the view (so that it can be used outside of the list)
function getView(options) {
   //id, viewSuppress, isDraggable, setData, rowSuppress
   var view = {
      id: options.id + "_VIEW",
      name: "alfresco/lists/views/AlfListView",
      config: {
         widgets: [
            {
               id: options.id + "_ROW",
               name: "alfresco/lists/views/layouts/Row",
               config: {
                  widgets: [
                     {
                        id: options.id + "_CELL1",
                        name: "alfresco/lists/views/layouts/Cell",
                        config: {
                           widgets: [
                              getThumbnail(options)
                           ]
                        }
                     },
                     {
                        id: options.id + "_CELL2",
                        name: "alfresco/lists/views/layouts/Cell",
                        config: {
                           widgets: [
                              {
                                 id: options.id + "_NAME",
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
   };

   if (options.rowSuppress === true || options.rowSuppress === false)
   {
      view.config.widgets[0].config.suppressDndUploading = options.rowSuppress;
   }
   if (options.viewSuppress === true || options.viewSuppress === false)
   {
      view.config.suppressDndUploading = options.viewSuppress;
   }
   if (options.setData === true)
   {
      view.config.currentData = data;
   }
   return view;
}

// Function to create a list with the options to pass onto the getView and
// getThumbnail functions
function getList(options) {
   // id, listSuppress, viewSuppress, isDraggable, rowSuppress
   var list = {
      id: options.id,
      name: "alfresco/lists/AlfList",
      title: options.title,
      config: {
         currentData: data,
         widgets: [
            getView(options)
         ]
      }
   };
   if (options.listSuppress === true || options.listSuppress === false)
   {
      list.config.suppressDndUploading = options.listSuppress;
   }
   return list;
}

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
      }
   ],
   widgets: [
      {
         name: "alfresco/layout/UploadContainer",
         config: {
            proxyDragAndDropNode: [
               "#NOT_REALLY_AN_ID",
               "#LIST_TWO",
               "#LIST_ONE"
            ],
            widgets: [
               {
                  name: "alfresco/layout/AlfTabContainer",
                  config: {
                     widgets: [
                        getList({
                           id: "LIST_ONE",
                           title: "LIST ONE"
                        }),
                        getList({
                           id: "LIST_TWO",
                           title: "LIST TWO"
                        }),
                        getList({
                           id: "LIST_THREE",
                           title: "LIST THREE"
                        })
                     ]
                  }
               },
               {
                  name: "alfresco/logging/DebugLog"
               }
            ]
         }
      }
   ]
};