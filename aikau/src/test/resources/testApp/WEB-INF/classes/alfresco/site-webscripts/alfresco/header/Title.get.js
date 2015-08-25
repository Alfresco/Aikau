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
   widgets: [
      {
         name: "alfresco/layout/VerticalWidgets",
         config: {
            widgets: [
               {
                  id: "BASIC",
                  name: "alfresco/header/Title",
                  config: {
                     label: "This is a title"
                  }
               },
               {
                  id: "LONG",
                  name: "alfresco/header/Title",
                  config: {
                     label: "ThisIsAReallyLongTitleWithoutAnySpacesInIt",
                     maxWidth: "300px"
                  }
               },
               {
                  id: "LINK",
                  name: "alfresco/header/Title",
                  config: {
                     label: "Link Title",
                     targetUrl: "dp/ws/some-other-page"
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};