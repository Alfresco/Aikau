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

model.jsonModel = {
   services: services,
   widgets: [
      getDocLib({
         siteId: "site1", 
         containerId: "documentlibrary", 
         rootNode: null, 
         rootLabel: "Documents",
         useHash: false,
         pubSubScope: "TEST_",
         getUserPreferences: false
      }),
      {
         name: "aikauTesting/mockservices/FullDocLibMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};