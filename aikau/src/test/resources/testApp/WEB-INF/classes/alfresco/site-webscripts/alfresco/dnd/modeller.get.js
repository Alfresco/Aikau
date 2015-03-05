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
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                           fieldId: "LABEL",
                           label: "Label",
                           description: "Label to set on the TextBox",
                           name: "config.label"
                        }
                     },
                     {
                        name: "alfresco/forms/controls/TextArea",
                        config: {
                           fieldId: "DESCRIPTION",
                           label: "Description",
                           description: "The description of the TextBox value",
                           name: "config.description"
                        }
                     },
                     {
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                           fieldId: "VALUE",
                           label: "Value",
                           description: "The initial value to assign the text box",
                           name: "config.value"
                        }
                     }
                  ],
                  widgetsForDisplay: [
                     {
                        name: "alfresco/dnd/DroppedItemWrapper",
                        config: {
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
                           label: "Select Box",
                           value: {
                              name: "alfresco/forms/controls/Select",
                              config: {
                                 label: "Select",
                                 value: "select"
                              }
                           }
                        },
                        {
                           type: [ "widget" ],
                           label: "TextBox",
                           value: {
                              name: "alfresco/forms/controls/TextBox",
                              config: {
                                 name: "Textbox",
                                 label: "Moo"
                              }
                           }
                        }
                     ]
                  }
               },
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
                              label: "Data",
                              name: "data",
                              value: null,
                              acceptTypes: ["widget"],
                              useModellingService: true
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