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
         name: "alfresco/buttons/AlfButton",
         id: "PUBLISH_TAGGED_BUTTON",
         config: {
            label: "Publish document-tagged event",
            publishTopic: "ALF_DOCUMENT_TAGGED",
            pubSubScope: "SCOPED_"
         }
      },
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
               },
               {
                  name: "alfresco/documentlibrary/AlfTagFilters",
                  id: "TAG_FILTERS_ROOT_NODE",
                  config: {
                     label: "Tags (Root Node - none expected)",
                     rootNode: "some://fake/node",
                     pubSubScope: "ROOT_NODE_SCOPE_"
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