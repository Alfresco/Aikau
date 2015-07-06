var value = [
 {
   name: "A",
   label: "A",
   type: [
     "outer"
   ],
   config: {
     widgets: [
       {
         name: "B",
         label: "B",
         type: [
           "middle"
         ],
         config: {
           widgets: [
             {
               name: "D",
               label: "D",
               type: [
                 "inner"
               ]
             },
             {
               name: "E",
               label: "E",
               type: [
                 "inner"
               ]
             },
             {
               name: "F",
               label: "F",
               type: [
                 "inner"
               ]
             }
           ]
         }
       },
       {
         name: "C",
         label: "C",
         type: [
           "middle"
         ],
         config: {
           widgets: [
             {
               name: "F",
               label: "F",
               type: [
                 "inner"
               ]
             },
             {
               name: "E",
               label: "E",
               type: [
                 "inner"
               ]
             },
             {
               name: "D",
               label: "D",
               type: [
                 "inner"
               ]
             }
           ]
         }
       }
     ]
   }
 }
];

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
                  targetValues: ["A"],
                  widgetsForConfig: [
                     // No config
                  ],
                  widgetsForDisplay: [
                     {
                        name: "alfresco/dnd/DroppedNestingItemWrapper",
                        config: {
                           additionalCssClasses: "outerTestItemWrapper",
                           showEditButton: false,
                           label: "{label}",
                           value: "{value}",
                           type: "{type}",
                           widgets: [
                              {
                                 name: "alfresco/dnd/DragAndDropNestedTarget",
                                 config: {
                                    additionalCssClasses: "outerTestItemTarget",
                                    useModellingService: true,
                                    label: "Widgets",
                                    targetProperty: "config.widgets",
                                    acceptTypes: [ "middle" ]
                                 }
                              }
                           ]
                        }
                     }
                  ]
               },
               {
                  property: "name",
                  targetValues: ["B","C"],
                  widgetsForConfig: [
                     // No config
                  ],
                  widgetsForDisplay: [
                     {
                        name: "alfresco/dnd/DroppedNestingItemWrapper",
                        config: {
                           additionalCssClasses: "middleTestItemWrapper",
                           showEditButton: false,
                           label: "{label}",
                           value: "{value}",
                           type: "{type}",
                           widgets: [
                              {
                                 name: "alfresco/dnd/DragAndDropNestedTarget",
                                 config: {
                                    additionalCssClasses: "middleTestItemTarget",
                                    useModellingService: true,
                                    label: "Widgets",
                                    targetProperty: "config.widgets",
                                    acceptTypes: [ "inner" ]
                                 }
                              }
                           ]
                        }
                     }
                  ]
               },
               {
                  property: "name",
                  targetValues: ["D","E","F"],
                  widgetsForConfig: [
                     // No config
                  ],
                  widgetsForDisplay: [
                     {
                        name: "alfresco/dnd/DroppedNestingItemWrapper",
                        config: {
                           additionalCssClasses: "innerTestItemWrapper",
                           showEditButton: false,
                           label: "{label}",
                           value: "{value}",
                           type: "{type}",
                           widgets: [
                              {
                                 name: "alfresco/dnd/DroppedItem",
                                 config: {
                                    additionalCssClasses: "innerTestItem"
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
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  id: "DRAG_PALETTE1",
                  name: "alfresco/dnd/DragAndDropItems",
                  config: {
                     items: [
                        {
                           type: [ "outer"],
                           label: "A",
                           value: {
                              name: "A"
                           }
                        },
                        {
                           type: [ "middle"],
                           label: "B",
                           value: {
                              name: "B"
                           }
                        },
                        {
                           type: [ "middle"],
                           label: "C",
                           value: {
                              name: "C"
                           }
                        },
                        {
                           type: [ "inner"],
                           label: "D",
                           value: {
                              name: "D"
                           }
                        },
                        {
                           type: [ "inner"],
                           label: "E",
                           value: {
                              name: "E"
                           }
                        },
                        {
                           type: [ "inner"],
                           label: "F",
                           value: {
                              name: "F"
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
                              value: value,
                              acceptTypes: ["outer"],
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
         name: "alfresco/logging/DebugLog"
      }
   ]
};