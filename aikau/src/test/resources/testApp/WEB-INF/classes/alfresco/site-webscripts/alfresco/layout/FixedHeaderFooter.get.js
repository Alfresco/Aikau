var noDataMessage = "No data found. This page no longer works without hash parameters. By default, try /FixedHeaderFooter#currentItem";

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
         name: "alfresco/layout/StripedContent",
         config: {
            contentWidth: "960px",
            widgets: [
               {
                  name: "alfresco/layout/FixedHeaderFooter",
                  id: "HEADER_FOOTER",
                  stripeStyle: "margin: 0 0 50px;",
                  config: {
                     height: "300px",
                     widgetsForHeader: [
                        {
                           id: "FIXED_BREADCRUMBS",
                           name: "alfresco/documentlibrary/AlfBreadcrumbTrail",
                           config: {
                              breadcrumbs: [
                                 {
                                    label: "Stairway"
                                 },
                                 {
                                    label: "To"
                                 },
                                 {
                                    label: "Heaven"
                                 }
                              ],
                              visibilityConfig: {
                                 initialValue: false,
                                 rules: [
                                    {
                                       topic: "HEADER_VISIBILITY",
                                       attribute: "value",
                                       isNot: ["HIDE"]
                                    }
                                 ]
                              }
                           }
                        }
                     ],
                     widgets: [
                        {
                           id: "LIST",
                           name: "alfresco/documentlibrary/AlfDocumentList",
                           config: {
                              noDataMessage: noDataMessage,
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
                              useHash: false,
                              documentsPerPage: 10,
                              pageSizes: [5,10,20],
                              visibilityConfig: {
                                 initialValue: false,
                                 rules: [
                                    {
                                       topic: "FOOTER_VISIBILITY",
                                       attribute: "value",
                                       isNot: ["HIDE"]
                                    }
                                 ]
                              }
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         id: "HIDE_HEADER",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Hide header",
            publishTopic: "HEADER_VISIBILITY",
            publishPayload: {
               value: "HIDE"
            }
         }
      },
      {
         id: "SHOW_HEADER",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show header",
            publishTopic: "HEADER_VISIBILITY",
            publishPayload: {
               value: "SHOW"
            }
         }
      },
      {
         id: "HIDE_FOOTER",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Hide footer",
            publishTopic: "FOOTER_VISIBILITY",
            publishPayload: {
               value: "HIDE"
            }
         }
      },
      {
         id: "SHOW_FOOTER",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show footer",
            publishTopic: "FOOTER_VISIBILITY",
            publishPayload: {
               value: "SHOW"
            }
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};