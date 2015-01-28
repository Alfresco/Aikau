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
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         id: "FORM_SELECT_FORM",
         name: "alfresco/forms/Form",
         config: {
            showCancelButton: false,
            showOkButton: false,
            scopeFormControls: false,
            widgets: [
               {
                  id: "FORM_SELECT_SELECT",
                  name: "alfresco/forms/controls/Select",
                  config: {
                     fieldId: "FORM_SELECT",
                     label: "Select Form",
                     optionsConfig: {
                        fixed: [
                           {
                              label: "Form 1",
                              value: "[{\"id\":\"Form1_Field\",\"name\":\"alfresco/forms/controls/DojoValidationTextBox\",\"config\":{\"label\":\"One\",\"name\":\"field1\",\"value\":\"Value1\"}}]"
                           },
                           {
                              label: "Form 2",
                              value: "[{\"id\":\"Form2_Field\",\"name\":\"alfresco/forms/controls/DojoValidationTextBox\",\"config\":{\"label\":\"Two\",\"name\":\"field2\",\"value\":\"Value2\"}}]"
                           }
                        ]
                     }
                  }
               }
            ]
         }
      },
      {
         id: "DYNAMIC_FORM",
         name: "alfresco/forms/DynamicForm",
         config: {
            scopeFormControls: false,
            subscriptionTopic: "_valueChangeOf_FORM_SELECT",
            okButtonLabel: "Save",
            okButtonPublishTopic: "DYNAMIC_FORM_POST",
            okButtonPublishGlobal: true,
            showCancelButton: false
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