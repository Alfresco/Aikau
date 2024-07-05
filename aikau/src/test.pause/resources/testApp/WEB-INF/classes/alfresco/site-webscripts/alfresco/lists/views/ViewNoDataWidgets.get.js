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
   widgets: [
      {
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "A list with no data",
            widgets: [
               {
                  id: "LIST_NO_DATA",
                  name: "alfresco/lists/AlfList",
                  config: {
                     pubSubScope: "NO_DATA_",
                     currentData: {
                        items: []
                     },
                     widgets: [
                        {
                           id: "VIEW1",
                           name: "alfresco/lists/views/AlfListView",
                           config: {
                              testCustomFilterData: {
                                 show: true
                              },
                              widgetsForNoDataDisplay: [
                                 {
                                    id: "NO_DATA_WARNING",
                                    name: "alfresco/header/Warning",
                                    config: {
                                       warnings: [
                                          {
                                             message: "No data to display!",
                                             level: 1
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    id: "LOGO1",
                                    name: "alfresco/logo/Logo",
                                    config: {
                                       renderFilter: [
                                          {
                                             target: "testCustomFilterData",
                                             property: "show",
                                             values: [true],
                                             renderOnAbsentProperty: true
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    id: "LOGO2",
                                    name: "alfresco/logo/Logo",
                                    config: {
                                       logoClasses: "surf-logo-large",
                                       renderFilter: [
                                          {
                                             target: "testCustomFilterData",
                                             property: "show",
                                             values: [false],
                                             renderOnAbsentProperty: true
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
      },
      {
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "A list that fails to get data",
            widgets: [
               {
                  id: "LIST_FAILED_DATA",
                  name: "alfresco/lists/AlfSortablePaginatedList",
                  config: {
                     pubSubScope: "DATA_FAIL_",
                     currentPageSize: 10,
                     widgets: [
                        {
                           id: "VIEW2",
                           name: "alfresco/lists/views/AlfListView"
                        }
                     ],
                     widgetsForDataFailureDisplay: [
                        {
                           id: "DATA_FAIL_WARNING",
                           name: "alfresco/header/Warning",
                           config: {
                              warnings: [
                                 {
                                    message: "Data could not be loaded!",
                                    level: 1
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
         // Note: just using any mock xhr service that will fail...
         name: "aikauTesting/mockservices/DocumentLibraryMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};