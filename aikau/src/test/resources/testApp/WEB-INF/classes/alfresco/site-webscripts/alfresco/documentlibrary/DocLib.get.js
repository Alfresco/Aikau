<import resource="classpath:/alfresco/site-webscripts/org/alfresco/aikau/webscript/libs/doclib/doclib.lib.js">

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
      "alfresco/services/NavigationService",
      "alfresco/services/DocumentService",
      "alfresco/services/DialogService",
      "alfresco/services/ContentService",
      "alfresco/services/ActionService",
      "alfresco/services/UploadService"
   ],
   widgets: [
      getDocLib("site1", "documentlibrary", null, "Documents"),
      {
         name: "aikauTesting/mockservices/FullDocLibMockXhr"
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};