<import resource="classpath:alfresco/site-webscripts/imports/sandpit.lib.js">

buildPageModel({
   title: "page.title",
   description: "page.description",
   jsdoc: "http://dev.alfresco.com/resource/docs/aikau-jsdoc/CoreWidgetProcessing.html",
   examples: [
      {
         title: "example1.title",
         description: "example1.description",
         model: [
            {
               name: "alfresco/forms/Form",
               config: {
                  pubSubScope: "EX1_",
                  widgets: [
                     {
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                           fieldId: "TEXTBOX",
                           label: "Text",
                           name: "text",
                           description: "Use the checkbox to control my visibility",
                           visibilityConfig: {
                              initialValue: true,
                              rules: [
                                 {
                                    targetId: "CHECKBOX",
                                    is: [true]
                                 }
                              ]
                           }
                        }
                     },
                     {
                        name: "alfresco/forms/controls/CheckBox",
                        config: {
                           fieldId: "CHECKBOX",
                           label: "Show text box",
                           name: "checkbox",
                           value: true,
                           description: "The text box will be shown when checked"
                        }
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "example2.title",
         description: "example2.description",
         model: [
            {
               name: "alfresco/buttons/AlfButton",
               config: {
                  label: "Show Logo",
                  publishTopic: "SHOW",
                  publishPayload: {
                     displayed: "YES",
                  }
               }
            },
            {
               name: "alfresco/buttons/AlfButton",
               config: {
                  label: "Hide Logo",
                  publishTopic: "SHOW",
                  publishPayload: {
                     displayed: "NO",
                  }
               }
            },
            {
               name: "alfresco/logo/Logo",
               config: {
                  visibilityConfig: {
                     initialValue: true,
                     rules: [
                        {
                           topic: "SHOW",
                           attribute: "displayed",
                           is: ["YES"]
                        }
                     ]
                  }
               }
            }
         ]
      },
      {
         title: "example3.title",
         description: "example3.description",
         model: [
            {
               name: "alfresco/buttons/AlfButton",
               config: {
                  label: "Show Logo",
                  publishTopic: "DISPLAY",
                  publishPayload: {
                     show: true,
                  }
               }
            },
            {
               name: "alfresco/buttons/AlfButton",
               config: {
                  label: "Hide Logo",
                  publishTopic: "DISPLAY",
                  publishPayload: {
                     show: false,
                  }
               }
            },
            {
               name: "alfresco/logo/Logo",
               config: {
                  visibilityConfig: {
                     initialValue: true,
                     rules: [
                        {
                           topic: "DISPLAY",
                           attribute: "show",
                           is: [true],
                           strict: false
                        }
                     ]
                  }
               }
            }
         ]
      },
      {
         title: "example4.title",
         description: "example4.description",
         model: [
            {
               name: "alfresco/buttons/AlfButton",
               config: {
                  label: "Show Logo",
                  publishTopic: "REVEAL",
                  publishPayload: {
                     display: true,
                  }
               }
            },
            {
               name: "alfresco/buttons/AlfButton",
               config: {
                  label: "Hide Logo",
                  publishTopic: "REVEAL",
                  publishPayload: {
                     display: false,
                  }
               }
            },
            {
               name: "alfresco/logo/Logo",
               config: {
                  visibilityConfig: {
                     initialValue: true,
                     rules: [
                        {
                           topic: "REVEAL",
                           attribute: "display",
                           is: [true],
                           strict: false
                        }
                     ]
                  },
                  invisibilityConfig: {
                     initialValue: false,
                     rules: [
                        {
                           topic: "REVEAL",
                           attribute: "display",
                           is: [false],
                           strict: false
                        }
                     ]
                  }
               }
            }
         ]
      },
      {
         title: "example5.title",
         description: "example5.description",
         model: [
            {
               name: "alfresco/buttons/AlfButton",
               config: {
                  label: "Show Logo",
                  publishTopic: "NOW_YOU_SEE_ME",
                  publishPayload: {
                     value: "show"
                  }
               }
            },
            {
               name: "alfresco/buttons/AlfButton",
               config: {
                  label: "Hide Logo",
                  publishTopic: "NOW_YOU_DO_NOT",
                  publishPayload: {
                     value: "hide"
                  }
               }
            },
            {
               name: "alfresco/logo/Logo",
               config: {
                  currentItem: {
                     targetValue: "show"
                  },
                  visibilityConfig: {
                     initialValue: true,
                     rules: [
                        {
                           topic: "NOW_YOU_SEE_ME",
                           attribute: "value",
                           is: ["targetValue"],
                           useCurrentItem: true,
                           strict: false
                        }
                     ]
                  },
                  invisibilityConfig: {
                     initialValue: false,
                     rules: [
                        {
                           topic: "NOW_YOU_DO_NOT",
                           attribute: "value",
                           isNot: ["targetValue"],
                           useCurrentItem: true,
                           strict: false
                        }
                     ]
                  }
               }
            }
         ]
      },
      {
         title: "example6.title",
         description: "example6.description",
         model: [
            {
               name: "alfresco/buttons/AlfButton",
               config: {
                  label: "Click Me...",
                  publishTopic: "ONE",
                  publishPayload: {
                     value: "show"
                  }
               }
            },
            {
               name: "alfresco/buttons/AlfButton",
               config: {
                  label: "...and Click Me to show",
                  publishTopic: "TWO",
                  publishPayload: {
                     show: true
                  }
               }
            },
            {
               name: "alfresco/logo/Logo",
               config: {
                  visibilityConfig: {
                     useState: true,
                     initialValue: false,
                     rulesMethod: "ALL",
                     rules: [
                        {
                           topic: "ONE",
                           is: ["show"]
                        },
                        {
                           topic: "TWO",
                           attribute: "show",
                           is: [true]
                        }
                     ]
                  }
               }
            }
         ]
      }
   ]
});
