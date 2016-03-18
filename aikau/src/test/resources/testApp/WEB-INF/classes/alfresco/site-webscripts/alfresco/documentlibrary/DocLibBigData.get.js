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

var docLib = getDocLib({
   siteId: null, 
   containerId: null, 
   rootNode: "alfresco://company/home", 
   rootLabel: "Documents",
   getUserPreferences: false
});
docLib.config.pubSubScope = "SCOPED_";

model.jsonModel = {
   services: services,
   widgets: [
      // docLib,
      {
         name: "alfresco/layout/FixedHeaderFooter",
         config: {
            widgetsForHeader: [
               {
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: "Bob"
                  }
               }
            ],
            widgets: [docLib],
            widgetsForFooter: [
               {
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: "Bob"
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/testing/NodesMockXhr",
         config: {
            totalItems: 40,
            folderRatio: [100]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};