// Data object to use for the lists/views...
var data = {
   items: [
      {
         nodeRef: "workspace://SpacesStore/f8394454-0651-48a5-b583-d067c7d03339",
         type: "folder",
         name: "test1 & test2",
         displayName: "Normal result",
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
         size: 283746
      }
   ]
};

// Function to create a thumbnail with the option to stop it from being draggable
// When the thumbnail isn't draggable it can still be dragged but the browser treats it
// as a file (which enables us to check the DND upload highlighting!)
function getThumbnail(id, isDraggable) {
   var thumbnail = {
      id: id + "_THUMBNAIL",
      name: "alfresco/renderers/Thumbnail",
      config: {}
   };
   if (isDraggable === true || isDraggable === false)
   {
      thumbnail.config.isDraggable = isDraggable;
   }
   return thumbnail;
}

// Function to create a view with the options to configure DND upload hightlighting
// suppression, whether or not to make the thumbnail draggable and whether or not
// to set data directly on the view (so that it can be used outside of the list)
function getView(id, viewSuppress, isDraggable, setData) {
   var view = {
      id: id + "_VIEW",
      name: "alfresco/lists/views/AlfListView",
      config: {
         widgets: [
            {
               id: id + "_ROW",
               name: "alfresco/lists/views/layouts/Row",
               config: {
                  widgets: [
                     {
                        id: id + "_CELL",
                        name: "alfresco/lists/views/layouts/Cell",
                        config: {
                           widgets: [
                              getThumbnail(id, isDraggable),
                              {
                                 id: id + "_NAME",
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

   if (viewSuppress === true || viewSuppress === false)
   {
      view.config.suppressDndUploading = viewSuppress;
   }
   if (setData === true)
   {
      view.config.currentData = data;
   }
   return view;
}

// Function to create a list with the options to pass onto the getView and
// getThumbnail functions
function getList(id, listSuppress, viewSuppress, isDraggable) {
   var list = {
      id: id,
      name: "alfresco/lists/AlfList",
      config: {
         currentData: data,
         widgets: [
            getView(id, viewSuppress, isDraggable, false)
         ]
      }
   };
   if (listSuppress === true || listSuppress === false)
   {
      list.config.suppressDndUploading = listSuppress;
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
   widgets:[
      {
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "List (defaults)",
                     widgets: [
                        getList("NO_OVERRIDES")
                     ]
                  }
               },
               {
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "List (no suppression, no dragging)",
                     widgets: [
                        getList("FULLY_SUPPRESSED", false, false, false)
                     ]
                  }
               },
               {
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "View (defaults)",
                     widgets: [
                        getView("JUST", null, null, true)
                     ]
                  }
               },
               {
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "View (no suppression, no dragging)",
                     widgets: [
                        getView("NO_VIEW_DRAG", false, false, true)
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