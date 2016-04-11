<import resource="classpath:alfresco/site-webscripts/org/alfresco/aikau/{aikauVersion}/libs/doclib/doclib.lib.js">

/* global page */
/* jshint sub:true */
var full = true;
if (page.url.args["full"])
{
   full = page.url.args["full"] === "true";
}

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
   siteId: null, 
   containerId: null, 
   rootNode: "alfresco://company/home", 
   rootLabel: "Documents",
   getUserPreferences: false
});
docLib.config.pubSubScope = "SCOPED_";

if (!full)
{
   docLib = {
      name: "alfresco/layout/FixedHeaderFooter",
      config: {
         widgetsForHeader: [
            {
               name: "alfresco/html/Spacer",
               config: {
                  height: "50px"
               }
            }
         ],
         widgets: [docLib],
         widgetsForFooter: [
            {
               name: "alfresco/html/Spacer",
               config: {
                  height: "50px"
               }
            }
         ]
      }
   };
}

model.jsonModel = {
   services: services,
   widgets: [
      docLib,
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