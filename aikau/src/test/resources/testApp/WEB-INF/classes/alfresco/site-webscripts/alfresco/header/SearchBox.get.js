// Switch search box configuration depending upon whether the page is loaded
// with a site URI template or not...
var searchBox;
if (page.url.templateArgs.site)
{
   // If a site context is provided then align the live search pane to the right
   // and make the width big enough so that it fully appears on the screen
   searchBox = {
      id: "SB1",
      name: "alfresco/header/SearchBox",
      config: {
         site: page.url.templateArgs.site,
         alignment: "right",
         width: "500",
         documentLibraryPage: "custom-document-container",
         documentPage: "custom-document-details"
      }
   };
}
else
{
   searchBox = {
      id: "SB1",
      name: "alfresco/header/SearchBox",
      config: {
         site: page.url.templateArgs.site,
         alignment: "left"
      }
   };
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
      searchBox,
      {
         name: "aikauTesting/mockservices/SearchBoxMockXhr"
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};