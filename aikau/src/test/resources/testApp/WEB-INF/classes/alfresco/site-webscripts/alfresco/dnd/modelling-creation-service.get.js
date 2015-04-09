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
      "alfresco/services/DragAndDropModelCreationService"
   ],
   widgets: [
      {
         id: "DRIVE_THE_SERVICE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Drive the service!",
            publishTopic: "ALF_DND_EXPORT_MODEL_LIBRARY_FILES",
            publishPayload: {
               modelName: "TestModel",
               nlsPrefix: "test.prefix",
               property: "name",
               targetValues: ["target"],
               widgetsForConfig: [
                  {
                     name: "widget1",
                     config: {
                        name: "widget",
                        label: "moo",
                        description: "woof",
                        unitsLabel: "oink",
                        title: "baa",
                        noTranslation: "hello"
                     }
                  }
               ],
               widgetsForNestedConfig: [
               ],
               widgetsForDisplay: [
               ]
            }
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};