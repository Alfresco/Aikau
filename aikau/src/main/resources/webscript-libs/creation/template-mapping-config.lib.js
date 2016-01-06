/**
 * The purpose of this function is to return the form control configuration for making
 * attributes for a widget exposed through the template configuration. This will mean
 * that when the template is saved the attributes will be configurable.
 *
 * @param {string[]} attributes The attributes that are selectable for configuration
 */
function addCommonConfigTabs(model, attributes) {
   if (model && 
       model[0] && 
       model[0].config && 
       model[0].config.widgets)
   {
      var fixedOptions = [];
      if (Array.isArray(attributes))
      {
         attributes.forEach(function(attribute) {
            fixedOptions.push({
               label: attribute,
               value: attribute
            });
         });
      }

      model[0].config.widgets.push({
         name: "alfresco/forms/ControlColumn",
         title: "Common",
         config: {
            widgets: [
               {
                  name: "alfresco/forms/controls/CheckBox",
                  config: {
                     name: "config.generatePubSubScope",
                     label: "Generate pub/sub scope?",
                     description: "Optionally generates a new pub/sub scope for the widget",
                     value: false
                  }
               },
               {
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     label: "Pub/Sub Scope",
                     name: "config.pubSubScope",
                     description: "Set an optional publication/subscription scope for the widget"
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/forms/ControlColumn",
         title: "Template Attributes",
         config: {
            widgets: [
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
                           name: "alfresco/forms/controls/RandomValueGenerator",
                           config: {
                              fieldId: "UUID",
                              name: "id",
                              label: "dnd.model.layout.id.label",
                              description: "dnd.model.layout.id.description",
                              visibilityConfig: {
                                 initialValue: false
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
                                 fixed: fixedOptions
                              },
                              requirementConfig: {
                                 initialValue: true
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
                              requirementConfig: {
                                 initialValue: true
                              }
                           }
                        },
                        {
                           name: "alfresco/forms/controls/TextArea",
                           config: {
                              fieldId: "DESCRIPTION",
                              name: "description",
                              description: "dnd.model.layout.description.description",
                              label: "dnd.model.layout.description.label"
                           }
                        }
                     ]
                  }
               }
            ]
         }
      });
   }
   return model;
}