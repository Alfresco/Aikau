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
         id: "VIEW",
         name: "alfresco/lists/views/AlfListView",
         config: {
            currentData: {
               items: [
                  {
                     id: "1",
                     label: "rhubarb",
                     value: "custard"
                  },
                  {
                     id: "2",
                     label: "strawberries",
                     value: "cream"
                  }
               ]
            },
            widgets: [
               {
                  name: "alfresco/lists/views/layouts/EditableRow",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/lists/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "label"
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "value"
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/renderers/PublishAction",
                                    config: {
                                       iconClass: "edit-16",
                                       publishTopic: "ALF_EDITABLE_ROW_EDIT_MODE",
                                       publishPayload: {
                                          editMode: true
                                       }
                                    }
                                 }
                              ]
                           }
                        }
                     ],
                     widgetsForEditMode: [
                        {
                           name: "alfresco/forms/Form",
                           config: {
                              okButtonPublishTopic: "ALF_EDITABLE_ROW_READ_MODE_SAVE",
                              cancelButtonPublishTopic: "ALF_EDITABLE_ROW_READ_MODE_CANCEL",
                              widgets: [
                                 {
                                    id: "LABEL_FIELD",
                                    name: "alfresco/forms/controls/TextBox",
                                    config: {
                                       name: "label",
                                       label: "Label",
                                       value: "{label}"
                                    }
                                 },
                                 {
                                    id: "VALUE_FIELD",
                                    name: "alfresco/forms/controls/TextBox",
                                    config: {
                                       name: "value",
                                       label: "Value",
                                       value: "{value}"
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
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};