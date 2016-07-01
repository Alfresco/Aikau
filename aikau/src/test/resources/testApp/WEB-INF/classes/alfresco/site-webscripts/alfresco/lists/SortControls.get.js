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
               all: true,
               warn: true,
               error: true
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
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Custom page sizes",
                     widgets: [
                        {
                           id: "PAGINATOR",
                           name: "alfresco/lists/Paginator",
                           config: {
                              documentsPerPage: 10,
                              pageSizes: [5,10,20],
                              widgetsAfter: [
                                 {
                                    id: "SORT_FIELD_SELECT",
                                    name: "alfresco/lists/SortFieldSelect",
                                    config: {
                                       sortFieldOptions: [
                                          { id: "SORT_BY_NAME", label: "Display Name", value: "name" },
                                          { id: "SORT_BY_INDEX", label: "Index", value: "index", selected: true }
                                       ]
                                    }
                                 },
                                 {
                                    id: "SORT_ORDER_TOGGLE",
                                    name: "alfresco/lists/SortOrderToggle"
                                 }
                              ]
                           }
                        },
                        {
                           id: "LIST",
                           name: "alfresco/lists/AlfSortablePaginatedList",
                           config: {
                              sortField: "index",
                              sortFieldLabel: "Index",
                              itemKeyProperty: "index",
                              currentPageSize: 10,
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
         name: "alfresco/logging/DebugLog"
      }
   ]
};