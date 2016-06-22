/* global page */
/* jshint sub:true */
var hidePrefix = false;
if (page.url.args["hidePrefix"])
{
   hidePrefix = page.url.args["hidePrefix"] === "true";
}

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
      }
   ],
   widgets:[
      {
         name: "alfresco/layout/VerticalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/header/Title",
                  config: {
                     browserTitlePrefix: "Unit Tests",
                     label: "Original Title"
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/header/SetTitle",
         config: {
            title: "test.page.updated.title",
            hideBrowserTitlePrefix: hidePrefix,
            browserTitlePrefix: "New prefix"
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};