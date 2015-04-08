function getDroppedNestingItemWrapperConfig() {
   return [
   {
      config: {
         value: "false",
         description: "modeller.dropped-nesting-item-wrapper.config.showEditButton.description",
         label: "modeller.dropped-nesting-item-wrapper.config.showEditButton.label",
         fieldId: "SHOW_EDIT_BUTTON",
         name: "config.showEditButton",
         unitsLabel: "modeller.dropped-nesting-item-wrapper.config.showEditButton.unitsLabel",
         optionsConfig: {
            fixed: []
         },
         visibilityConfig: {
            initialValue: true,
            rules: []
         },
         requirementConfig: {
            initialValue: false,
            rules: []
         },
         disablementConfig: {
            initialValue: false,
            rules: []
         },
         postWhenHiddenOrDisabled: true,
         noValueUpdateWhenHiddenOrDisabled: false
      },
      name: "alfresco/forms/controls/CheckBox"
   },
   {
      config: {
         value: "{label}",
         description: "modeller.dropped-nesting-item-wrapper.config.label.description",
         label: "modeller.dropped-nesting-item-wrapper.config.label.label",
         fieldId: "LABEL",
         name: "config.label",
         unitsLabel: "modeller.dropped-nesting-item-wrapper.config.label.unitsLabel",
         optionsConfig: {
            fixed: []
         },
         visibilityConfig: {
            initialValue: true,
            rules: []
         },
         requirementConfig: {
            initialValue: false,
            rules: []
         },
         disablementConfig: {
            initialValue: false,
            rules: []
         },
         postWhenHiddenOrDisabled: true,
         noValueUpdateWhenHiddenOrDisabled: false
      },
      name: "alfresco/forms/controls/TextBox"
   },
   {
      config: {
         value: "{value}",
         description: "modeller.dropped-nesting-item-wrapper.config.value.description",
         label: "modeller.dropped-nesting-item-wrapper.config.value.label",
         fieldId: "VALUE",
         name: "config.value",
         unitsLabel: "modeller.dropped-nesting-item-wrapper.config.value.unitsLabel",
         optionsConfig: {
            fixed: []
         },
         visibilityConfig: {
            initialValue: true,
            rules: []
         },
         requirementConfig: {
            initialValue: false,
            rules: []
         },
         disablementConfig: {
            initialValue: false,
            rules: []
         },
         postWhenHiddenOrDisabled: true,
         noValueUpdateWhenHiddenOrDisabled: false
      },
      name: "alfresco/forms/controls/TextBox"
   }
];
}

function getDroppedNestingItemWrapperNestedConfig() {
   return [];
}

function getDroppedNestingItemWrapperDisplay() {
   return [
      {
         name: "alfresco/dnd/DroppedNestingItemWrapper",
         config: {
            showEditButton: true,
            label: "{label}",
            value: "{value}",
            widgets: [
               {
                  name: "alfresco/dnd/DragAndDropTarget",
                  config: {
                     useModellingService: true,
                     label: "Item Representation",
                     targetProperty: "config.widgets"
                  }
               }
            ]
         }
      }
   ];
}

function getDefaultDroppedNestingItemWrapperModel() {
   return {
      property: "name",
      targetValues: ["alfresco/dnd/DroppedNestingItemWrapper"],
      widgetsForConfig: getDroppedNestingItemWrapperConfig(),
      widgetsForNestedConfig: getDroppedNestingItemWrapperNestedConfig(),
      widgetsForDisplay: getDroppedNestingItemWrapperDisplay()
   };
}

function getDragAndDropTargetConfig() {
   return [
      {
         config: {
            value: "true",
            description: "modeller.dropped-item-widgets.config.useModellingService.description",
            label: "modeller.dropped-item-widgets.config.useModellingService.label",
            fieldId: "USE_MODELLING_SERVICE",
            name: "config.useModellingService",
            unitsLabel: "modeller.dropped-item-widgets.config.useModellingService.unitsLabel",
            optionsConfig: {
               fixed: []
            },
            visibilityConfig: {
               initialValue: true,
               rules: []
            },
            requirementConfig: {
               initialValue: false,
               rules: []
            },
            disablementConfig: {
               initialValue: false,
               rules: []
            },
            postWhenHiddenOrDisabled: true,
            noValueUpdateWhenHiddenOrDisabled: false
         },
         name: "alfresco/forms/controls/CheckBox"
      },
      {
         config: {
            value: "",
            description: "modeller.dropped-item-widgets.config.label.description",
            label: "modeller.dropped-item-widgets.config.label.label",
            fieldId: "LABEL",
            name: "config.label",
            unitsLabel: "modeller.dropped-item-widgets.config.label.unitsLabel",
            optionsConfig: {
               fixed: []
            },
            visibilityConfig: {
               initialValue: true,
               rules: []
            },
            requirementConfig: {
               initialValue: false,
               rules: []
            },
            disablementConfig: {
               initialValue: false,
               rules: []
            },
            postWhenHiddenOrDisabled: true,
            noValueUpdateWhenHiddenOrDisabled: false
         },
         name: "alfresco/forms/controls/TextBox"
      },
      {
         config: {
            value: "config.widgets",
            description: "modeller.dropped-item-widgets.config.targetProperty.description",
            label: "modeller.dropped-item-widgets.config.targetProperty.label",
            fieldId: "TARGET_PROPERTY",
            name: "config.targetProperty",
            unitsLabel: "modeller.dropped-item-widgets.config.targetProperty.unitsLabel",
            optionsConfig: {
               fixed: []
            },
            visibilityConfig: {
               initialValue: true,
               rules: []
            },
            requirementConfig: {
               initialValue: false,
               rules: []
            },
            disablementConfig: {
               initialValue: false,
               rules: []
            },
            postWhenHiddenOrDisabled: true,
            noValueUpdateWhenHiddenOrDisabled: false
         },
         name: "alfresco/forms/controls/TextBox"
      }
   ];
}

function getDragAndDropTargetNestedConfig() {
   return [];
}

function getDragAndDropTargetDisplay() {
   return [
      {
         name: "alfresco/dnd/DroppedNestingItemWrapper",
         config: {
            showEditButton: true,
            label: "{label}",
            value: "{value}",
            widgets: [
               {
                  name: "alfresco/dnd/DragAndDropTarget",
                  config: {
                     useModellingService: true,
                     label: "Targets",
                     targetProperty: "config.widgets"
                  }
               }
            ]
         }
      }
   ];
}

function getDefaultDragAndDropTargetModel() {
   return {
      property: "name",
      targetValues: ["alfresco/dnd/DragAndDropTarget"],
      widgetsForConfig: getDragAndDropTargetConfig(),
      widgetsForNestedConfig: getDragAndDropTargetNestedConfig(),
      widgetsForDisplay: getDragAndDropTargetDisplay()
   };
}
