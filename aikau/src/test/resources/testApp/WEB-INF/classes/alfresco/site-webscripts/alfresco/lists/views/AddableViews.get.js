var addItemPayload = {
   dialogId: "ADD_ITEM_DIALOG",
   dialogTitle: "Add Item",
   formSubmissionTopic: "ALF_CRUD_CREATE",
   formSubmissionPayloadMixin: {
      url: "add"
   },
   formSubmissionGlobal: true,
   widgets: [
      {
         id: "DIALOG_NAME",
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
};

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
      "alfresco/services/CrudService",
      "alfresco/services/DialogService"
   ],
   widgets: [
      {
         id: "CREATE_BUTTON_1",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Add Item",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: addItemPayload
         }
      },
      {
         id: "SHOW_LIST_VIEW",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show List View",
            publishTopic: "ALF_DOCLIST_SELECT_VIEW",
            publishPayload: {
               value: "VIEW1",
               label: "View 1"
            }
         }
      },
      {
         id: "SHOW_GRID_VIEW",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show Grid View",
            publishTopic: "ALF_DOCLIST_SELECT_VIEW",
            publishPayload: {
               value: "gallery",
               label: "Gallery"
            }
         }
      },
      {
         id: "LIST",
         name: "alfresco/lists/AlfList",
         config: {
            loadDataPublishTopic: "ALF_CRUD_GET_ALL",
            loadDataPublishPayload: {
               url: "get"
            },
            widgets: [
               {
                  id: "VIEW",
                  name: "alfresco/lists/views/AlfListView",
                  config: {
                     viewSelectionConfig: {
                        label: "View 1",
                        value: "VIEW1"
                     },
                     widgets: [
                        {
                           id: "ROW",
                           name: "alfresco/lists/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    id: "CELL",
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             id: "LIST_PROPERTY",
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "name"
                                             }
                                          }
                                       ]
                                    }
                                 }
                              ]
                           }
                        }
                     ],
                     widgetsForAppendix: [
                        {
                           id: "ROW",
                           name: "alfresco/lists/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    id: "CELL",
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             id: "CREATE_BUTTON_2",
                                             name: "alfresco/buttons/AlfButton",
                                             config: {
                                                label: "Add Item",
                                                publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
                                                publishPayload: addItemPayload
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
                  id: "GRID",
                  name: "alfresco/documentlibrary/views/AlfGalleryView",
                  config: {
                     enableHighlighting: true,
                     widgets: [
                        {
                           id: "CELL_CONTAINER",
                           name: "alfresco/lists/views/layouts/CellContainer",
                           config: {
                              widgets: [
                                 {
                                    id: "PROPERTY",
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
                                    id: "CREATE_BUTTON_3",
                                    name: "alfresco/buttons/AlfButton",
                                    config: {
                                       label: "Add Item",
                                       publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
                                       publishPayload: addItemPayload
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
         name: "aikauTesting/mockservices/GeneralDataMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};