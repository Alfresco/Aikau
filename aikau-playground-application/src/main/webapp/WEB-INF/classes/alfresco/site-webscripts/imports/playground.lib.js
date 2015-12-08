function outputExamples(examples) {
   var model = [];
   if (examples)
   {
      for (var i=0; i < examples.length; i++)
      {
         var example = examples[i];
         var pubSubScope = "EXAMPLE" + i + "_";

         var value = JSON.stringify(example.model, null, "\t");

         var exampleModel = {
            name: "alfresco/layout/TitleDescriptionAndContent",
            config: {
               title: example.title || "Example",
               description: example.description || "No description provided",
               widgets: [
                  {
                     name: "alfresco/layout/HorizontalWidgets",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/layout/ClassicWindow",
                              config: {
                                 title: "Model Input",
                                 widgets: [
                                    {
                                       name: "alfresco/forms/Form",
                                       config: {
                                          okButtonLabel: "Update Preview",
                                          okButtonPublishTopic: "ALF_GENERATE_PAGE_PREVIEW",
                                          showCancelButton: false,
                                          pubSubScope: pubSubScope,
                                          widgets: [
                                             {
                                                name: "alfresco/forms/controls/CheckBox",
                                                config: {
                                                   name: "stringified",
                                                   value: true,
                                                   visibilityConfig: {
                                                      initialValue: false
                                                   }
                                                }
                                             },
                                             {
                                                name: "alfresco/forms/controls/CodeMirrorEditor",
                                                config: {
                                                   name: "widgets",
                                                   editMode: "javascript",
                                                   value: value
                                                }
                                             }
                                          ]
                                       }
                                    }
                                 ]
                              }
                           },
                           {
                              name: "alfresco/layout/ClassicWindow",
                              config: {
                                 title: "Preview Output",
                                 widgets: [
                                    {
                                       name: "alfresco/prototyping/Preview",
                                       config: {
                                          pubSubScope: pubSubScope,
                                          pageDefinition: {
                                             stringified: true,
                                             publishOnReady: "[]",
                                             services: "[]",
                                             widgets: value
                                          }
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
         };
         model.push(exampleModel);
      }
   }
   return model;
}

function buildPageModel(data) {
   if (data.title && data.description && data.examples)
   {
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
            "alfresco/services/DialogService",
            "alfresco/services/PageService",
            "alfresco/services/OptionsService"
         ],
         widgets: [
            {
               name: "alfresco/layout/StripedContent",
               config: {
                  contentWidth: "1400px",
                  widgets: [
                     {
                        name: "alfresco/layout/LeftAndRight",
                        stripeClass: "header",
                        className: "share-header-title",
                        config: {
                           semanticWrapper: "header",
                           widgets: [
                              {
                                 name: "alfresco/logo/Logo",
                                 align: "left",
                                 config:
                                 {
                                    logoClasses: "alfresco-logo-large"
                                 }
                              },
                              {
                                 name: "alfresco/header/Title",
                                 align: "left",
                                 config: {
                                    label: "Aikau Playground - " + data.title,
                                    setBrowserTitle: "Aikau Playground"
                                 }
                              }
                           ]
                        }
                     },
                     {
                        name: "alfresco/layout/VerticalWidgets",
                        stripeClass: "menu",
                        stripeStyle: "border-bottom: none",
                        config: {
                           widgets: [
                              {
                                 name: "alfresco/html/Label",
                                 config: {
                                    label: data.description
                                 }
                              }
                           ]
                        }
                     },
                     {
                        name: "alfresco/layout/AlfTabContainer",
                        config: {
                           widgets: [
                              {
                                 title: "Examples",
                                 name: "alfresco/layout/VerticalWidgets",
                                 config: {
                                    widgets: outputExamples(data.examples)
                                 }
                              },
                              {
                                 title: "Logging",
                                 name: "alfresco/logging/DebugLog"
                              },
                              {
                                 title: "JSDoc",
                                 name: "alfresco/integration/IFrame",
                                 config: {
                                    src: data.jsdoc,
                                    srcType: "FULL_PATH"
                                 }
                              }
                           ]
                        }
                     }
                  ]
               }
            }
         ]
      };
   }
   else
   {
      model.jsonModel = {
         services: [],
         widgets: [
            {
               id: "WARNINGS2",
               name: "alfresco/header/Warning",
               config: {
                  warnings: [
                     {
                        message: "Data missing for page!",
                        level: 3
                     }
                  ]
               }
            }
         ]
      };
   }
}
