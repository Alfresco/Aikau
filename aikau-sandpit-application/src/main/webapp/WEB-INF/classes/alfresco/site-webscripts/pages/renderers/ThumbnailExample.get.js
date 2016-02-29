<import resource="classpath:alfresco/site-webscripts/imports/sandpit.lib.js">

buildPageModel({
   title: "page.title",
   description: "page.description",
   jsdoc: "https://dev.alfresco.com/resource/docs/aikau-jsdoc/Thumbnail.html",
   services: [
      "alfresco/services/DocumentService",
      "alfresco/services/LightboxService"
   ],
   mockXhrWidgets: [
      {
         name: "sandpit/mockdata/PreviewMockXhr"
      }
   ],
   examples: [
      {
         title: "example1.title",
         description: "example1.description",
         model: [
            {
               name: "alfresco/layout/HorizontalWidgets",
               config: {
                  widgets: [
                     {
                        widthPx: 120,
                        name: "alfresco/renderers/Thumbnail",
                        config: {
                           currentItem: {
                              nodeRef: "workspace/SpacesStore/Landscape",
                              node: {
                                 displayName: "Landscape",
                                 nodeRef: "workspace/SpacesStore/Landscape",
                                 properties: {
                                    "cm:name": "Landscape"
                                 }
                              }
                           },
                           verticalAlignment: "BOTTOM",
                           horizontalAlignment: "MIDDLE",
                           dimensions: {
                              w: "100px",
                              h: "100px",
                              margin: "2px"
                           },
                        }
                     },
                     {
                        widthPx: 120,
                        name: "alfresco/renderers/Thumbnail",
                        config: {
                           currentItem: {
                              nodeRef: "workspace/SpacesStore/Portrait",
                              node: {
                                 displayName: "Portrait",
                                 nodeRef: "workspace/SpacesStore/Portrait",
                                 properties: {
                                    "cm:name": "Portrait"
                                 }
                              }
                           },
                           verticalAlignment: "BOTTOM",
                           horizontalAlignment: "MIDDLE",
                           dimensions: {
                              w: "100px",
                              h: "100px",
                              margin: "2px"
                           },
                        }
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "example2.title",
         description: "example2.description",
         model: [
            {
               name: "alfresco/layout/HorizontalWidgets",
               config: {
                  widgets: [
                     {
                        name: "alfresco/renderers/Thumbnail",
                        config: {
                           currentItem: {
                              nodeRef: "workspace/SpacesStore/Landscape",
                              node: {
                                 displayName: "Landscape",
                                 nodeRef: "workspace/SpacesStore/Landscape",
                                 properties: {
                                    "cm:name": "Landscape"
                                 }
                              }
                           },
                           renditionName: "imgpreview",
                           dimensions: {
                              w: "150px",
                              h: "150px",
                              margin: "2px"
                           },
                           hasShadow: true,
                           cropToFit: true
                        }
                     },
                     {
                        name: "alfresco/renderers/Thumbnail",
                        config: {
                           currentItem: {
                              nodeRef: "workspace/SpacesStore/Portrait",
                              node: {
                                 displayName: "Portrait",
                                 nodeRef: "workspace/SpacesStore/Portrait",
                                 properties: {
                                    "cm:name": "Portrait"
                                 }
                              }
                           },
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
            }
         ]
      },
      {
         title: "example3.title",
         description: "example3.description",
         model: [
            {
               name: "alfresco/layout/HorizontalWidgets",
               config: {
                  widgets: [
                     {
                        name: "alfresco/renderers/Thumbnail",
                        config: {
                           currentItem: {
                              nodeRef: "workspace/SpacesStore/Landscape",
                              node: {
                                 displayName: "Landscape",
                                 nodeRef: "workspace/SpacesStore/Landscape",
                                 properties: {
                                    "cm:name": "Landscape"
                                 }
                              }
                           },
                           renditionName: "imgpreview",
                           dimensions: {
                              w: "200px",
                              h: "200px",
                              margin: 0
                           },
                           stretchToFit: true,
                           cropToFit: false
                        }
                     },
                     {
                        name: "alfresco/renderers/Thumbnail",
                        config: {
                           currentItem: {
                              nodeRef: "workspace/SpacesStore/Portrait",
                              node: {
                                 displayName: "Portrait",
                                 nodeRef: "workspace/SpacesStore/Portrait",
                                 properties: {
                                    "cm:name": "Portrait"
                                 }
                              }
                           },
                           renditionName: "imgpreview",
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
            }
         ]
      },
      {
         title: "example4.title",
         description: "example4.description",
         model: [
            {
               name: "alfresco/renderers/Thumbnail",
               config: {
                  currentItem: {
                     nodeRef: "workspace/SpacesStore/Landscape",
                     node: {
                        displayName: "Landscape",
                        nodeRef: "workspace/SpacesStore/Landscape",
                        properties: {
                           "cm:name": "Landscape"
                        }
                     }
                  },
                  renditionName: "imgpreview",
                  showDocumentPreview: true,
                  assumeRendition: true
               }
            }
         ]
      },
      {
         title: "example5.title",
         description: "example5.description",
         model: [
            {
               name: "alfresco/renderers/Selector",
               config: {
                  currentItem: {
                     nodeRef: "workspace/SpacesStore/Landscape",
                     node: {
                        nodeRef: "workspace/SpacesStore/Landscape"
                     }
                  }
               }
            },
            {
               name: "alfresco/renderers/Thumbnail",
               config: {
                  currentItem: {
                     nodeRef: "workspace/SpacesStore/Landscape",
                     node: {
                        displayName: "Landscape",
                        nodeRef: "workspace/SpacesStore/Landscape",
                        properties: {
                           "cm:name": "Landscape"
                        }
                     }
                  },
                  renditionName: "imgpreview",
                  dimensions: {
                     w: "200px",
                     h: "200px",
                     margin: 0
                  },
                  updateOnSelection: true,
                  selectOnClick: true,
                  onlySelectOnClick: true,
                  cropToFit: true,
                  stretchToFit: true
               }
            }
         ]
      },
      {
         title: "example6.title",
         description: "example6.description",
         model: [
            {
               name: "alfresco/renderers/Thumbnail",
               config: {
                  currentItem: {
                     nodeRef: "workspace/SpacesStore/Landscape",
                     node: {
                        displayName: "Landscape",
                        nodeRef: "workspace/SpacesStore/Landscape",
                        properties: {
                           "cm:name": "Landscape"
                        }
                     }
                  },
                  renditionName: "imgpreview",
                  dimensions: {
                     w: "200px",
                     h: "200px",
                     margin: 0
                  },
                  publishTopic: "CUSTOM_TOPIC",
                  publishPayload: {
                     test: "value"
                  }
               }
            }
         ]
      }
   ]
});