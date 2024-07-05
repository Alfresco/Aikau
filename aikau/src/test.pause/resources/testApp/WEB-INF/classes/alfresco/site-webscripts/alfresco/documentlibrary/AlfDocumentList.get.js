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
   }];

var docLibServices = getDocumentLibraryServices();
var services = pageServices.concat(docLibServices);


var options = {
   useHash: false, // For the purposes of this test, we need hashing off...
   siteId: null, 
   containerId: null, 
   rootNode: "alfresco://company/home", 
   rootLabel: "Documents",
   getUserPreferences: false
};
var breadcrumbTrail = getDocLibBreadcrumbTrail(options);
var documentList = getDocLibList(options);
documentList.config.widgets = [
   {
   id: "SIMPLE_VIEW",
   name: "alfresco/documentlibrary/views/AlfSimpleView"
}];

model.jsonModel = {
   services: services,
   widgets: [
      breadcrumbTrail,
      documentList,
      {
         name: "alfresco/testing/NodesMockXhr",
         config: {
            respondAfter: 2000, // In order to reproduce the test case the server needs to delay in responding
            totalItems: 10,
            folderRatio: [50,50]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};