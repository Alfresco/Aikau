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
      }
   ],
   widgets: [
      {
         name: "alfresco/layout/TitleDescriptionAndContent",
         config: {
            title: "Create Custom Models",
            description: "Gap analysis page for CMM",
            widgets: [
               {
                  name: "alfresco/layout/VerticalWidgets",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/layout/HorizontalWidgets",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/html/Label",
                                    widthPx: 250,
                                    config: {
                                       label: "Select Fields"
                                    }
                                 },
                                 {
                                    id: "DRAG_PALETTE",
                                    name: "alfresco/creation/DragPalette",
                                    config: {
                                       widgetsForPalette: [
                                          {
                                             type: [ "widget" ],
                                             name: "Create Type",
                                             module: "alfresco/forms/Form",
                                             defaultConfig: {
                                                label: "Value1"
                                             },
                                             widgetsForConfig: [
                                                {
                                                   name: "alfresco/forms/controls/DojoValidationTextBox",
                                                   config: {
                                                      name: "defaultConfig.label",
                                                      label: "Field1",
                                                      value: "Value1"
                                                   }
                                                }
                                             ],
                                             previewWidget: false,
                                             widgetsForDisplay: [
                                                {
                                                   name: "alfresco/forms/controls/DojoValidationTextBox",
                                                   config: {
                                                      fieldId: "NAME",
                                                      label: "Type Name",
                                                      description: "The name of the type",
                                                      name: "name"
                                                   }
                                                },
                                                {
                                                   name: "alfresco/forms/controls/DojoValidationTextBox",
                                                   config: {
                                                      fieldId: "TITLE",
                                                      label: "Type Title",
                                                      description: "The displayed title of the type",
                                                      name: "name"
                                                   }
                                                },
                                                {
                                                   name: "alfresco/forms/controls/TextArea",
                                                   config: {
                                                      fieldId: "DESCRIPTION",
                                                      label: "Type Description",
                                                      description: "A description of the type",
                                                      name: "description"
                                                   }
                                                },
                                                {
                                                   name: "alfresco/creation/DropZone",
                                                   config: {
                                                      horizontal: false
                                                   }
                                                }
                                             ]
                                          },
                                          {
                                             type: [ "widget" ],
                                             name: "Create Aspect",
                                             module: "alfresco/forms/Form",
                                             defaultConfig: {
                                                label: "Value1"
                                             },
                                             widgetsForConfig: [
                                                {
                                                   name: "alfresco/forms/controls/DojoValidationTextBox",
                                                   config: {
                                                      name: "defaultConfig.label",
                                                      label: "Field1",
                                                      value: "Value1"
                                                   }
                                                }
                                             ],
                                             previewWidget: false,
                                             widgetsForDisplay: [
                                                {
                                                   name: "alfresco/creation/DropZone",
                                                   config: {
                                                      horizontal: false
                                                   }
                                                }
                                             ]
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
                                    id: "DRAG_PALETTE",
                                    name: "alfresco/creation/DragPalette",
                                    widthPx: 250,
                                    config: {
                                       widgetsForPalette: [
                                          {
                                             type: [ "widget" ],
                                             name: "String",
                                             module: "alfresco/forms/Form",
                                             defaultConfig: {
                                                label: "Value1"
                                             },
                                             widgetsForConfig: [
                                                {
                                                   name: "alfresco/forms/controls/DojoValidationTextBox",
                                                   config: {
                                                      name: "defaultConfig.label",
                                                      label: "Field1",
                                                      value: "Value1"
                                                   }
                                                }
                                             ],
                                             previewWidget: false,
                                             widgetsForDisplay: [
                                                {
                                                   name: "alfresco/forms/Form",
                                                   config: {
                                                      widgets: [
                                                         {
                                                            name: "alfresco/forms/controls/DojoValidationTextBox",
                                                            config: {
                                                               fieldId: "TITLE",
                                                               label: "Title",
                                                               description: "Display name of property",
                                                               name: "title"
                                                            }
                                                         },
                                                         {
                                                            name: "alfresco/forms/controls/DojoValidationTextBox",
                                                            config: {
                                                               fieldId: "NAME",
                                                               label: "Name",
                                                               description: "Unique reference name of property",
                                                               name: "name"
                                                            }
                                                         },
                                                         {
                                                            name: "alfresco/forms/controls/MultipleEntryFormControl",
                                                            config: {
                                                               fieldId: "CONSTRAINTS",
                                                               name: "constraints",
                                                               label: "Constraints",
                                                               descriptions: "Defines the acceptable values of the property",
                                                               useSimpleValues: false,
                                                               widgets: [
                                                                  {
                                                                     name: "alfresco/forms/controls/Select",
                                                                     config: {
                                                                        fieldId: "CONSTRAINT_TYPE",
                                                                        name: "value",
                                                                        label: "Constraint type",
                                                                        optionsConfig: {
                                                                           fixed: [
                                                                              {label:"Regular Expression",value:"REGEX"},
                                                                              {label:"Minimum Length",value:"MIN_LENGTH"},
                                                                              {label:"Maximum Length",value:"MAX_LENGTH"},
                                                                              {label:"Minimum Value",value:"MIN_VALUE"},
                                                                              {label:"Maximum Value",value:"MAX_VALUE"}
                                                                           ]
                                                                        }
                                                                     }
                                                                  }
                                                               ]
                                                            }
                                                         },
                                                      ]
                                                   }
                                                }
                                             ]
                                          },
                                          {
                                             type: [ "widget" ],
                                             name: "Text line",
                                             module: "alfresco/forms/Form",
                                             defaultConfig: {
                                                label: "Value1"
                                             },
                                             widgetsForConfig: [
                                                {
                                                   name: "alfresco/forms/controls/DojoValidationTextBox",
                                                   config: {
                                                      name: "defaultConfig.label",
                                                      label: "Field1",
                                                      value: "Value1"
                                                   }
                                                }
                                             ],
                                             previewWidget: false,
                                             widgetsForDisplay: [
                                                {
                                                   name: "alfresco/creation/DropZone",
                                                   config: {
                                                      horizontal: false
                                                   }
                                                }
                                             ]
                                          },
                                          {
                                             type: [ "widget" ],
                                             name: "Text box",
                                             module: "alfresco/forms/Form",
                                             defaultConfig: {
                                                label: "Value1"
                                             },
                                             widgetsForConfig: [
                                                {
                                                   name: "alfresco/forms/controls/DojoValidationTextBox",
                                                   config: {
                                                      name: "defaultConfig.label",
                                                      label: "Field1",
                                                      value: "Value1"
                                                   }
                                                }
                                             ],
                                             previewWidget: false,
                                             widgetsForDisplay: [
                                                {
                                                   name: "alfresco/creation/DropZone",
                                                   config: {
                                                      horizontal: false
                                                   }
                                                }
                                             ]
                                          },
                                          {
                                             type: [ "widget" ],
                                             name: "Number",
                                             module: "alfresco/forms/Form",
                                             defaultConfig: {
                                                label: "Value1"
                                             },
                                             widgetsForConfig: [
                                                {
                                                   name: "alfresco/forms/controls/DojoValidationTextBox",
                                                   config: {
                                                      name: "defaultConfig.label",
                                                      label: "Field1",
                                                      value: "Value1"
                                                   }
                                                }
                                             ],
                                             previewWidget: false,
                                             widgetsForDisplay: [
                                                {
                                                   name: "alfresco/creation/DropZone",
                                                   config: {
                                                      horizontal: false
                                                   }
                                                }
                                             ]
                                          },
                                          {
                                             type: [ "widget" ],
                                             name: "Date",
                                             module: "alfresco/forms/Form",
                                             defaultConfig: {
                                                label: "Value1"
                                             },
                                             widgetsForConfig: [
                                                {
                                                   name: "alfresco/forms/controls/DojoValidationTextBox",
                                                   config: {
                                                      name: "defaultConfig.label",
                                                      label: "Field1",
                                                      value: "Value1"
                                                   }
                                                }
                                             ],
                                             previewWidget: false,
                                             widgetsForDisplay: [
                                                {
                                                   name: "alfresco/creation/DropZone",
                                                   config: {
                                                      horizontal: false
                                                   }
                                                }
                                             ]
                                          },
                                          {
                                             type: [ "widget" ],
                                             name: "Date and Time",
                                             module: "alfresco/forms/Form",
                                             defaultConfig: {
                                                label: "Value1"
                                             },
                                             widgetsForConfig: [
                                                {
                                                   name: "alfresco/forms/controls/DojoValidationTextBox",
                                                   config: {
                                                      name: "defaultConfig.label",
                                                      label: "Field1",
                                                      value: "Value1"
                                                   }
                                                }
                                             ],
                                             previewWidget: false,
                                             widgetsForDisplay: [
                                                {
                                                   name: "alfresco/creation/DropZone",
                                                   config: {
                                                      horizontal: false
                                                   }
                                                }
                                             ]
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    id: "FORM",
                                    name: "alfresco/forms/Form",
                                    config: {
                                       scopeFormControls: false,
                                       showOkButton: false,
                                       showCancelButton: false,
                                       widgets: [
                                          {
                                             id: "ROOT_DROP_ZONE",
                                             name: "alfresco/forms/controls/DropZoneControl",
                                             config: {
                                                // label: "Widgets",
                                                name: "widgets",
                                                value: null,
                                                acceptTypes: ["widget"]
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
                                    name: "alfresco/html/Label",
                                    widthPx: 250,
                                    config: {
                                       label: "&nbsp;"
                                    }
                                 },
                                 {
                                    name: "alfresco/layout/LeftAndRight",
                                    config: {
                                       widgets: [
                                          {
                                             name: "alfresco/buttons/AlfButton",
                                             align: "left",
                                             config: {
                                                label: "Delete"
                                             }
                                          },
                                          {
                                             name: "alfresco/buttons/AlfButton",
                                             align: "right",
                                             config: {
                                                label: "Save Draft"
                                             }
                                          },
                                          {
                                             name: "alfresco/buttons/AlfButton",
                                             align: "right",
                                             config: {
                                                label: "Active"
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
      

               
               // {
               //    name: "alfresco/creation/WidgetConfig",
               //    widthPc: 33
               // }
            
   ]
};