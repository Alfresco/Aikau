function getTabbedFormControlsConfig() {
   return [];
}

function getTabbedFormControlsNestedConfig() {
   return [
      {
         config: {
            value: "",
            description: "tabbed.form.controls.title.description",
            label: "tabbed.form.controls.title.label",
            fieldId: "TITLE",
            name: "title",
            postWhenHiddenOrDisabled: true,
            noValueUpdateWhenHiddenOrDisabled: false,
            unitsLabel: null,
            optionsConfig: {
               fixed: []
            },
            visibilityConfig: {
               initialValue: true,
               rules: []
            },
            requirementConfig: {
               initialValue: true,
               rules: []
            },
            disablementConfig: {
               initialValue: false,
               rules: []
            },
            validationConfig: []
         },
         name: "alfresco/forms/controls/TextBox",
         label: "tabbed.form.controls.alfresco/forms/controls/TextBox.label"
      }
   ];
}

function getTabbedFormControlsDisplay() {
   return [
   {
      config: {
         value: "{value}",
         widgets: [
            {
               config: {
                  targetProperty: "config.widgets",
                  useModellingService: true,
                  label: "Tabs"
               },
               name: "alfresco/dnd/DragAndDropNestedTarget",
               label: "Drop Target"
            }
         ],
         label: "{label}",
         showEditButton: "false"
      },
      name: "alfresco/dnd/DroppedNestingItemWrapper",
      label: "Nested item wrapper"
   }
];
}

function getDefaultTabbedFormControlsModel() {
   return {
      property: "name",
      targetValues: ["alfresco/forms/TabbedControls"],
      widgetsForConfig: getTabbedFormControlsConfig(),
      widgetsForNestedConfig: getTabbedFormControlsNestedConfig(),
      widgetsForDisplay: getTabbedFormControlsDisplay()
   };
}
