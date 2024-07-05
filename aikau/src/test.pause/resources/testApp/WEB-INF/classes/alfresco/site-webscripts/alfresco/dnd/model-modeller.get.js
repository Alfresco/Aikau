<import resource="classpath:alfresco/site-webscripts/org/alfresco/aikau/{aikauVersion}/libs/dnd-models/forms.lib.js">
<import resource="classpath:alfresco/site-webscripts/org/alfresco/aikau/{aikauVersion}/libs/dnd-models/TabbedFormControls.lib.js">
<import resource="classpath:alfresco/site-webscripts/org/alfresco/aikau/{aikauVersion}/libs/dnd-models/FormControlTab.lib.js">
<import resource="classpath:alfresco/site-webscripts/org/alfresco/aikau/{aikauVersion}/libs/dnd-models/dnd.lib.js">

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
               getDefaultFormControlModel(),
               getDefaultDragAndDropTargetModel(),
               getDefaultDroppedNestingItemWrapperModel(),
               getDefaultTabbedFormControlsModel(),
               getDefaultFormControlTabModel()
            ]
         }
      },
      "alfresco/services/DialogService",
      "alfresco/services/DragAndDropModelCreationService",
      "alfresco/services/OptionsService"
   ],
   widgets: [
      {
         name: "alfresco/layout/TitleDescriptionAndContent",
         config: {
            title: "Modelling Service Modeller",
            description: "This page can be used to create a drag-and-drop modelling service configuration that can be used for building other drag-and-drop configuration pages",
            widgets: [
               {
                  name: "alfresco/layout/HorizontalWidgets",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/layout/ClassicWindow",
                           config: {
                              title: "Main Configuration Preview",
                              widgets: [
                                 {
                                    name: "alfresco/prototyping/Preview",
                                    config: {
                                       pubSubScope: "MAIN_"
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           name: "alfresco/layout/ClassicWindow",
                           config: {
                              title: "Nested Configuration Preview",
                              widgets: [
                                 {
                                    name: "alfresco/prototyping/Preview",
                                    config: {
                                       pubSubScope: "NESTED_"
                                    }
                                 }
                              ]
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
                           name: "alfresco/layout/ClassicWindow",
                           widthPx: 300,
                           config: {
                              title: "Palette",
                              widgets: [
                                 {
                                    id: "DRAG_PALETTE",
                                    name: "alfresco/dnd/DragAndDropItems",
                                    config: {
                                       items: [
                                          {
                                             type: [ "widget" ],
                                             label: "Tabbed Form Controls",
                                             value: {
                                                name: "alfresco/forms/TabbedControls",
                                                config: {
                                                   useModellingService: true,
                                                   label: "Widgets",
                                                   targetProperty: "config.widgets"
                                                }
                                             }
                                          },
                                          {
                                             type: [ "widget" ],
                                             label: "Form Control Tab",
                                             value: {
                                                name: "alfresco/forms/ControlColumn",
                                                config: {
                                                   useModellingService: true,
                                                   label: "Widgets",
                                                   targetProperty: "config.widgets"
                                                }
                                             }
                                          },
                                          {
                                             type: [ "widget" ],
                                             label: "Form Control",
                                             value: {
                                                name: "alfresco/forms/controls/TextBox",
                                                config: {
                                                   label: "No Label",
                                                   description: "No description",
                                                   value: ""
                                                }
                                             }
                                          },
                                          {
                                             type: [ "widget" ],
                                             label: "Nested item wrapper",
                                             value: {
                                                name: "alfresco/dnd/DroppedNestingItemWrapper",
                                                config: {
                                                   label: "{label}",
                                                   value: "{value}",
                                                   widgets: "{widgets}"
                                                }
                                             }
                                          },
                                          {
                                             type: [ "widget" ],
                                             label: "Drop Target",
                                             value: {
                                                name: "alfresco/dnd/DragAndDropNestedTarget",
                                                config: {
                                                   useModellingService: true,
                                                   label: "Widgets",
                                                   targetProperty: "config.widgets"
                                                }
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
                              title: "Model Configuration",
                              widgets: [
                                 {
                                    id: "FORM1",
                                    name: "alfresco/forms/Form",
                                    config: {
                                       scopeFormControls: false,
                                       okButtonLabel: "Save",
                                       okButtonPublishTopic: "FORM1_POST",
                                       okButtonPublishGlobal: true,
                                       showOkButton: false,
                                       showCancelButton: false,
                                       widgets: [
                                          {
                                             id: "MODEL_NAME",
                                             name: "alfresco/forms/controls/TextBox",
                                             config: {
                                                fieldId: "MODEL_NAME",
                                                label: "Model name",
                                                description: "The name of the model that is being built. This will be used to a the names of the exported files, e.g. <model name>.lib.js and <model name>.lib.properties.",
                                                name: "modelName",
                                                placeHolder: "Name of model...",
                                                requirementConfig: {
                                                   initialValue: true
                                                }
                                             }
                                          },
                                          {
                                             id: "NLS_PREFIX",
                                             name: "alfresco/forms/controls/TextBox",
                                             config: {
                                                fieldId: "NLS_PREFIX",
                                                label: "NLS Key Prefix",
                                                description: "This is the prefix to apply to all the generated NLS keys.",
                                                name: "nlsPrefix",
                                                placeHolder: "Prefix...",
                                                requirementConfig: {
                                                   initialValue: true
                                                },
                                                validationConfig: [
                                                   {
                                                      validation: "regex",
                                                      regex: "^[a-z]+(.[a-z]+)+$",
                                                      errorMessage: "Please use lower-case dot-notation pattern"
                                                   }
                                                ]
                                                
                                             }
                                          },
                                          {
                                             id: "PROPERTY",
                                             name: "alfresco/forms/controls/TextBox",
                                             config: {
                                                fieldId: "PROPERTY",
                                                label: "Property to compare",
                                                description: "This is the (dot-notataion) property within the dropped item that should be compared against the list of matching target patterns.",
                                                name: "property",
                                                placeHolder: "Target property...",
                                                requirementConfig: {
                                                   initialValue: true
                                                }
                                             }
                                          },
                                          {
                                             id: "TARGET_VALUES",
                                             name: "alfresco/forms/controls/MultipleEntryFormControl",
                                             config: {
                                                fieldId: "TARGET_VALUES",
                                                name: "targetValues",
                                                value: "",
                                                label: "Target Values",
                                                description: "This is the list of values that should be compared against the property to compare in the dropped item. If the property in the dropped item matches any of these target values then this model will be applicable.",
                                                useSimpleValues: true,
                                                widgets: [
                                                   {
                                                      name: "alfresco/forms/controls/TextBox",
                                                      config: {
                                                         name: "value",
                                                         label: "Target value",
                                                         description: "A Regular Expression to try to match against the target property",
                                                         requirementConfig: {
                                                            initialValue: true
                                                         }
                                                      }
                                                   }
                                                ],
                                                requirementConfig: {
                                                   initialValue: true
                                                }
                                             }
                                          },
                                          {
                                             id: "WIDGETS_FOR_CONFIG",
                                             name: "alfresco/forms/controls/DragAndDropTargetControl",
                                             config: {
                                                label: "Main Configuration",
                                                description: "The form configuration to display when editing the item.",
                                                name: "widgetsForConfig",
                                                value: null,
                                                acceptTypes: ["widget"],
                                                useModellingService: true,
                                                widgetsForControl: [
                                                   {
                                                      name: "alfresco/dnd/DragAndDropFormControlTarget"
                                                   }
                                                ]
                                             }
                                          },
                                          {
                                             id: "WIDGETS_FOR_NESTED_CONFIG",
                                             name: "alfresco/forms/controls/DragAndDropTargetControl",
                                             config: {
                                                label: "Configuration for nested items",
                                                description: "The additional configuration to display when editing items dropped into this item.",
                                                name: "widgetsForNestedConfig",
                                                value: null,
                                                acceptTypes: ["widget"],
                                                useModellingService: true,
                                                widgetsForControl: [
                                                   {
                                                      name: "alfresco/dnd/DragAndDropFormControlTarget"
                                                   }
                                                ]
                                             }
                                          },
                                          {
                                             id: "WIDGETS_FOR_DISPLAY",
                                             name: "alfresco/forms/controls/DragAndDropTargetControl",
                                             config: {
                                                label: "Configuration to display dropped items",
                                                description: "The widgets that will represent the item when it is dropped onto the page.",
                                                name: "widgetsForDisplay",
                                                value: null,
                                                acceptTypes: ["widget"],
                                                useModellingService: true
                                             }
                                          }
                                       ],
                                       widgetsAdditionalButtons: [
                                          {
                                             name: "alfresco/buttons/AlfButton",
                                             config: {
                                                label: "Preview forms",
                                                publishTopic: "ALF_DND_PREVIEW_FORM_MODELS"
                                             }
                                          },
                                          {
                                             name: "alfresco/buttons/AlfButton",
                                             config: {
                                                label: "Export library files",
                                                publishTopic: "ALF_DND_EXPORT_MODEL_LIBRARY_FILES",
                                                publishGlobal: true
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
      }
   ]
};