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
                     name: "test1 & test2",
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
                     nodeRef: "dummy://nodeRef/1",
                     type: "folder",
                     displayName: "No title result",
                     modifiedBy: "Barry Smith",
                     modifiedOn: "13th December 2010",
                     modifiedByUser: "bsmith",
                     description: "No title result description",
                     site: {
                     	title: "No title result site title",
                     	shortName: "noTitleResult"
                     },
                     path: "/one/two/three/four",
                     size: 283746
                  },
                  {
                     nodeRef: "dummy://nodeRef/1",
                     type: "folder",
                     displayName: "No modifiedBy result",
                     title: "No modifiedBy result title",
                     modifiedOn: "13th December 2010",
                     modifiedByUser: "bsmith",
                     description: "No modifiedBy result description",
                     site: {
                     	title: "No modifiedBy result site title",
                     	shortName: "noModifiedByResult"
                     },
                     path: "/one/two/three/four",
                     size: 283746
                  },
                  {
                     nodeRef: "dummy://nodeRef/1",
                     type: "folder",
                     displayName: "No modifiedOn result",
                     title: "No modifiedOn result title",
                     modifiedBy: "Barry Smith",
                     modifiedByUser: "bsmith",
                     description: "No modifiedOn result description",
                     site: {
                     	title: "No modifiedOn result site title",
                     	shortName: "noModifiedOnResult"
                     },
                     path: "/one/two/three/four",
                     size: 283746
                  },
                  {
                     nodeRef: "dummy://nodeRef/1",
                     type: "folder",
                     displayName: "No modifiedByUser result",
                     title: "No modifiedByUser result title",
                     modifiedOn: "13th December 2010",
                     modifiedBy: "Barry Smith",
                     description: "No modifiedByUser result description",
                     site: {
                     	title: "No modifiedByUser result site title",
                     	shortName: "noModifiedByUserResult"
                     },
                     path: "/one/two/three/four",
                     size: 283746
                  },
                  {
                     nodeRef: "dummy://nodeRef/1",
                     type: "folder",
                     displayName: "No description result",
                     title: "No description result title",
                     modifiedBy: "Barry Smith",
                     modifiedOn: "13th December 2010",
                     modifiedByUser: "bsmith",
                     site: {
                     	title: "No description result site title",
                     	shortName: "noDescriptionResult"
                     },
                     path: "/one/two/three/four",
                     size: 283746
                  },
                  {
                     nodeRef: "dummy://nodeRef/1",
                     type: "folder",
                     displayName: "No site result",
                     title: "No site result title",
                     modifiedBy: "Barry Smith",
                     modifiedOn: "13th December 2010",
                     modifiedByUser: "bsmith",
                     description: "No site result description",
                     path: "/one/two/three/four",
                     size: 283746
                  },
                  {
                     nodeRef: "dummy://nodeRef/1",
                     type: "folder",
                     displayName: "No path result",
                     title: "No path result title",
                     modifiedBy: "Barry Smith",
                     modifiedOn: "13th December 2010",
                     modifiedByUser: "bsmith",
                     description: "No path result description",
                     site: {
                     	title: "No path site title",
                     	shortName: "noPathResult"
                     },
                     size: 283746
                  },
                  {
                     nodeRef: "dummy://nodeRef/1",
                     type: "folder",
                     displayName: "No size result",
                     title: "No size result title",
                     modifiedBy: "Barry Smith",
                     modifiedOn: "13th December 2010",
                     modifiedByUser: "bsmith",
                     description: "No size result description",
                     site: {
                     	title: "No size result site title",
                     	shortName: "normalResult"
                     },
                     path: "/one/two/three/four"
                  },
                  {
                     nodeRef: "dummy://nodeRef/1",
                     type: "document",
                     displayName: "Document result",
                     title: "Document result title",
                     modifiedBy: "Barry Smith",
                     modifiedOn: "13th December 2010",
                     modifiedByUser: "bsmith",
                     description: "Document result description",
                     site: {
                     	title: "Document result site title",
                     	shortName: "documentResult"
                     },
                     path: "/one/two/three/four",
                     size: 283746
                  },
                  {
                     nodeRef: "dummy://nodeRef/1",
                     type: "wiki",
                     displayName: "Wiki result",
                     title: "Wiki result title",
                     modifiedBy: "Barry Smith",
                     modifiedOn: "13th December 2010",
                     modifiedByUser: "bsmith",
                     description: "Wiki result description",
                     site: {
                        title: "Wiki result site title",
                        shortName: "wikiResult"
                     },
                     path: "/one/two/three/four",
                     size: 283746
                  },
                  {
                     nodeRef: "dummy://nodeRef/1",
                     "type": "calendarevent",
                     "name": "1432113732076-6118.ics",
                     "displayName": "Event result",
                     "description": "",
                     "modifiedOn": "2015-05-20T10:22:12.079+01:00",
                     "modifiedByUser": "admin",
                     "modifiedBy": "Administrator",
                     "fromDate": "2015-04-01T12:00:00.000+01:00",
                     "size": -1,
                     "mimetype": "",
                     "site":
                     {
                        "shortName": "eventResult",
                        "title": "Event result site title"
                     },
                     "container": "calendar",
                     "lastThumbnailModification": [],
                     "tags": []
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
                  id: "SR",
                  name: "alfresco/search/AlfSearchResult",
                  config: {
                     siteLandingPage: "landing",
                     pubSubScope: "AlfSearchResultScope",
                     mergeActions: true,
                     additionalDocumentAndFolderActions: [
                        "CUSTOM3"
                     ],
                     customActions: [
                        {
                           id: "CUSTOM3",
                           label: "Custom Action 3",
                           icon: "document-delete",
                           index: "10",
                           publishTopic: "DELETE_ACTION_TOPIC",
                           type: "javascript"
                        }
                     ],
                     widgetsForActions: [
                        {
                           name: "alfresco/renderers/actions/ManageAspects"
                        }
                     ]
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