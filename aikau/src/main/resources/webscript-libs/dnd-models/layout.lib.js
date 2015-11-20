function getLayoutConfig() {
   return [
      {
         name: "alfresco/forms/controls/CheckBox",
         config: {
            fieldId: "ENABLE_TEMPLATE_MAPPINGS",
            name: "config._alfIncludeInTemplate",
            label: "Has template attributes?",
            description: "Does this widget have any attributes that should be configurable in the template",
            value: false
         }
      },
      {
         name: "alfresco/forms/controls/MultipleEntryFormControl",
         config: {
            fieldId: "TEMPLATE_MAPPINGS",
            name: "config._alfTemplateMappings",
            value: "",
            label: "Template Attributes",
            description: "The attributes to make available for configuration in the template",
            useSimpleValues: false,
            visibilityConfig: {
               initialValue: false,
               rules: [
                  {
                     targetId: "ENABLE_TEMPLATE_MAPPINGS",
                     is: [true]
                  }
               ]
            },
            widgets: [
               {
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     fieldId: "UUID",
                     name: "id",
                     value: "",
                     label: "dnd.model.layout.id.label",
                     description: "dnd.model.layout.id.description",
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
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/Select",
                  config: {
                     fieldId: "PROPERTY",
                     name: "property",
                     label: "dnd.model.layout.property.label",
                     description: "dnd.model.layout.property.description",
                     optionsConfig: {
                        fixed: [
                           {
                              fieldId: "48a9dbf2-a6cc-480c-87a5-b8fe94c92800",
                              label: "dnd.model.layout.48a9dbf2-a6cc-480c-87a5-b8fe94c92800.label",
                              value: "ONE"
                           }
                        ]
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
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     fieldId: "LABEL",
                     name: "label",
                     label: "dnd.model.layout.label.label",
                     description: "dnd.model.layout.label.description",
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
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/TextArea",
                  config: {
                     fieldId: "DESCRIPTION",
                     name: "description",
                     description: "dnd.model.layout.description.description",
                     label: "dnd.model.layout.description.label",
                     visibilityConfig: {
                        initialValue: true
                     },
                     requirementConfig: {
                        initialValue: false,
                        rules: []
                     }
                  }
               }
            ]
         }
      }
   ];
}

function getLayoutNestedConfig() {
   return [];
}

function getLayoutDisplay() {
   return [
      {
         name: "alfresco/dnd/DroppedNestingItemWrapper",
         config: {
            showEditButton: true,
            label: "{label}",
            value: "{value}",
            widgets: [
               {
                  name: "alfresco/dnd/DragAndDropFormControlTarget",
                  config: {
                     useModellingService: true,
                     label: "Widgets", // TODO: NLS
                     targetProperty: "config.widgets"
                  }
               }
            ]
         }
      }
   ];
}

function getDefaultLayoutModel() {
   return {
      property: "name",
      targetValues: ["alfresco/layout/ClassicWindow"],
      widgetsForConfig: getLayoutConfig(),
      widgetsForNestedConfig: getLayoutNestedConfig(),
      widgetsForDisplay: getLayoutDisplay()
   };
}
