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
      }
   ],
   widgets: [
      {
         id: "FORM1",
         name: "alfresco/forms/Form",
         config: {
            pubSubScope: "FORM1_",
            okButtonPublishTopic: "SAVE1",
            value: {
               sweets: "form_strawberries,refreshers"
            },
            widgets: [
               {
                  id: "MULTISELECT_1",
                  name: "alfresco/forms/controls/MultiSelectInput",
                  config: {
                     label: "Sweets (fixed options)",
                     name: "sweets",
                     width: "300px",
                     valueDelimiter: ",",
                     addedAndRemovedValues: true,
                     optionsConfig: {
                        fixed: [
                           {
                              name: "Foam Strawberries",
                              label: "Foam Strawberries",
                              value: "foam_strawberries"
                           },
                           {
                              name: "Sherbert Lemons",
                              label: "Sherbert Lemons",
                              value: "sherbert_lemons"
                           },
                           {
                              name: "White Chocolate Mice",
                              label: "White Chocolate Mice",
                              value: "white_chocolate_mice"
                           },
                           {
                              name: "Refreshers",
                              label: "Refreshers",
                              value: "refreshers"
                           },
                           {
                              name: "Flying Saucers",
                              label: "Flying Saucers",
                              value: "flying_saucers"
                           }
                        ]
                     }
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};