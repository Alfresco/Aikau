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
      "alfresco/services/DialogService",
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/buttons/AlfButton",
         id: "UPDATE_CHECKBOXES",
         config: {
            label: "Update checkboxes",
            publishTopic: "SET_FORM_VALUE",
            publishPayload: {
               defaultCheckbox: false,
               o1: 1,
               offon: "false"
            }
         }
      },
      {
         name: "alfresco/html/Spacer",
         config: {
            height: "30px"
         }
      },
      {
         name: "alfresco/forms/Form",
         config: {
            id: "CHECKBOX_FORM",
            okButtonPublishTopic: "POST_FORM",
            setValueTopic: "SET_FORM_VALUE",
            scopeFormControls: false,
            value: {
               defaultCheckbox: true
            },
            widgets: [
               {
                  name: "alfresco/forms/controls/CheckBox",
                  id: "DEFAULT_CHECKBOX",
                  config: {
                     name: "defaultCheckbox",
                     label: "Possible values default (true/false), initial value true (via form values-object)"
                  }
               },
               {
                  name: "alfresco/forms/controls/CheckBox",
                  id: "O1_CHECKBOX",
                  config: {
                     name: "o1",
                     label: "Possible values 0 (unchecked) or 1 (checked), initial value \"1\"",
                     offValue: 0,
                     onValue: 1,
                     value: "1"
                  }
               },
               {
                  name: "alfresco/forms/controls/CheckBox",
                  id: "OFFON_CHECKBOX",
                  config: {
                     name: "offon",
                     label: "Possible values \"off\" (unchecked) or \"on\" (checked), initial value \"on\"",
                     offValue: "off",
                     onValue: "on",
                     value: "on"
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/html/Spacer",
         config: {
            height: "30px"
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};