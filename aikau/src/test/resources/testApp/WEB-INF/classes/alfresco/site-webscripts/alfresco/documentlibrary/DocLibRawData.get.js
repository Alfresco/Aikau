<import resource="classpath:alfresco/site-webscripts/org/alfresco/aikau/webscript/libs/service-filtering.lib.js">
<import resource="classpath:alfresco/site-webscripts/org/alfresco/aikau/webscript/libs/doclib/doclib.lib.js">

var pageServices = [
   {
      name: "alfresco/services/LoggingService",
      config: {
         loggingPreferences: {
            enabled: true,
            all: true
         }
      }
   },
   {
      name: "alfresco/services/DocumentService",
      config: {
         rawData: true
      }
   },
   "alfresco/services/NavigationService",
   "alfresco/services/LogoutService"];

var docLibServices = getDocumentLibraryServices();
var services = alfAddUniqueServices(pageServices, docLibServices);

var docLib = getDocLib({
   siteId: "site1", 
   containerId: "documentlibrary", 
   rootNode: null, 
   rootLabel: "Documents",
   getUserPreferences: false
});
docLib.config.pubSubScope = "SCOPED_";

model.jsonModel = {
   services: services,
   widgets: [
      docLib,
      {
         name: "aikauTesting/mockservices/FullDocLibMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};