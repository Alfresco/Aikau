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
         name: "alfresco/search/AlfSearchListView",
         config: {
            id: "SEARCH_RESULTS",
            currentData: {
               items: [
                  {
                     nodeRef: "workspace://SpacesStore/f8394454-0651-48a5-b583-d067c7d03339",
                     type: "folder",
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
                     size: 283746,
                     highlight: "normal"
                  }
               ]
            },
            widgetsForHeader: [
               {
                  name: "alfresco/lists/views/layouts/HeaderCell",
                  config: {
                     id: "THUMBNAIL_HEADER",
                     label: "Thumbnail column"
                  }
               },
               {
                  name: "alfresco/lists/views/layouts/HeaderCell",
                  config: {
                     id: "DETAIL_HEADER",
                     label: "Detail column"
                  }
               },
               {
                  name: "alfresco/lists/views/layouts/HeaderCell",
                  config: {
                     id: "ACTIONS_HEADER",
                     label: "Actions column"
                  }
               }
            ],
            widgets:[
               {
                  name: "alfresco/search/AlfSearchResult",
                  config: {
                     pubSubScope: "AlfSearchResultScope",
                     enableContextMenu: true,
                     showMoreInfo: false,
                     additionalDocumentAndFolderActions: [
                        "dummy-action-for-test"
                     ],
                     widgetsAbove: [
                        {
                           name: "alfresco/renderers/Banner",
                           config: {
                              bannerMessage: "Lookout Below!"
                           }
                        }
                     ],
                     widgetsBelow: [
                        {
                           name: "alfresco/renderers/Banner",
                           config: {
                              bannerMessage: "Lookout Above!"
                           }
                        }
                     ],
                     showSearchTermHighlights: true,
                     highlightProperty: "highlight"
                  }
               }
            ]
            
         }
      },
      {
         name: "aikauTesting/mockservices/PdfJsMockXhr",
         config: {
            
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};