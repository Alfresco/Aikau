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
      }
   ],
   widgets: [
      {
         name: "alfresco/layout/FixedHeaderFooter",
         id: "HEADER_FOOTER",
         config: {
            autoHeightPaddingAllowance: 10,
            recalculateAutoHeightOnResize: true,
            widgetsForHeader: [
               {
                  id: "FIXED_BREADCRUMBS",
                  name: "alfresco/documentlibrary/AlfBreadcrumbTrail",
                  config: {
                     breadcrumbs: [
                        {
                           label: "Some"
                        },
                        {
                           label: "Example"
                        },
                        {
                           label: "Breadcrumb"
                        },
                        {
                           label: "Trail"
                        }
                     ]
                  }
               }
            ],
            widgets: [
               {
                  id: "LIST",
                  name: "alfresco/documentlibrary/AlfDocumentList",
                  config: {
                     useHash: true,
                     widgets: [
                        {
                           name: "alfresco/lists/views/AlfListView",
                           config: {
                              itemKey: "index",
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
                        }
                     ]
                  }
               }
            ],
            widgetsForFooter: [
               {
                  id: "CUSTOM_PAGE_SIZE_PAGINATOR",
                  name: "alfresco/lists/Paginator",
                  config: {
                     popupMenusAbove: true,
                     useHash: false,
                     documentsPerPage: 10,
                     hidePageSizeOnWidth: 10,
                     pageSizes: [5,10,20]
                  }
               }
            ]
         }
      }
   ]
};