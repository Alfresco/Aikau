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
         name: "alfresco/services/NavigationService"
      },
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         id: "SET_SEARCH_TERM_1",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set Search Term (no data)",
            publishTopic: "ALF_SET_SEARCH_TERM",
            publishPayload: {
               junk: "data"
            }
         }
      },
      {
         id: "SET_SEARCH_TERM_2",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set Search Term (testTerm1)",
            publishTopic: "ALF_SET_SEARCH_TERM",
            publishPayload: {
               searchTerm: "testTerm1"
            }
         }
      },
      {
         id: "SET_SEARCH_TERM_3",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set Search Term (testTerm2)",
            publishTopic: "ALF_SET_SEARCH_TERM",
            publishPayload: {
               searchTerm: "testTerm2"
            }
         }
      },
      {
         id: "SET_SCOPE_0",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set Scope (none)",
            publishTopic: "ALF_SEARCHLIST_SCOPE_SELECTION",
            publishPayload: {
            }
         }
      },
      {
         id: "SET_SCOPE_1",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set Scope (repo)",
            publishTopic: "ALF_SEARCHLIST_SCOPE_SELECTION",
            publishPayload: {
               value: "repo"
            }
         }
      },
      {
         id: "SET_SCOPE_2",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set Scope (all_sites)",
            publishTopic: "ALF_SEARCHLIST_SCOPE_SELECTION",
            publishPayload: {
               value: "all_sites"
            }
         }
      },
      {
         id: "SET_SCOPE_3",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set Scope (site1)",
            publishTopic: "ALF_SEARCHLIST_SCOPE_SELECTION",
            publishPayload: {
               value: "site1"
            }
         }
      },
      {
         id: "SET_MULTIPLE_SEARCH_DATA",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set Multiple Search Attributes",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            publishPayload: {
               url: "searchTerm=testTerm2&facetFields=qname1&facetFilters=filter1,filter2,filter3&sortAscending=false&sortField=cm:title",
               type: "HASH"
            }
         }
      },
      {
         id: "SET_MULTIPLE_SEARCH_DATA_2",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set Multiple Search Attributes",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            publishPayload: {
               url: "searchTerm=testTerm3&facetFields=qname1&facetFilters=filter1,filter2,filter3&sortAscending=false&sortField=cm:title",
               type: "HASH"
            }
         }
      },
      {
         id: "REMOVE_FACET_FILTER",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Remove Facet Filter",
            publishTopic: "ALF_REMOVE_FACET_FILTER",
            publishPayload: {
               filter: "filter2"
            }
         }
      },
      {
         id: "APPLY_FACET_FILTER_0",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Apply Facet Filter (none)",
            publishTopic: "ALF_APPLY_FACET_FILTER",
            publishPayload: {}
         }
      },
      {
         id: "APPLY_FACET_FILTER",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Apply Facet Filter",
            publishTopic: "ALF_APPLY_FACET_FILTER",
            publishPayload: {
               filter: "filter4"
            }
         }
      },
      {
         id: "INCLUDE_FACET_0",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Include Facet (none)",
            publishTopic: "ALF_INCLUDE_FACET",
            publishPayload: {}
         }
      },
      {
         id: "INCLUDE_FACET_1",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Include Facet (qname1)",
            publishTopic: "ALF_INCLUDE_FACET",
            publishPayload: {
               qname: "qname1"
            }
         }
      },
      {
         id: "INCLUDE_FACET_2",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Include Facet (qname2)",
            publishTopic: "ALF_INCLUDE_FACET",
            publishPayload: {
               qname: "qname2"
            }
         }
      },
      {
         id: "PUBLISH_SEARCH_RESULTS",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Fake Search Response",
            publishTopic: "ALF_RETRIEVE_DOCUMENTS_REQUEST_SUCCESS",
            publishPayload: {
               response: {
                  totalRecords: 3,
                  totalRecordsUpper: 3,
                  startIndex: 0,
                  numberFound: 3,
                  facets: {
                     "@qname1": {
                        test: 3
                     }
                  },
                  items: [
                     {
                        name: "Res1"
                     },
                     {
                        name: "Res2"
                     },
                     {
                        name: "Res3"
                     }
                  ]
               }
            }
         }
      },
      {
         name: "alfresco/documentlibrary/AlfSearchList",
         config: {
            useHash: true,
            hashVarsForUpdate: [
               "searchTerm",
               "facetFilters",
               "sortField",
               "sortAscending"
            ],
            blockConcurrentRequests: false,
            widgets: [
               {
                  name: "alfresco/documentlibrary/views/AlfSearchListView"
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