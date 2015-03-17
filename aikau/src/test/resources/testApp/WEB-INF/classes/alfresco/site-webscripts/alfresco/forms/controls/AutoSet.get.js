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
         id: "SET_FORM_VALUE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set Form Publication",
            publishTopic: "SET_FORM_VALUE",
            publishPayload: {
               hidden2: "Value Set"
            }
         }
      },
      {
         name: "alfresco/forms/Form",
         config: {
            okButtonPublishTopic: "POST_FORM",
            setValueTopic: "SET_FORM_VALUE",
            scopeFormControls: false,
            value: {
               hidden2: "initial value"
            },
            widgets: [
               {
                  id: "SOURCE",
                  name: "alfresco/forms/controls/Select", 
                  config: {
                     fieldId: "SOURCE_FIELD",
                     label: "Choose from these...",
                     name: "source",
                     value: "",
                     optionsConfig: {
                        fixed: [
                           { label: "One", value: "1"},
                           { label: "Two", value: "2"},
                           { label: "Three", value: "3"}
                        ]
                     }
                  }
               },
               {
                  id: "TARGET",
                  name: "alfresco/forms/controls/DojoValidationTextBox",
                  config: {
                     name: "target",
                     label: "...to set this",
                     autoSetConfig: [
                        {
                           rulePassValue: "Updated",
                           ruleFailValue: "",
                           rules: [
                              {
                                 targetId: "SOURCE_FIELD",
                                 is: ["3"]
                              }
                           ]
                        }
                     ]
                  }
               },
               {
                  id: "HIDDEN",
                  name: "alfresco/forms/controls/HiddenValue",
                  config: {
                     name: "hidden",
                     autoSetConfig: [
                        {
                           rulePassValue: {
                              something: {
                                 quite: "complex"
                              }
                           },
                           ruleFailValue: "",
                           rules: [
                              {
                                 targetId: "SOURCE_FIELD",
                                 is: ["2"]
                              }
                           ]
                        }
                     ]
                  }
               },
               {
                  id: "HIDDEN2",
                  name: "alfresco/forms/controls/HiddenValue",
                  config: {
                     name: "hidden2"
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};