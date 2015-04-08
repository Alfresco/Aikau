model.jsonModel = {
   services: [{
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true
            }
         }
      },
      "alfresco/services/TagService"
   ],
   widgets: [{
      id: "FORM1",
      name: "alfresco/forms/Form",
      config: {
         okButtonPublishTopic: "FORM_POST",
         scopeFormControls: false,
         value: {
            tags: ["tag1", "tag11"]
         },
         widgets: [{
            id: "MULTISELECT_1",
            name: "alfresco/forms/controls/MultiSelectInput",
            config: {
               label: "Tags",
               name: "tags",
               width: "400px",
               optionsConfig: {
                  queryAttribute: "name",
                  valueAttribute: "nodeRef",
                  labelAttribute: "name",
                  publishTopic: "ALF_RETRIEVE_CURRENT_TAGS",
                  publishPayload: {
                     resultsProperty: "response.data.items"
                  }
               }
            }
         }]
      }
   }, {
      name: "aikauTesting/mockservices/MultiSelectInputMockXhr"
   }, {
      name: "alfresco/logging/SubscriptionLog"
   }]
};