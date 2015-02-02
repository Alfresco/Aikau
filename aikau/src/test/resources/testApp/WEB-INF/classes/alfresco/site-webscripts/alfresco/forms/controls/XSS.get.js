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
      },
      "aikauTesting/mockservices/SelectTestOptions"
   ],
   widgets: [
      {
         name: "alfresco/forms/Form",
         config: {
            id: "FORM",
            pubSubScope: "UNIT_TEST_",
            widgets: [
               {
                  id: "TEXTBOX",
                  name: "alfresco/forms/controls/DojoValidationTextBox", 
                  config: {
                     fieldId: "TEXTBOX",
                     label: "Basic",
                     value: '<img src="1" onerror="window.hackedTextBoxValue=true">'
                  }
               },
               {
                  id:"RADIO_BUTTONS",
                  name: "alfresco/forms/controls/RadioButtons",
                  config: {
                     fieldId: "RADIO_BUTTONS",
                     label: "Check XSS Options",
                     optionsConfig: {
                        fixed: [
                           {label:'<img src="1" onerror="window.hackedRBOptionLabel=true">',value:'<img src="1" onerror="window.hackedRBOptionValue=true">'}
                        ]
                     }
                  }
               },
               {
                  id:"SELECT",
                  name: "alfresco/forms/controls/Select",
                  config: {
                     fieldId: "SELECT",
                     label: "Check XSS Options",
                     optionsConfig: {
                        fixed: [
                           {label:'<img src="1" onerror="window.hackedSelectOptionLabel=true">',value:'<img src="1" onerror="window.hackedSelectOptionValue=true">'}
                        ]
                     }
                  }
               },
               {
                  id:"COMBOBOX",
                  name: "alfresco/forms/controls/ComboBox",
                  config: {
                     fieldId: "COMBOBOX",
                     label: "Check XSS Options",
                     optionsConfig: {
                        fixed: [
                           {label:'<img src="1" onerror="window.hackedComboBoxOptionLabel=true">',value:'<img src="1" onerror="window.hackedComboBoxOptionValue=true">'}
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