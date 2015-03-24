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
      {
         name: "alfresco/services/DragAndDropModellingService",
         config: {
            models: [
               {
                  property: "name",
                  targetValues: ["alfresco/forms/controls/(.*)"],
                  widgetsForConfig: [
                     {
                        id: "ALF_EDIT_FORM_CONTROL_NAME",
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                           fieldId: "NAME",
                           name: "name",
                           visibilityConfig: {
                              initialValue: false
                           }
                        }
                     },
                     {
                        id: "ALF_EDIT_FORM_CONTROL_LABEL",
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                           fieldId: "LABEL",
                           label: "Label",
                           description: "The label for the form field value",
                           name: "config.label"
                        }
                     },
                     {
                        id: "ALF_EDIT_FORM_CONTROL_DESCRIPTION",
                        name: "alfresco/forms/controls/TextArea",
                        config: {
                           fieldId: "DESCRIPTION",
                           label: "Description",
                           description: "The description of the form field value",
                           name: "config.description"
                        }
                     },
                     {
                        id: "ALF_EDIT_FORM_CONTROL_VALUE",
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                           fieldId: "VALUE",
                           label: "Value",
                           description: "The initial value to assign the form field",
                           name: "config.value"
                        }
                     }
                  ],
                  widgetsForDisplay: [
                     {
                        name: "alfresco/dnd/DroppedItemWrapper",
                        config: {
                           label: "{label}",
                           value: "{value}",
                           widgets: [
                              {
                                 name: "alfresco/dnd/DroppedItemWidgets"
                              }
                           ]
                        }
                     }
                  ]
               }

            ]
         }
      },
      "alfresco/services/DialogService"
   ],
   widgets: [
      {
         name: "alfresco/layout/VerticalWidgets",
         config: {
            widgets: [
               {
                  id: "DRAG_PALETTE",
                  name: "alfresco/dnd/DragAndDropItems",
                  config: {
                     items: [
                        {
                           type: [ "widget" ],
                           label: "Text Area",
                           value: {
                              name: "alfresco/forms/controls/TextArea",
                              config: {
                                 label: "No Label",
                                 description: "No description",
                                 value: ""
                              }
                           }
                        },
                        {
                           type: [ "widget" ],
                           label: "Text Box",
                           value: {
                              name: "alfresco/forms/controls/TextBox",
                              config: {
                                 label: "No Label",
                                 description: "No description",
                                 value: ""
                              }
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/layout/HorizontalWidgets",
                  config: {
                     widgets: [
                        {
                           id: "FORM1",
                           name: "alfresco/forms/Form",
                           config: {
                              scopeFormControls: false,
                              okButtonLabel: "Save",
                              okButtonPublishTopic: "FORM1_POST",
                              okButtonPublishGlobal: true,
                              showCancelButton: false,
                              widgets: [
                                 {
                                    id: "ROOT_DROPPED_ITEMS1",
                                    name: "alfresco/forms/controls/DragAndDropTargetControl",
                                    config: {
                                       label: "Widgets",
                                       name: "widgets",
                                       value: null,
                                       acceptTypes: ["widget"],
                                       useModellingService: true
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           id: "FORM2",
                           name: "alfresco/forms/Form",
                           config: {
                              scopeFormControls: false,
                              okButtonLabel: "Save",
                              okButtonPublishTopic: "FORM2_POST",
                              okButtonPublishGlobal: true,
                              showCancelButton: false,
                              widgets: [
                                 {
                                    id: "ROOT_DROPPED_ITEMS2",
                                    name: "alfresco/forms/controls/DragAndDropTargetControl",
                                    config: {
                                       label: "Widgets",
                                       name: "widgets",
                                       value: [
                                          {
                                             name: "alfresco/forms/controls/TextArea",
                                             config: {
                                                label: "Preset label",
                                                description: "Preset Description",
                                                value: "Preset value"
                                             }
                                          }
                                       ],
                                       acceptTypes: ["widget"],
                                       useModellingService: true
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