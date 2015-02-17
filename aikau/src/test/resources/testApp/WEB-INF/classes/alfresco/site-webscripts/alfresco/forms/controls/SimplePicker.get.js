model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true
            }
         }
      }
   ],
   widgets: [
      {
         id: "FORM",
         name: "alfresco/forms/Form",
         config: {
            okButtonPublishTopic: "FORM_POST",
            scopeFormControls: false,
            widgets: [
               {
                  id: "PICKER1",
                  name: "alfresco/forms/controls/SimplePicker",
                  config: {
                     label: "Picker Without Value",
                     description: "This is a simple picker, using hard-coded data with no preset value",
                     name: "picker1",
                     reorderable: true,
                     currentData: {
                        items: [
                           {
                              name: "One"
                           },
                           {
                              name: "Two"
                           },
                           {
                              name: "Three"
                           }
                        ]
                     }
                 }
               },
               {
                  id: "PICKER2",
                  name: "alfresco/forms/controls/SimplePicker",
                  config: {
                     label: "Picker With Value",
                     description: "This is a simple picker, using hard-coded data with a preset value",
                     name: "picker2",
                     reorderable: true,
                     value: [
                        {
                           name: "One"
                        }
                     ],
                     currentData: {
                        items: [
                           {
                              name: "One"
                           },
                           {
                              name: "Two"
                           },
                           {
                              name: "Three"
                           }
                        ]
                     }
                 }
               }
            ]
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};