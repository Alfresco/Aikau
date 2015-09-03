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
            widgets: [
               {
                  id: "SOURCE1",
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     fieldId: "SOURCE1",
                     name: "test1",
                     label: "One",
                     description: "This field is used for evaluating rules"
                  }
               },
               {
                  id: "SOURCE2",
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     fieldId: "SOURCE2",
                     name: "test2",
                     label: "Two",
                     description: "This field is used for evaluating rules"
                  }
               },
               {
                  id: "RULES1",
                  name: "alfresco/forms/controls/TextBox", 
                  config: {
                     label: "ANY evaluation",
                     description: "This is displayed is EITHER 'One' or 'Two' is not blank",
                     value: "",
                     visibilityConfig: {
                        initialValue: false,
                        rulesMethod: "ANY",
                        rules: [
                           {
                              targetId: "SOURCE1",
                              isNot: ["", null]
                           },
                           {
                              targetId: "SOURCE2",
                              isNot: ["", null]
                           }
                        ]
                     }
                  }
               },
               {
                  id: "RULES2",
                  name: "alfresco/forms/controls/TextBox", 
                  config: {
                     label: "ALL evaluation",
                     description: "This is displayed is BOTH 'One' or 'Two' are not blank",
                     value: "",
                     visibilityConfig: {
                        initialValue: false,
                        rulesMethod: "ALL",
                        rules: [
                           {
                              targetId: "SOURCE1",
                              isNot: ["", null]
                           },
                           {
                              targetId: "SOURCE2",
                              isNot: ["", null]
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