/* global url */
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
      "alfresco/services/OptionsService"
   ],
   widgets: [
      {
         name: "alfresco/forms/Form",
         config: {
            pubSubScope: "FORM_",
            okButtonPublishTopic: "SAVE_FORM",
            okButtonLabel: "Save",
            value: {
               person2: "abeecher"
            },
            widgets: [
               {
                  id: "FILTERING_SELECT_1",
                  name: "alfresco/forms/controls/FilteringSelect",
                  config: {
                     fieldId: "FILTERING_SELECT_1",
                     name: "person1",
                     label: "Select a person (FilteringSelect config value)",
                     value: "abeecher",
                     optionsConfig: {
                        queryAttribute: "label",
                        labelAttribute: "label",
                        valueAttribute: "value",
                        publishTopic: "ALF_GET_FORM_CONTROL_OPTIONS",
                        publishPayload: {
                           resultsProperty: "options",
                           url: url.context + "/proxy/alfresco/api/people",
                           itemsAttribute: "people",
                           labelAttribute: "userName",
                           valueAttribute: "userName"
                        }
                     }
                  }
               },
               {
                  id: "FILTERING_SELECT_2",
                  name: "alfresco/forms/controls/FilteringSelect",
                  config: {
                     fieldId: "FILTERING_SELECT_2",
                     name: "person2",
                     label: "Select a person (FilteringSelect form value)",
                     showAllOptionsOnOpen: true,
                     optionsConfig: {
                        queryAttribute: "label",
                        labelAttribute: "label",
                        valueAttribute: "value",
                        publishTopic: "ALF_GET_FORM_CONTROL_OPTIONS",
                        publishPayload: {
                           resultsProperty: "options",
                           url: url.context + "/proxy/alfresco/api/people",
                           itemsAttribute: "people",
                           labelAttribute: "userName",
                           valueAttribute: "userName"
                        }
                     }
                  }
               },
               {
                  id: "COMBO_1",
                  name: "alfresco/forms/controls/ComboBox",
                  config: {
                     fieldId: "COMBO_1",
                     name: "person3",
                     label: "Select a person (ComboBox config value)",
                     value: "abeecher",
                     optionsConfig: {
                        queryAttribute: "label",
                        labelAttribute: "label",
                        valueAttribute: "value",
                        publishTopic: "ALF_GET_FORM_CONTROL_OPTIONS",
                        publishPayload: {
                           resultsProperty: "options",
                           url: url.context + "/proxy/alfresco/api/people",
                           itemsAttribute: "people",
                           labelAttribute: "userName",
                           valueAttribute: "userName"
                        }
                     }
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/UserMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};