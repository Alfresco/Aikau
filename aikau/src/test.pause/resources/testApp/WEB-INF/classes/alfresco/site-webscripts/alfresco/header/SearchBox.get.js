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
         siteName: "SiteLabel",
         enableContextLiveSearch: true,
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
      // See AKU-737
      {
         id: "SB6",
         name: "alfresco/header/SearchBox",
         config: {
            alignment: "left",
            placeholder: "Search me!",
            advancedSearch: false,
            width: "250",
            suppressRedirect: true,
            showSiteResults: false,
            showPeopleResults: false,
            hiddenSearchTerms: null,
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            publishPayloadType: "PROCESS",
            publishPayloadModifiers: ["processCurrentItemTokens"],
            publishPayload: {
               target: "NEW",
               type: "FULL_PATH",
               url: "/share/page/sfdc-document-details?nodeRef={nodeRef}"
            },
            publishPayloadItemMixin: false,
            publishGlobal: true,
            publishToParent: false
         }
      },
      {
         id: "SB7",
         name: "alfresco/header/SearchBox",
         config: {
            alignment: "left",
            site: page.url.templateArgs.site,
            liveSearchHeight: "100px",
            documentLibraryPage: "custom-document-container",
            documentPage: "custom-document-details"
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