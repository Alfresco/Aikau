<import resource="classpath:alfresco/site-webscripts/org/alfresco/aikau/{aikauVersion}/libs/doclib/doclib.lib.js">

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
   "alfresco/services/NavigationService",
   "alfresco/services/LogoutService"];

var docLibServices = getDocumentLibraryServices();
var services = pageServices.concat(docLibServices);

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