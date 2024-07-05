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
      "alfresco/services/DocumentService"
   ],
   widgets: [
      {
         name: "alfresco/layout/VerticalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Defaults",
                     widgets: [
                         {
                           name: "alfresco/documentlibrary/AlfDocument",
                           config: {
                              nodeRef: "workspace://SpacesStore/50e8fa78-86ee-4209-9de0-b5c996b7ee52",
                              widgets: [
                                 {
                                    id: "DEFAULTS",
                                    name: "alfresco/node/MetadataGroups",
                                    config: {
                                       groups: [
                                          {
                                             id: "AUDIO",
                                             title: "audio.group.label",
                                             widgets: [
                                                {
                                                   id: "ARTIST",
                                                   label: "audio.property.artist.label",
                                                   name: "alfresco/renderers/Property",
                                                   config: {
                                                      propertyToRender: "node.properties.audio:artist"
                                                   }
                                                },
                                                {
                                                   id: "GENRE",
                                                   label: "Genre",
                                                   name: "alfresco/renderers/Property",
                                                   config: {
                                                      propertyToRender: "node.properties.audio:genre"
                                                   }
                                                },
                                                {
                                                   label: "Channel Type",
                                                   name: "alfresco/renderers/InlineEditProperty",
                                                   config: {
                                                      propertyToRender: "node.properties.audio:channelType",
                                                      permissionProperty: "node.permissions.user.Write"
                                                   }
                                                }
                                             ]
                                          },
                                          {
                                             title: "General",
                                             widgets: [
                                                {
                                                   label: "Last modified",
                                                   name: "alfresco/renderers/Property",
                                                   config: {
                                                      propertyToRender: "node.properties.cm:modified"
                                                   }
                                                },
                                                {
                                                   label: "Won't exist",
                                                   name: "alfresco/renderers/Property",
                                                   config: {
                                                      propertyToRender: "moomin"
                                                   }
                                                }
                                             ]
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
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Custom Dimensions",
                     widgets: [
                         {
                           name: "alfresco/documentlibrary/AlfDocument",
                           config: {
                              nodeRef: "workspace://SpacesStore/50e8fa78-86ee-4209-9de0-b5c996b7ee52",
                              widgets: [
                                 {
                                    id: "CUSTOM",
                                    name: "alfresco/node/MetadataGroups",
                                    config: {
                                       additionalCssClasses: "alf-rounded-border",
                                       separated: true,
                                       width: "500px",
                                       labelToValueRatio: 40,
                                       groups: [
                                          {
                                             id: "AUDIO",
                                             title: "Audio Details",
                                             widgets: [
                                                {
                                                   id: "ARTIST",
                                                   label: "Artist",
                                                   name: "alfresco/renderers/Property",
                                                   config: {
                                                      propertyToRender: "node.properties.audio:artist"
                                                   }
                                                },
                                                {
                                                   label: "Genre",
                                                   name: "alfresco/renderers/Property",
                                                   config: {
                                                      propertyToRender: "node.properties.audio:genre"
                                                   }
                                                },
                                                {
                                                   label: "Channel Type",
                                                   name: "alfresco/renderers/InlineEditProperty",
                                                   config: {
                                                      propertyToRender: "node.properties.audio:channelType",
                                                      permissionProperty: "node.permissions.user.Write"
                                                   }
                                                }
                                             ]
                                          },
                                          {
                                             title: "General",
                                             widgets: [
                                                {
                                                   label: "Last modified",
                                                   name: "alfresco/renderers/Property",
                                                   config: {
                                                      propertyToRender: "node.properties.cm:modified"
                                                   }
                                                }
                                             ]
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
         name: "aikauTesting/mockservices/PreviewMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};