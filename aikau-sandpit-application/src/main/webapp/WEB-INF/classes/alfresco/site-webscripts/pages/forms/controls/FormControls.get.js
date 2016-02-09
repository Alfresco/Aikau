<import resource="classpath:alfresco/site-webscripts/imports/sandpit.lib.js">

buildPageModel({
   title: "page.title",
   description: "page.description",
   jsdoc: "https://dev.alfresco.com/resource/docs/aikau-jsdoc/BaseFormControl.html",
   examples: [
      {
         title: "example1.title",
         description: "example1.description",
         model: [
            {
               name: "alfresco/forms/controls/TextBox",
               config: {
                  name: "text"
               }
            }
         ]
      },
      {
         title: "example2.title",
         description: "example2.description",
         model: [
            {
               name: "alfresco/forms/Form",
               config: {
                  okButtonPublishGlobal: true,
                  okButtonPublishTopic: "SAVE",
                  widgets: [
                     {
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                           fieldId: "AGE",
                           label: "How old are you?",
                           name: "age",
                           description: "Please enter how old you are in years",
                           unitsLabel: "years"
                        }
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "example3.title",
         description: "example3.description",
         model: [
            {
               name: "alfresco/forms/Form",
               config: {
                  okButtonPublishGlobal: true,
                  okButtonPublishTopic: "SAVE",
                  widgets: [
                     {
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                           fieldId: "AGE",
                           label: "How old are you?",
                           name: "age",
                           description: "Please enter how old you are in years",
                           unitsLabel: "years",
                           placeHolder: "Age...",
                           requirementConfig: {
                              initialValue: true
                           }
                        }
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "example4.title",
         description: "example4.description",
         model: [
            {
               name: "alfresco/forms/Form",
               config: {
                  okButtonPublishGlobal: true,
                  okButtonPublishTopic: "SAVE",
                  widgets: [
                     {
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                           fieldId: "AGE",
                           label: "How old are you?",
                           name: "age",
                           description: "Please enter how old you are in years",
                           unitsLabel: "years",
                           placeHolder: "Age...",
                           requirementConfig: {
                              initialValue: true
                           },
                           validationConfig: [
                              {
                                 validation: "regex",
                                 regex: "^[0-9]+$",
                                 errorMessage: "Numbers only"
                              }
                           ]
                        }
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "example5.title",
         description: "example5.description",
         model: [
            {
               name: "alfresco/forms/Form",
               config: {
                  okButtonPublishGlobal: true,
                  okButtonPublishTopic: "SAVE",
                  widgets: [
                     {
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                           fieldId: "AGE",
                           label: "How old are you?",
                           name: "age",
                           description: "Please enter how old you are in years",
                           unitsLabel: "years",
                           placeHolder: "Age...",
                           requirementConfig: {
                              initialValue: true
                           },
                           validationConfig: [
                              {
                                 validation: "regex",
                                 regex: "^[0-9]+$",
                                 errorMessage: "Numbers only"
                              },
                              {
                                 validation: "numericalRange",
                                 min: 18,
                                 max: 65,
                                 errorMessage: "Age must be between 18 and 65"
                              }
                           ]
                        }
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "example6.title",
         description: "example6.description",
         model: [
            {
               name: "alfresco/forms/Form",
               config: {
                  okButtonPublishGlobal: true,
                  okButtonPublishTopic: "SAVE",
                  widgets: [
                     {
                        name: "alfresco/forms/controls/CheckBox",
                        config: {
                           fieldId: "SHOW_AGE",
                           label: "Show the age control?",
                           name: "show",
                           description: "Check the box to show the age fields",
                           value: true
                        }
                     },
                     {
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                           fieldId: "AGE",
                           label: "How old are you?",
                           name: "age",
                           description: "Please enter how old you are in years",
                           unitsLabel: "years",
                           placeHolder: "Age...",
                           visibilityConfig: {
                              rules: [
                                 {
                                    targetId: "SHOW_AGE",
                                    is: [true]
                                 }
                              ]
                           }
                        }
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "example7.title",
         description: "example7.description",
         model: [
            {
               name: "alfresco/forms/Form",
               config: {
                  okButtonPublishGlobal: true,
                  okButtonPublishTopic: "SAVE",
                  widgets: [
                     {
                        name: "alfresco/forms/controls/CheckBox",
                        config: {
                           fieldId: "SHOW_AGE",
                           label: "Show the age control?",
                           name: "show",
                           description: "Check the box to show the age fields",
                           value: true
                        }
                     },
                     {
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                           fieldId: "AGE",
                           label: "How old are you?",
                           name: "age",
                           description: "Please enter how old you are in years",
                           unitsLabel: "years",
                           placeHolder: "Age...",
                           postWhenHiddenOrDisabled: false,
                           visibilityConfig: {
                              rules: [
                                 {
                                    targetId: "SHOW_AGE",
                                    is: [true]
                                 }
                              ]
                           }
                        }
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "example8.title",
         description: "example8.description",
         model: [
            {
               name: "alfresco/forms/Form",
               config: {
                  okButtonPublishGlobal: true,
                  okButtonPublishTopic: "SAVE",
                  widgets: [
                     {
                        name: "alfresco/forms/controls/RadioButtons",
                        config: {
                           fieldId: "PRESET_OPTIONS",
                           label: "Select Option",
                           name: "value",
                           description: "Select a defined option or choose to enter a custom value",
                           value: "A",
                           noPostWhenValueIs: ["CUSTOM"],
                           optionsConfig: {
                              fixed: [
                                 {
                                    label: "A", value: "A"
                                 },
                                 {
                                    label: "B", value: "B"
                                 },
                                 {
                                    label: "Custom", value: "CUSTOM"
                                 }
                              ]
                           }
                        }
                     },
                     {
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                           fieldId: "CUSTOM",
                           label: "Custom Value",
                           name: "value",
                           description: "Enter a custom value",
                           postWhenHiddenOrDisabled: false,
                           visibilityConfig: {
                              rules: [
                                 {
                                    targetId: "PRESET_OPTIONS",
                                    is: ["CUSTOM"]
                                 }
                              ]
                           }
                        }
                     }
                  ]
               }
            }
         ]
      }
   ]
});