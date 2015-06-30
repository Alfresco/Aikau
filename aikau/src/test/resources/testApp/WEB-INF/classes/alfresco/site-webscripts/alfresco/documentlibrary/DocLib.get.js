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
   "alfresco/services/NavigationService",
   "alfresco/services/LogoutService"];

var docLibServices = getDocumentLibraryServices();
var services = alfAddUniqueServices(pageServices, docLibServices);

model.jsonModel = {
   services: services,
   widgets: [
      getDocLib({
         siteId: "site1", 
         containerId: "documentlibrary", 
         rootNode: null, 
         rootLabel: "Documents",
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