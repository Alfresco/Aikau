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
                  targetValues: ["alfresco/layout/HorizontalWidgets"],
                  widgetsForConfig: [
                     {
                        id: "ALF_EDIT_FORM_CONTROL_LABEL",
                        name: "alfresco/forms/controls/NumberSpinner",
                        config: {
                           fieldId: "MARGINS_LEFT",
                           label: "Margins Left",
                           name: "config.widgetMarginLeft"
                        }
                     },
                     {
                        id: "ALF_EDIT_FORM_CONTROL_DESCRIPTION",
                        name: "alfresco/forms/controls/NumberSpinner",
                        config: {
                           fieldId: "MARGINS_RIGHT",
                           label: "Margins Right",
                           name: "config.widgetMarginRight",
                           value: 0
                        }
                     }
                  ],
                  widgetsForNestedConfig: [
                     {
                        id: "ALF_EDIT_FORM_CONTROL_LABEL",
                        name: "alfresco/forms/controls/NumberSpinner",
                        config: {
                           fieldId: "WIDTH_PX",
                           label: "Width (in pixels",
                           name: "config.widthPx",
                           value: 0
                        }
                     }
                  ],
                  widgetsForDisplay: [
                     {
                        name: "alfresco/dnd/DroppedNestingItemWrapper",
                        config: {
                           showEditButton: true,
                           label: "{label}",
                           value: "{value}",
                           widgets: [
                              {
                                 name: "alfresco/dnd/DragAndDropNestedTarget",
                                 config: {
                                    useModellingService: true,
                                    label: "Widgets", // TODO: NLS
                                    targetProperty: "config.widgets"
                                 }
                              }
                           ]
                        }
                     }
                  ]
               },
               {
                  property: "name",
                  targetValues: ["alfresco/layout/VerticalWidgets"],
                  widgetsForConfig: [
                     {
                        id: "ALF_EDIT_FORM_CONTROL_LABEL",
                        name: "alfresco/forms/controls/NumberSpinner",
                        config: {
                           fieldId: "MARGINS_LEFT",
                           label: "Margins Left",
                           name: "config.widgetMarginTop"
                        }
                     },
                     {
                        id: "ALF_EDIT_FORM_CONTROL_DESCRIPTION",
                        name: "alfresco/forms/controls/NumberSpinner",
                        config: {
                           fieldId: "MARGINS_RIGHT",
                           label: "Margins Right",
                           name: "config.widgetMarginBottom",
                           value: 0
                        }
                     }
                  ],
                  widgetsForDisplay: [
                     {
                        name: "alfresco/dnd/DroppedNestingItemWrapper",
                        config: {
                           showEditButton: true,
                           label: "{label}",
                           value: "{value}",
                           widgets: [
                              {
                                 name: "alfresco/dnd/DroppedItem",
                                 config: {
                                    label: "Vertical Widgets"
                                 }
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
                           label: "Horizontal Widgets",
                           value: {
                              name: "alfresco/layout/HorizontalWidgets",
                              config: {
                                
                              }
                           }
                        },
                        {
                           type: [ "widget" ],
                           label: "Vertical Widgets",
                           value: {
                              name: "alfresco/layout/VerticalWidgets",
                              config: {
                                
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
                                       label: "Data",
                                       name: "data",
                                       value: [
                                          {
                                             label: "Horizontal Widgets",
                                             name: "alfresco/layout/HorizontalWidgets",
                                             config: {
                                                widgetMarginLeft: 7,
                                                widgetMarginRight: 6,
                                                widgets: [
                                                   {
                                                      label: "Vertical Widgets",
                                                      name: "alfresco/layout/VerticalWidgets",
                                                      config: {
                                                         widgetMarginTop: 5,
                                                         widgetMarginBottom: 4,
                                                         widthPx: 3
                                                      }
                                                   }
                                                ]
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
         name: "alfresco/logging/DebugLog"
      }
   ]
};