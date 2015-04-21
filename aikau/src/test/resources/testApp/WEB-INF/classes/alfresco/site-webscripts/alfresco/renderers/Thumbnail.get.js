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
         id: "DOCLIB_RENDITIONS",
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Document Library Example (doclib rendition)",
            widgets: [
               {
                  name: "alfresco/documentlibrary/AlfDocumentList",
                  config: {
                     pubSubScope: "DOCLIB",
                     siteId: "swsdp",
                     containerId: "documentlibrary",
                     rootNode: null,
                     widgets: [
                        {
                           name: "alfresco/lists/views/AlfListView",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/lists/views/layouts/Row",
                                    config: {
                                       widgets: [
                                          {
                                             name: "alfresco/lists/views/layouts/Cell",
                                             config: {
                                                widgets: [
                                                   {
                                                      name: "alfresco/renderers/Thumbnail"
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
               }
            ]
         }
      },
      {
         id: "IMGPREVIEW_RENDITIONS",
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Document Library Example (imgpreview rendition, width fixed to 200px)",
            widgets: [
               {
                  name: "alfresco/documentlibrary/AlfDocumentList",
                  config: {
                     pubSubScope: "IMGPREVIEW",
                     siteId: "swsdp",
                     containerId: "documentlibrary",
                     rootNode: null,
                     widgets: [
                        {
                           name: "alfresco/lists/views/AlfListView",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/lists/views/layouts/Row",
                                    config: {
                                       widgets: [
                                          {
                                             name: "alfresco/lists/views/layouts/Cell",
                                             config: {
                                                widgets: [
                                                   {
                                                      name: "alfresco/renderers/Thumbnail",
                                                      config: {
                                                         renditionName: "imgpreview",
                                                         width: "200px",
                                                         publishTopic: "CUSTOM_CLICK_TOPIC",
                                                         publishPayloadType: "CURRENT_ITEM",
                                                         publishPayload: {},
                                                         publishGlobal: true
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
               }
            ]
         }
      },
      {
         id: "SEARCH_RESULTS",
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Search Results Example (doclib rendition)",
            widgets: [
               {
                  name: "alfresco/lists/AlfList",
                  config: {
                     pubSubScope: "SEARCH",
                     loadDataPublishTopic: "ALF_CRUD_GET_ALL",
                     loadDataPublishPayload: {
                       url: "slingshot/search"
                     },
                     itemsProperty: "items",
                     widgets: [
                        {
                           name: "alfresco/lists/views/AlfListView",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/lists/views/layouts/Row",
                                    config: {
                                       widgets: [
                                          {
                                             name: "alfresco/lists/views/layouts/Cell",
                                             config: {
                                                widgets: [
                                                   {
                                                      name: "alfresco/renderers/Thumbnail"
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
               }
            ]
         }
      },
      {
         id: "TASKS1",
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Tasks Results Example (assume rendition available, with preview)",
            widgets: [
               {
                  name: "alfresco/lists/AlfList",
                  config: {
                     pubSubScope: "TASKS1",
                     loadDataPublishTopic: "ALF_CRUD_GET_ALL",
                     loadDataPublishPayload: {
                       url: "slingshot/tasks"
                     },
                     itemsProperty: "task.resources",
                     widgets: [
                        {
                           name: "alfresco/lists/views/AlfListView",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/lists/views/layouts/Row",
                                    config: {
                                       widgets: [
                                          {
                                             name: "alfresco/lists/views/layouts/Cell",
                                             config: {
                                                widgets: [
                                                   {
                                                      name: "alfresco/renderers/Thumbnail",
                                                      config: {
                                                         assumeRendition: true,
                                                         showDocumentPreview: true
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
               }
            ]
         }
      },
      {
         id: "TASKS2",
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Tasks Results Example (no rendition assumption)",
            widgets: [
               {
                  name: "alfresco/lists/AlfList",
                  config: {
                     pubSubScope: "TASKS2",
                     loadDataPublishTopic: "ALF_CRUD_GET_ALL",
                     loadDataPublishPayload: {
                       url: "slingshot/tasks"
                     },
                     itemsProperty: "task.resources",
                     widgets: [
                        {
                           name: "alfresco/lists/views/AlfListView",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/lists/views/layouts/Row",
                                    config: {
                                       widgets: [
                                          {
                                             name: "alfresco/lists/views/layouts/Cell",
                                             config: {
                                                widgets: [
                                                   {
                                                      name: "alfresco/renderers/Thumbnail",
                                                      config: {}
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
               }
            ]
         }
      },
      {
         id: "HARDCODED",
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Hard-coded data, for PDF preview",
            widgets: [
               {
                  name: "alfresco/renderers/Thumbnail",
                  config: {
                     currentItem: {
                        nodeRef: "workspace://SpacesStore/26ae500c-91a9-496f-aca6-14101f985c28",
                        displayName: "Test PDF"
                     },
                     showDocumentPreview: true
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/ThumbnailsMockXhr"
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};