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
                           additionalCssClasses: "custom-wrapper-class",
                           showEditButton: true,
                           label: "{label}",
                           value: "{value}",
                           widgets: [
                              {
                                 name: "alfresco/dnd/DroppedItemWidgets",
                                 config: {
                                    additionalCssClasses: "custom-item-class"
                                 }
                              }
                           ],
                           editPublishTopic: "EDIT_ITEM"
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
         name: "alfresco/layout/HorizontalWidgets",
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
                        }
                     ]
                  }
               },
               {
                  id: "FORM",
                  name: "alfresco/forms/Form",
                  config: {
                     scopeFormControls: false,
                     okButtonLabel: "Save",
                     okButtonPublishTopic: "FORM_POST",
                     okButtonPublishGlobal: true,
                     showCancelButton: false,
                     widgets: [
                        {
                           id: "ROOT_DROPPED_ITEMS",
                           name: "alfresco/forms/controls/DragAndDropTargetControl",
                           config: {
                              label: "Widgets",
                              name: "widgets",
                              value: [
                                 {
                                    label: "Test",
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
               },
               {
                  name: "alfresco/forms/DynamicForm",
                  config: {
                     subscriptionTopic: "EDIT_ITEM",
                     formWidgetsProperty: "widgets",
                     formWidetsPropertyStringified: false,
                     formValueProperty: "formValue",
                     okButtonPublishGlobal: true
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