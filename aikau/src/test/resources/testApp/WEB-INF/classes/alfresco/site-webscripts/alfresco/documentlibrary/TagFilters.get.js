model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true,
               warn: true,
               error: true
            }
         }
      },
      "alfresco/services/TagService"
   ],
   widgets: [
      {
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/documentlibrary/AlfTagFilters",
                  id: "TAG_FILTERS",
                  config: {
                     label: "Tags (unscoped)",
                     siteId: "eng",
                     containerId: "documentLibrary"
                  }
               },
               {
                  name: "alfresco/documentlibrary/AlfTagFilters",
                  id: "SCOPED_TAG_FILTERS",
                  config: {
                     label: "Tags (scoped)",
                     siteId: "eng",
                     containerId: "documentLibrary",
                     pubSubScope: "SCOPED_"
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/TagsMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};