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
   widgets:[
      {
         name: "alfresco/forms/Form",
         config: {
            pubSubScope: "FORM1",
            showOkButton: true,
            okButtonPublishTopic: "SAVE_FORM_1",
            okButtonLabel: "Save Form 1",
            showCancelButton: false,
            scopeFormControls: false,
            widgets: [
               {
                  id: "SIMPLE_NO_VALUE",
                  name: "alfresco/forms/controls/MultipleEntryFormControl",
                  config: {
                     fieldId: "SIMPLE_PROPS",
                     name: "simple",
                     value: "",
                     label: "Simple Properties",
                     useSimpleValues: true,
                     widgets: [
                        {
                           name: "alfresco/forms/controls/DojoValidationTextBox",
                           config: {
                              name: "value",
                              label: "Entry"
                           }
                        }
                     ]
                  }
               },
               {
                  id: "SIMPLE_WITH_VALUE",
                  name: "alfresco/forms/controls/MultipleEntryFormControl",
                  config: {
                     fieldId: "SIMPLE_PROPS_WITH_VALUE",
                     name: "simpleWithValue",
                     value: ["test1","test2","test3"],
                     label: "Simple Properties (preset value)",
                     useSimpleValues: true,
                     widgets: [
                        {
                           name: "alfresco/forms/controls/DojoValidationTextBox",
                           config: {
                              name: "value",
                              label: "Entry"
                           }
                        }
                     ]
                  }
               },
               {
                  id: "COMPLEX_NO_VALUE",
                  name: "alfresco/forms/controls/MultipleEntryFormControl",
                  config: {
                     fieldId: "COMPLEX_PROPS",
                     name: "complex",
                     value: "",
                     label: "Complex Properties",
                     useSimpleValues: false,
                     widgets: [
                        {
                           name: "alfresco/forms/controls/DojoValidationTextBox",
                           config: {
                              name: "value",
                              label: "Entry"
                           }
                        }
                     ]
                  }
               },
               {
                  id: "COMPLEX_WITH_VALUE",
                  name: "alfresco/forms/controls/MultipleEntryFormControl",
                  config: {
                     fieldId: "COMPLEX_PROPS_WITH_VALUE",
                     name: "complexWithValue",
                     value: [{value:"test4"},{value:"test5"}],
                     label: "Complex Properties (preset value)",
                     useSimpleValues: false,
                     widgets: [
                        {
                           name: "alfresco/forms/controls/DojoValidationTextBox",
                           config: {
                              name: "value",
                              label: "Entry"
                           }
                        }
                     ]
                  }
               },
               {
                  id: "KEY_VALUE_PAIR",
                  name: "alfresco/forms/controls/MultipleKeyValuePairFormControl",
                  config: {
                     fieldId: "KEY_VALUE_PAIR",
                     name: "keyValuePair",
                     value: null,
                     label: "Key/Value Pair"
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