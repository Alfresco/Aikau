/*jshint maxlen:false*/

var view = {
   name: "alfresco/lists/views/AlfListView",
   config: {
      widgets: [
         {
            name: "alfresco/lists/views/layouts/Row",
            config: {
               widgets: [
                  {
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/renderers/Property",
                              config: {
                                 propertyToRender: "index"
                              }
                           }
                        ]
                     }
                  }
               ]
            }
         }
      ]
   }
};

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
      {
         name: "aikauTesting/mockservices/PaginationService",
         config: {
            loadDataSubscriptionTopic: "ALF_RETRIEVE_DOCUMENTS_REQUEST"
         }
      },
      "alfresco/services/NavigationService"
   ],
   widgets: [
      {
         "name": "alfresco/layout/HorizontalWidgets",
         "config": {
            "widgetMarginLeft": 10,
            "widgetMarginRight": 10,
            "widgets": [
               {
                  name: "alfresco/dashlets/Dashlet",
                  id: "BELOW_DASHLET",
                  config: {
                     additionalCssClasses: "smallpad",
                     componentId: "component.dashlet-id",
                     pubSubScope: "BELOW_",
                     title: "Dashlet (height BELOW scroll tolerance)",
                     bodyHeight: 400,
                     widgetsForBody: [
                        {
                           name: "alfresco/layout/InfiniteScrollArea",
                           config: {
                              scrollTolerance: 600,
                              fillAvailableHeight: true,
                              widgets: [
                                 {
                                    id: "INFINITE_SCROLL_LIST_1",
                                    name: "alfresco/lists/AlfSortablePaginatedList",
                                    config: {
                                       useHash: false,
                                       useInfiniteScroll: true,
                                       currentPageSize: 3,
                                       widgets: [view]
                                    }
                                 }
                              ]
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/dashlets/Dashlet",
                  id: "ABOVE_DASHLET",
                  config: {
                     additionalCssClasses: "smallpad",
                     pubSubScope: "ABOVE_",
                     title: "(height ABOVE scroll tolerance)",
                     bodyHeight: 500,
                     widgetsForBody: [
                        {
                           name: "alfresco/layout/InfiniteScrollArea",
                           config: {
                              scrollTolerance: 300,
                              widgets: [
                                 {
                                    id: "INFINITE_SCROLL_LIST_2",
                                    name: "alfresco/lists/AlfSortablePaginatedList",
                                    config: {
                                       useHash: false,
                                       useInfiniteScroll: true,
                                       currentPageSize: 20,
                                       widgets: [view]
                                    }
                                 }
                              ]
                           }
                        }
                     ]
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