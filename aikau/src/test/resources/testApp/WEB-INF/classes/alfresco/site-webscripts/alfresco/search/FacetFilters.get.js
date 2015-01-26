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
         name: "alfresco/services/ActionService"
      },
      {
         name: "alfresco/services/NavigationService"
      },
      {
         name: "alfresco/services/SearchService"
      },
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         id: "FACETS",
         name: "alfresco/layout/VerticalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     id: "DO_FACET_BUTTON_1",
                     label: "Publish facet data 1",
                     publishTopic: "ALF_FACET_RESULTS_FACET1QNAME",
                     publishPayload: {
                        activeFilters: null,
                        facetResults: [
                           {
                              label: "result 1",
                              value: "result 1",
                              hits: 10
                           },
                           {
                              label: "result 2",
                              value: "result 2",
                              hits: 9
                           },
                           {
                              label: "result 3",
                              value: "result 3",
                              hits: 8
                           },
                           {
                              label: "result 4",
                              value: "result 4",
                              hits: 7
                           }
                        ]
                     }
                  }
               },
               {
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     id: "DO_FACET_BUTTON_2",
                     label: "Publish facet data 2",
                     publishTopic: "ALF_FACET_RESULTS_FACET1QNAME",
                     publishPayload: {
                        activeFilters: null,
                        facetResults: [
                           {
                              label: "result 5",
                              value: "result 5",
                              hits: 106
                           },
                           {
                              label: "result 6",
                              value: "result 6",
                              hits: 56
                           }
                        ]
                     }
                  }
               },
               {
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     id: "DO_FACET_BUTTON_3",
                     label: "Publish facet data 3",
                     publishTopic: "ALF_FACET_RESULTS_FACET1QNAME",
                     publishPayload: {
                        activeFilters: null,
                        facetResults: [
                           {
                              label: "result 7",
                              value: "result 7",
                              hits: 106
                           },
                           {
                              label: "result 8",
                              value: "result 8",
                              hits: 56
                           },
                           {
                              label: "result 9",
                              value: "result 9",
                              hits: 45
                           },
                           {
                              label: "result 10",
                              value: "result 10",
                              hits: 24
                           },
                           {
                              label: "result 11",
                              value: "result 11",
                              hits: 18
                           },
                           {
                              label: "result 12",
                              value: "result 12",
                              hits: 2
                           }
                        ]
                     }
                  }
               },
               {
                  id: "FACET1",
                  name: "alfresco/search/FacetFilters",
                  config: {
                     label: "Facet 1",
                     facetQName: "FACET1QNAME",
                     sortBy: "ASCENDING",
                     maxFilters: 5
                  }
               },
               {
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     id: "DO_FACET_BUTTON_4",
                     label: "Publish facet data 4",
                     publishTopic: "ALF_FACET_RESULTS_FACET2QNAME",
                     publishPayload: {
                        activeFilters: null,
                        facetResults: [
                           {
                              label: "facFil1",
                              value: "facFil1",
                              hits: 789
                           },
                           {
                              label: "facFil2",
                              value: "facFil2",
                              hits: 456
                           },
                           {
                              label: "facFil3",
                              value: "facFil3",
                              hits: 2
                           }
                        ]
                     }
                  }
               },
               {
                  id: "FACET2",
                  name: "alfresco/search/FacetFilters",
                  config: {
                     label: "Facet 2 (useHash=true)",
                     facetQName: "FACET2QNAME",
                     sortBy: "ASCENDING",
                     maxFilters: 5,
                     useHash: true
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