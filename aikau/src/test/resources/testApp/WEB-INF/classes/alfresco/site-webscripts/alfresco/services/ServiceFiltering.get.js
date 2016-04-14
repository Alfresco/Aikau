<import resource="classpath:alfresco/site-webscripts/org/alfresco/aikau/{aikauVersion}/libs/service-filtering.lib.js">

var originalServices = [
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
   {
      name: "alfresco/services/NavigationService"
   },
   {
      name: "alfresco/services/NotificationService",
      config: {
         pubSubScope: "SCOPED_SERVICE_"
      }
   }
];

// The first 3 services should be removed because they are duplicates, the others should be added...
var additionalServices = [
   {
      name: "alfresco/services/DialogService"
   },
   "alfresco/services/NavigationService",
   {
      name: "alfresco/services/NotificationService",
      config: {
         pubSubScope: "SCOPED_SERVICE_"
      }
   },
   {
      name: "alfresco/services/NotificationService",
      config: {
         pubSubScope: "DIFFERENT_SCOPED_SERVICE_"
      }
   },
   "alfresco/services/CrudService",
   "alfresco/services/ContentService"
];

var services = alfAddUniqueServices(originalServices, additionalServices);

model.jsonModel = {
   services: services,
   widgets: [
      {
         name: "alfresco/html/Label",
         config: {
            label: "This is a test page for testing the service-filtering.lib.js file (nothing to see here)."
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};