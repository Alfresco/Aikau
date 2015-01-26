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
      "alfresco/services/CrudService",
      "alfresco/services/TagService",
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/forms/Form",
         config: {
            okButtonPublishTopic: "POST_FORM",
            scopeFormControls: false,
            widgets: [
               {
                  id: "TAGS",
                  name: "alfresco/forms/controls/ComboBox", 
                  config: {
                     label: "Tags",
                     name: "tag",
                     value: "",
                     optionsConfig: {
                        queryAttribute: "name",
                        publishTopic: "ALF_RETRIEVE_CURRENT_TAGS",
                        publishPayload: {
                           resultsProperty: "response.data.items"
                        }
                     }
                  }
               },
               {
                  id: "PROPERTIES",
                  name: "alfresco/forms/controls/ComboBox", 
                  config: {
                     label: "Properties",
                     name: "property",
                     value: "",
                     optionsConfig: {
                        queryAttribute: "name",
                        publishTopic: "ALF_CRUD_GET_ALL",
                        publishPayload: {
                           url: "api/properties"
                        }
                     }
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/ComboBoxMockXhr"
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};