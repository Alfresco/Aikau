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
         id: "TOOLBAR",
         name: "alfresco/documentlibrary/AlfToolbar"
      },
      {
         id: "DOCLIST",
         name: "alfresco/documentlibrary/AlfDocumentList",
         config: {
            useHash: false,
            additionalControlsTarget: "TOOLBAR",
            currentPageSize:40,
            widgets: [
               {
                  name: "alfresco/documentlibrary/views/AlfGalleryView",
                  config: {
                     columns: 10,
                     enableHighlighting: true,
                     itemKeyProperty: "nodeRef",
                     expandTopics: ["EXPAND"],
                     widgets: [
                        {
                           id: "CELL_CONTAINER",
                           name: "alfresco/lists/views/layouts/CellContainer",
                           config: {
                              publishTopic: "EXPAND",
                              publishPayload: {
                                 widgets: [
                                    {
                                       name: "alfresco/forms/Form",
                                       config: {
                                          showOkButton: true,
                                          okButtonPublishTopic: "POST",
                                          okButtonLabel: "Update",
                                          showCancelButton: false,
                                          value: "{node}",
                                          widgets: [
                                             {
                                                name: "alfresco/forms/controls/TextBox",
                                                config: {
                                                   label: "Name",
                                                   name: "properties.cm:name"
                                                }
                                             },
                                             {
                                                name: "alfresco/forms/controls/TextBox",
                                                config: {
                                                   label: "Title",
                                                   name: "properties.cm:title"
                                                }
                                             },
                                             {
                                                name: "alfresco/forms/controls/TextArea",
                                                config: {
                                                   label: "Description",
                                                   name: "properties.cm:description"
                                                }
                                             }
                                          ]
                                       }
                                    }
                                 ]
                              },
                              publishPayloadType: "PROCESS",
                              publishPayloadModifiers: ["processCurrentItemTokens"],
                              publishPayloadItemMixin: true,
                              widgets: [
                                 {
                                    id: "PROPERTY",
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "node.properties.cm:name"
                                       
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
         name: "aikauTesting/mockservices/NodesMockXhr",
         config: {
            totalItems: 40,
            folderRatio: [100]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};