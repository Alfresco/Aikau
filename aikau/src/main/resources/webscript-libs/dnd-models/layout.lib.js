<import resource="classpath:/alfresco/site-webscripts/org/alfresco/aikau/webscript/libs/creation/template-mapping-config.lib.js">

function getClassicWindowConfig() {
   return [
   {
      config: {
         value: "Set title",
         description: "dnd.models.classic-window.config.title.description",
         label: "dnd.models.classic-window.config.title.label",
         fieldId: "TITLE",
         name: "config.title",
         unitsLabel: "dnd.models.classic-window.config.title.unitsLabel",
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
      name: "alfresco/forms/controls/TextBox",
      label: "dnd.models.classic-window.alfresco/forms/controls/TextBox.label",
      responseScope: ""
   }
];
}

function getClassicWindowNestedConfig() {
   return [];
}

function getClassicWindowDisplay() {
   return [
   {
      config: {
         value: "{value}",
         widgets: [
            {
               config: {
                  targetProperty: "config.widgets",
                  useModellingService: true,
                  label: "Widgets"
               },
               name: "alfresco/dnd/DragAndDropNestedTarget",
               label: "Drop Target",
               responseScope: ""
            }
         ],
         label: "{label}",
         showEditButton: "false"
      },
      name: "alfresco/dnd/DroppedNestingItemWrapper",
      label: "Nested item wrapper",
      responseScope: ""
   }
];
}

function getDefaultClassicWindowModel() {
   return {
      property: "name",
      targetValues: ["alfresco/layout/ClassicWindow"],
      widgetsForConfig: getClassicWindowConfig().concat(getTemplateMappingConfigurationControls(["title"])),
      widgetsForNestedConfig: getClassicWindowNestedConfig(),
      widgetsForDisplay: getClassicWindowDisplay()
   };
}
