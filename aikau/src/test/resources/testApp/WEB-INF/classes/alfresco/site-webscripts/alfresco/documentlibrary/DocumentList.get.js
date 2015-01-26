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
         id: "SORT_ASC_REQUEST",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Sort Request (ascending)",
            publishTopic: "ALF_DOCLIST_SORT",
            publishPayload: {
               direction: "ascending",
               value: "cm:name"
            }
         }
      },
      {
         id: "SORT_DESC_REQUEST",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Sort Request (descending)",
            publishTopic: "ALF_DOCLIST_SORT",
            publishPayload: {
               direction: "descending"
            }
         }
      },
      {
         id: "SORT_FIELD_SELECTION",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Sort Field",
            publishTopic: "ALF_DOCLIST_SORT_FIELD_SELECTION",
            publishPayload: {
               value: "cm:title"
            }
         }
      },
      {
         id: "SHOW_FOLDERS",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show Folders",
            publishTopic: "ALF_DOCLIST_SHOW_FOLDERS",
            publishPayload: {
               selected: true
            }
         }
      },
      {
         id: "HIDE_FOLDERS",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Hide Folders",
            publishTopic: "ALF_DOCLIST_SHOW_FOLDERS",
            publishPayload: {
               selected: false
            }
         }
      },
      {
         id: "SET_PAGE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set Page",
            publishTopic: "ALF_DOCLIST_PAGE_SELECTED",
            publishPayload: {
               value: 2
            }
         }
      },
      {
         id: "SET_DOCS_PER_PAGE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set Docs Per Page",
            publishTopic: "ALF_DOCLIST_DOCS_PER_PAGE_SELECTION",
            publishPayload: {
               value: 6
            }
         }
      },
      {
         id: "FILTER_CHANGE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set Filter",
            publishTopic: "ALF_DOCLIST_FILTER_CHANGED",
            publishPayload: {
               filterId: "path",
               filterData: "/test",
               filterDisplay: ""
            }
         }
      },
      {
         id: "PUBLISH_DATA",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Fake Data",
            publishTopic: "ALF_RETRIEVE_DOCUMENTS_REQUEST_SUCCESS",
            publishPayload: {
               response: {
                  totalRecords: 3,
                  totalRecordsUpper: 3,
                  startIndex: 0,
                  numberFound: 3,
                  items: [
                     {
                        name: "Res1",
                        title: "Result 1"
                     },
                     {
                        name: "Res2",
                        title: "Result 2"
                     },
                     {
                        name: "Res3",
                        title: "Result 2"
                     }
                  ]
               }
            }
         }
      },
      {
         id: "CHANGE_VIEW",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Change View",
            publishTopic: "ALF_DOCLIST_SELECT_VIEW",
            publishPayload: {
               value: "VIEW2"
            }
         }
      },
      
      {
         name: "alfresco/documentlibrary/AlfDocumentList",
         config: {
            useHash: false,
            currentPageSize: 3,
            currentPath: "/",
            showFolders: true,
            siteId: "fake-site",
            containerId: "documentlibrary",
            sortAscending: false,
            sortField: "cm:title",
            view: "VIEW1",
            widgets: [
               {
                  name: "alfresco/documentlibrary/views/AlfDocumentListView",
                  config: {
                     viewSelectionConfig: {
                        label: "View 1",
                        value: "VIEW1"
                     },
                     widgets: [
                        {
                           name: "alfresco/documentlibrary/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/documentlibrary/views/layouts/Cell",
                                    config: {
                                       widgets:[
                                          {
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "name"
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
                  name: "alfresco/documentlibrary/views/AlfDocumentListView",
                  config: {
                     viewSelectionConfig: {
                        label: "View 2",
                        value: "VIEW2"
                     },
                     widgets: [
                        {
                           name: "alfresco/documentlibrary/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/documentlibrary/views/layouts/Cell",
                                    config: {
                                       widgets:[
                                          {
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "name"
                                             }
                                          },
                                          {
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "title"
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
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};