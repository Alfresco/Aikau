/* global page */
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
         id: "SB2",
         name: "alfresco/header/SearchBox",
         config: {
            alignment: "left",
            placeholder: "Whatcha lookin' for?",
            documentsTitle: "Stuff",
            peopleTitle: "Even more stuff",
            moreTitle: "You want more?",
            suppressRedirect: true,
            showSiteResults: false
         }
      },
      {
         id: "SB3",
         name: "alfresco/header/SearchBox",
         config: {
            alignment: "left",
            placeholder: "Won't show documents",
            sitesTitle: "Other stuff",
            showDocumentResults: false
         }
      },
      {
         id: "SB4",
         name: "alfresco/header/SearchBox",
         config: {
            alignment: "left",
            placeholder: "Won't show people",
            showPeopleResults: false,
            publishTopic: "CUSTOM_TOPIC",
            publishPayload: {

            },
            publishPayloadType: "CONFIGURED",
            publishPayloadItemMixin: true,
            publishGlobal: true,
            publishToParent: false
         }
      },
      {
         id: "SB5",
         name: "alfresco/header/SearchBox",
         config: {
            alignment: "left",
            placeholder: "Has hidden search terms",
            showPeopleResults: false,
            hiddenSearchTerms: "secret squirrels",
            advancedSearch: false
         }
      },
      {
         name: "aikauTesting/mockservices/SearchBoxMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};