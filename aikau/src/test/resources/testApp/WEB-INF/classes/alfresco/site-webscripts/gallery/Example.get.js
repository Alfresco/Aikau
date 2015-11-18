var model1 = [
   {
      name: "alfresco/logo/Logo"
   }
];
var model1Value = JSON.stringify(model1);

function outputExamples(examples) {
   var model = [];

   if (examples)
   {
      for (var i=0; i < examples.length; i++)
      {
         var example = examples[i];
         var pubSubScope = "EXAMPLE" + i + "_";
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
                                                   value: example.value
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
                                          pubSubScope: pubSubScope
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

var model2 = [{
   name: "alfresco/logo/Logo",
   config: {
      logoClasses: "surf-logo-large"
   }
}];
var model2Value = JSON.stringify(model2);

var data = [
   {
      title: "Basic Logo",
      description: "A logo can be used without any configuration",
      value: model1Value
   },
   {
      title: "Configuring an altenative CSS class",
      description: "A number of logos are provided that can be selected by configuring the \"logoClasses\" attribute",
      value: model2Value
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
      "alfresco/services/DialogService",
      "alfresco/services/PageService",
      "alfresco/services/OptionsService"
   ],
   widgets: [
      {
         name: "alfresco/layout/TitleDescriptionAndContent",
         config: {
            title: "alfresco/logo/Logo",
            description: "The Logo widget is intended for rendering company logos in Alfresco Share.",
            widgets: outputExamples(data)
         }
      }
   ]
};