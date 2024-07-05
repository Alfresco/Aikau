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
      "alfresco/services/DocumentService",
      "alfresco/services/DialogService",
      "alfresco/services/CrudService",
      "alfresco/services/LightboxService"
   ],
   widgets:[
      {
         name: "alfresco/lists/AlfList",
         config: {
            currentData: {
               items: [
                  {
                     nodeRef: "workspace/SpacesStore/Landscape", // NOTE: To support SearchThumbnail
                     node: {
                        displayName: "Landscape",
                        nodeRef: "workspace/SpacesStore/Landscape",
                        properties: {
                           "cm:name": "Landscape"
                        }
                     }
                  },
                  {
                     nodeRef: "workspace/SpacesStore/Portrait", // NOTE: To support SearchThumbnail
                     node: {
                        displayName: "Portrait",
                        nodeRef: "workspace/SpacesStore/Portrait",
                        properties: {
                           "cm:name": "Portrait"
                        }
                     }
                  }
               ]
            },
            widgets: [
               {
                  name: "alfresco/lists/views/AlfListView",
                  config: {
                     widgetsForHeader: [
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              label: "Thumbnail (vertical alignment bottom)"
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              label: "Thumbnail (imgpreview with dimensions, cropped to fit and shadow)"
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              label: "GalleryThumbnail (stretched with dimensions)"
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              label: "GalleryThumbnail (with dimensions, maintain aspect ratio, bottom, left)"
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              label: "GalleryThumbnail (with dimensions, maintain aspect ratio, middle, right)"
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              label: "SearchThumbnail (default)"
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              label: "SmallThumbnail (default)"
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              label: "Gallery view (cropped to fit)"
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              label: "Gallery view (non-square with margin)"
                           }
                        }
                     ],
                     widgets: [
                        {
                           id: "ROW",
                           name: "alfresco/lists/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    id: "COL1",
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             id: "THUMB1",
                                             name: "alfresco/renderers/Thumbnail",
                                             config: {
                                                verticalAlignment: "BOTTOM"
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    id: "COL2",
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             id: "THUMB2",
                                             name: "alfresco/renderers/Thumbnail",
                                             config: {
                                                renditionName: "imgpreview",
                                                dimensions: {
                                                   w: "150px",
                                                   h: "150px",
                                                   margin: "2px"
                                                },
                                                hasShadow: true,
                                                cropToFit: true
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    id: "COL3",
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             id: "THUMB3",
                                             name: "alfresco/renderers/GalleryThumbnail",
                                             config: {
                                                dimensions: {
                                                   w: "200px",
                                                   h: "200px",
                                                   margin: 0
                                                },
                                                stretchToFit: true,
                                                cropToFit: false
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    id: "COL4",
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             id: "THUMB4",
                                             name: "alfresco/renderers/GalleryThumbnail",
                                             config: {
                                                dimensions: {
                                                   w: "300px"
                                                },
                                                horizontalAlignment: "LEFT",
                                                verticalAlignment: "BOTTOM",
                                                cropToFit: false
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    id: "COL5",
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             id: "THUMB5",
                                             name: "alfresco/renderers/GalleryThumbnail",
                                             config: {
                                                dimensions: {
                                                   w: "250px"
                                                },
                                                horizontalAlignment: "RIGHT",
                                                verticalAlignment: "MIDDLE",
                                                cropToFit: false
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    id: "COL6",
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             id: "THUMB6",
                                             name: "alfresco/search/SearchThumbnail"
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    id: "COL7",
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             id: "THUMB7",
                                             name: "alfresco/renderers/SmallThumbnail"
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    id: "COL8",
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             id: "THUMB8",
                                             name: "alfresco/renderers/GalleryThumbnail",
                                             config: {
                                                dimensions: {
                                                   w: "250px"
                                                }
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    id: "COL9",
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             id: "THUMB9",
                                             name: "alfresco/renderers/GalleryThumbnail",
                                             config: {
                                                dimensions: {
                                                   w: "300px",
                                                   h: "200px",
                                                   margin: "5px"
                                                },
                                                horizontalAlignment: "MIDDLE",
                                                verticalAlignment: "BOTTOM",
                                                cropToFit: false
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
         name: "aikauTesting/mockservices/ThumbnailsMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};