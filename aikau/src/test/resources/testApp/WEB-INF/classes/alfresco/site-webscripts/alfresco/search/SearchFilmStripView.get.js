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
      },
      "alfresco/services/DocumentService"
   ],
   widgets:[
      {
         name: "alfresco/search/SearchFilmStripView",
         config: {
            id: "SEARCH_RESULTS",
            currentData: {
               items: [
                  {
                     nodeRef: "workspace://SpacesStore/f8394454-0651-48a5-b583-d067c7d03339",
                     type: "document",
                     displayName: "Normal result",
                     title: "Normal result title",
                     modifiedBy: "Barry Smith",
                     modifiedOn: "13th December 2010",
                     modifiedByUser: "bsmith",
                     description: "Normal result description",
                     site: {
                        title: "Normal result site title",
                        shortName: "normalResult"
                     },
                     path: "/one/two/three/four",
                     size: 283746
                  },
                  {
                     nodeRef: "workspace://SpacesStore/f8394454-0651-48a5-b583-d067c7d03339",
                     type: "document",
                     displayName: "Normal result",
                     title: "Normal result title",
                     modifiedBy: "Barry Smith",
                     modifiedOn: "13th December 2010",
                     modifiedByUser: "bsmith",
                     description: "Normal result description",
                     site: {
                        title: "Normal result site title",
                        shortName: "normalResult"
                     },
                     path: "/one/two/three/four",
                     size: 283746
                  }
               ]
            }
         }
      },
      {
         name: "aikauTesting/mockservices/PdfJsMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};