function getFormControlTabConfig() {
   return [];
}

function getFormControlTabNestedConfig() {
   return [];
}

function getFormControlTabDisplay() {
   return [
   {
      config: {
         value: "{value}",
         widgets: [
            {
               config: {
                  targetProperty: "config.widgets",
                  useModellingService: true,
                  label: "Form Controls"
               },
               name: "alfresco/dnd/DragAndDropNestedTarget",
               label: "Drop Target"
            }
         ],
         label: "{label}",
         showEditButton: "true"
      },
      name: "alfresco/dnd/DroppedNestingItemWrapper",
      label: "Nested item wrapper"
   }
];
}

function getDefaultFormControlTabModel() {
   return {
      property: "name",
      targetValues: ["alfresco/forms/ControlColumn"],
      widgetsForConfig: getFormControlTabConfig(),
      widgetsForNestedConfig: getFormControlTabNestedConfig(),
      widgetsForDisplay: getFormControlTabDisplay()
   };
}
