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
      "alfresco/services/CrudService"
   ],
   widgets: [
      {
         id: "LIST",
         name: "alfresco/lists/AlfList",
         config: {
            loadDataPublishTopic: "ALF_CRUD_GET_ALL",
            loadDataPublishPayload: {
               url: "resources"
            },
            widgets: [
               {
                  name: "alfresco/documentlibrary/views/AlfGalleryView",
                  config: {
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
                                       name: "alfresco/layout/ClassicWindow",
                                       config: {
                                          title: "{name}"
                                       }
                                    }
                                 ]
                              },
                              publishPayloadType: "PROCESS",
                              publishPayloadModifiers: ["processCurrentItemTokens"],
                              publishPayloadItemMixin: true,
                              widgets: [
                                 {
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "name"
                                    }
                                 }
                              ]
                           }
                        }
                     ],
                     widgetsForAppendix: [
                        {
                           id: "CELL_CONTAINER",
                           name: "alfresco/lists/views/layouts/CellContainer",
                           config: {
                              widgets: [
                                 {
                                    id: "ADD_ITEM_BUTTON",
                                    name: "alfresco/buttons/AlfButton",
                                    config: {
                                       label: "Add Tag",
                                       publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
                                       publishPayload: {
                                          dialogId: "ADD_ITEM_DIALOG",
                                          dialogTitle: "Add Tag",
                                          formSubmissionTopic: "ALF_CRUD_CREATE",
                                          formSubmissionPayloadMixin: {
                                             url: "api/tag/workspace/SpacesStore",
                                             createdItemKey: "nodeRef"
                                          },
                                          formSubmissionGlobal: true,
                                          widgets: [
                                             {
                                                id: "NEW_ITEM_NAME",
                                                name: "alfresco/forms/controls/TextBox",
                                                config: {
                                                   name: "name",
                                                   label: "Name",
                                                   value: "",
                                                   placeHolder: "Name",
                                                   requirementConfig: {
                                                      initialValue: true
                                                   }
                                                }
                                             }
                                          ]
                                       }
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
         name: "aikauTesting/mockservices/DataMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};