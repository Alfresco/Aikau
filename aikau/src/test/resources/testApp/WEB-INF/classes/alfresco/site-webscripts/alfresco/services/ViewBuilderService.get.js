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
      "alfresco/services/DialogService",
      "alfresco/services/ViewBuilderService"
   ],
   widgets:[
      {
         id: "ADD_PROPERTY_BUTTON",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Add Property",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "VIEW_BUILDER_ADD_PROPERTY_DIALOG",
               dialogTitle: "Add Property to View",
               formSubmissionTopic: "ALF_VIEW_BUILDER_ADD_VIEW_PROP",
               formSubmissionGlobal: true,
               formSubmissionPayloadMixin: {
                  viewId: "TEST"
               },
               widgets: [
                  {
                     id: "PROP_NAME",
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        name: "propName",
                        label: "Property",
                        value: "",
                        requirementConfig: {
                           initialValue: true
                        }
                     }
                  },
                  {
                     id: "PROP_LABEL",
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        name: "propLabel",
                        label: "Label",
                        value: "",
                        requirementConfig: {
                           initialValue: true
                        }
                     }
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/lists/AlfList",
         config: {
            loadDataPublishTopic: "ALF_VIEW_BUILDER_GET_VIEW_PROPS",
            loadDataPublishPayload: {
               viewId: "TEST"
            },
            itemsProperty: "properties",
            noDataMessage: "No properties have been added to the view!",
            widgets: [
               {
                  name: "alfresco/lists/views/AlfListView",
                  config: {
                     additionalCssClasses: "bordered",
                     noItemsMessage: "No properties have been added to the view!",
                     widgetsForHeader: [
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              label: "",
                              sortable: false
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              label: "Label",
                              sortable: false
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              label: "Name",
                              sortable: false
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/HeaderCell",
                           config: {
                              label: "",
                              sortable: false
                           }
                        }
                     ],
                     widgets: [
                        {
                           name: "alfresco/lists/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/documentlibrary/views/layouts/Cell",
                                    config: {
                                       additionalCssClasses: "mediumpad",
                                       width: "50px",
                                       widgets: [
                                          {
                                             id: "PROPERTY_REORDER",
                                             name: "alfresco/renderers/Reorder",
                                             config: {
                                                propertyToRender: "propName",
                                                moveUpPublishTopic: "ALF_VIEW_BUILDER_MOVE_PROP",
                                                moveUpPublishPayloadItemMixin: true,
                                                moveUpPublishPayload: {
                                                   direction: "UP",
                                                   viewId: "TEST"
                                                },
                                                moveDownPublishTopic: "ALF_VIEW_BUILDER_MOVE_PROP",
                                                moveDownPublishPayloadItemMixin: true,
                                                moveDownPublishPayload: {
                                                   direction: "DOWN",
                                                   viewId: "TEST"
                                                }
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       additionalCssClasses: "mediumpad",
                                       widgets: [
                                          {
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "propLabel"
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       additionalCssClasses: "mediumpad",
                                       widgets: [
                                          {
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "propName"
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       additionalCssClasses: "mediumpad",
                                       widgets: [
                                          {
                                             name: "alfresco/renderers/PublishAction",
                                             config: {
                                                iconClass: "delete-16",
                                                propertyToRender: "propName",
                                                publishTopic: "ALF_VIEW_BUILDER_DELETE_VIEW_PROP",
                                                publishPayloadItemMixin: true,
                                                publishPayload: {
                                                   requiresConfirmation: true,
                                                   viewId: "TEST"
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
               }
            ]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};