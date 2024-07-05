<import resource="classpath:alfresco/site-webscripts/org/alfresco/aikau/{aikauVersion}/libs/pages/people.lib.js">

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

var peopleServices = getUserProfileServices();
var services = pageServices.concat(peopleServices);

var widgets = getUserProfilesWidgets();

model.jsonModel = {
   services: services,
   widgets: [
      widgets,
      {
         name: "aikauTesting/mockservices/UserMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};