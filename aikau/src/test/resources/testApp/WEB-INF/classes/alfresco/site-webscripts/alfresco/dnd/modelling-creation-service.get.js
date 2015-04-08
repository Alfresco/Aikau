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
            publishTopic: "ALF_EXPORT_PAGE_DEFINITION",
            publishPayload: {
               modelName: "TestModel",
               nlsPrefix: "test.prefix",
               property: "name",
               targetValues: ["target"],
               widgetsForConfig: [
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