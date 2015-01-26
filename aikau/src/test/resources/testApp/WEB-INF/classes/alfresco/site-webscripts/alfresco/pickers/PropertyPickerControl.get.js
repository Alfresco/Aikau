model.jsonModel = {
   services: [
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/forms/Form",
         config: {
            okButtonPublishTopic: "TEST",
            widgets: [
               {
                  name: "alfresco/forms/controls/PropertyPicker",
                  config: {
                     id: "PICKER1",
                     label: "Pick some props",
                     name: "props",
                     value: [{name:"cm:name"}]
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