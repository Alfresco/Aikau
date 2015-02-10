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
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         id: "SITE_DOC_LINK",
         name: "alfresco/search/SearchResultPropertyLink",
         config: {
            currentItem: {
               displayName: "Site Document Link",
               site: {
                  shortName:"site1",
                  title: "Site 1"
               },
               type: "document",
               nodeRef: "workspace://SpacesStore/some-fake-uuid"
            },
            propertyToRender: "displayName"
         }
      },
      {
         id: "SITE_FOLDER_LINK",
         name: "alfresco/search/SearchResultPropertyLink",
         config: {
            currentItem: {
               displayName: "Site Folder Link",
               site: {
                  shortName:"site1",
                  title: "Site 1"
               },
               type: "folder",
               path: "/folder1/folder2",
               name: "folder3"

            },
            propertyToRender: "displayName"
         }
      },
      {
         id: "REPO_DOC_LINK",
         name: "alfresco/search/SearchResultPropertyLink",
         config: {
            currentItem: {
               displayName: "Repo Document Link",
               type: "document",
               nodeRef: "workspace://SpacesStore/some-fake-uuid"
            },
            propertyToRender: "displayName"
         }
      },
      {
         id: "REPO_FOLDER_LINK",
         name: "alfresco/search/SearchResultPropertyLink",
         config: {
            currentItem: {
               displayName: "Repo Folder Link",
               type: "folder",
               path: "/folder1/folder2",
               name: "folder3"

            },
            propertyToRender: "displayName"
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};