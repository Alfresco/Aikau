<import resource="classpath:alfresco/site-webscripts/org/alfresco/aikau/{aikauVersion}/libs/pages/datalists.lib.js">

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

var dataListServices = getDataListServices();
var services = pageServices.concat(dataListServices);

var widgets = getDataListWidgets({
   siteId: "site1"
});

model.jsonModel = {
   services: services,
   widgets: [
      widgets,
      {
         name: "aikauTesting/mockservices/DataListMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};