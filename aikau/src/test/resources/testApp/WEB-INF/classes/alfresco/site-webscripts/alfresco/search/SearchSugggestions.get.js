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
      "alfresco/services/NavigationService",
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         id: "ALTERNATIVE_SEARCH",
         name: "alfresco/search/AlternativeSearchLabel",
         config: {
            visibilityConfig: {
               initialValue: false,
               rules: [
                  {
                     topic: "ALF_SEARCH_REQUEST",
                     attribute: "dummy",
                     is: [""]
                  },
                  {
                     topic: "ALF_SPELL_CHECK_SEARCH_TERM",
                     attribute: "searchedFor",
                     isNot: [""]
                  }
               ]
            }
         }
      },
      {
         id: "SEARCHED_ON",
         name: "alfresco/documentlibrary/views/AlfDocumentListView",
         config: {
            subscribeToDocRequests: true,
            documentSubscriptionTopic: "ALF_SPELL_CHECK_SEARCH_SUGGESTIONS",
            itemsProperty: "searchSuggestions",
            widgets: [
               {
                  name: "alfresco/documentlibrary/views/layouts/Row",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/documentlibrary/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/renderers/PropertyLink",
                                    config: {
                                       useCurrentItemAsPayload: false,
                                       propertyToRender: "term",
                                       publishTopic: "ALF_NAVIGATE_TO_PAGE",
                                       publishPayloadType: "PROCESS",
                                       publishPayloadModifiers: ["processCurrentItemTokens"],
                                       publishPayload: {
                                          type: "HASH",
                                          url: "searchTerm={term}"
                                       }
                                    }
                                 }
                              ]
                           }
                        }
                     ]
                  }
               }
            ],
            visibilityConfig: {
               initialValue: false,
               rules: [
                  {
                     topic: "ALF_SEARCH_REQUEST",
                     attribute: "dummy",
                     is: [""]
                  },
                  {
                     topic: "ALF_SPELL_CHECK_SEARCH_SUGGESTIONS",
                     attribute: "searchSuggestions",
                     isNot: [""]
                  }
               ]
            }
         }
      },
      {
         id: "SEARCH_RESULTS_LIST",
         name: "alfresco/documentlibrary/AlfSearchList",
         config: {
            waitForPageWidgets: true,
            loadDataPublishTopic: "SEARCH_RESULTS",
            widgets: [
               {
                  id: "SEARCH_RESULTS_VIEW",
                  name: "alfresco/documentlibrary/views/AlfDocumentListView",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/documentlibrary/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/documentlibrary/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "displayName"
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
         id: "SIM_ALT_SEARCH",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Suggested Term Used",
            publishTopic: "SEARCH_RESULTS_SUCCESS",
            publishPayload: {
               response: {
                  items: [
                     {
                        displayName: "Result 1"
                     },
                     {
                        displayName: "Result 2"
                     },
                     {
                        displayName: "Result 3"
                     }
                  ],
                  spellcheck: {
                     searchedFor: "test",
                     searchRequest: "tast"
                  }
               }
            }
         }
      },
      {
         id: "SIM_SEARCH_SUGGESTIONS",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Suggestions Provided",
            publishTopic: "SEARCH_RESULTS_SUCCESS",
            publishPayload: {
               response: {
                  items: [
                     {
                        displayName: "Result 1"
                     },
                     {
                        displayName: "Result 2"
                     },
                     {
                        displayName: "Result 3"
                     }
                  ],
                  spellcheck: {
                     searchRequest: "tast",
                     searchSuggestions: [
                        "test",
                        "tests",
                        "testing"
                     ]
                  }
               }
            }
         }
      },
      {
         id: "SIM_NORMAL_SEARCH",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Original Search Term Used",
            publishTopic: "SEARCH_RESULTS_SUCCESS",
            publishPayload: {
               response: {
                  items: [
                     {
                        displayName: "Result 1"
                     },
                     {
                        displayName: "Result 2"
                     },
                     {
                        displayName: "Result 3"
                     }
                  ],
                  spellcheck: {

                  }
               }
            }
         }
      },
      {
         id: "SIM_SEARCH_REQUEST",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "New Search Request",
            publishTopic: "ALF_SEARCH_REQUEST",
            publishPayload: {
               term: "test"
            }
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