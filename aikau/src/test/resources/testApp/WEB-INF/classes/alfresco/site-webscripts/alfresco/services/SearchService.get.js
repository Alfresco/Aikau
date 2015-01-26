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
         name: "alfresco/services/NavigationService"
      },
      {
         name: "alfresco/services/SearchService"
      },
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         id: "FCTSRCH_SEARCH_FORM",
         name: "alfresco/forms/SingleTextFieldForm",
         config: {
            useHash: true,
            okButtonLabel: "Ok",
            okButtonPublishTopic: "ALF_SET_SEARCH_TERM",
            okButtonPublishGlobal: true,
            okButtonIconClass: "alf-white-search-icon",
            okButtonClass: "call-to-action",
            textFieldName: "searchTerm",
            textBoxIconClass: "alf-search-icon",
            textBoxCssClasses: "long hiddenlabel",
            textBoxLabel: "Search box"
         }
      },
      {
         id: "FCTSRCH_SEARCH_RESULTS_LIST",
         name: "alfresco/documentlibrary/AlfSearchList",
         config: {
            viewPreferenceProperty: "org.alfresco.share.searchList.viewRendererName",
            view: "simple",
            waitForPageWidgets: true,
            useHash: true,
            hashVarsForUpdate: [
               "searchTerm",
               "facetFilters",
               "sortField",
               "sortAscending",
               "allSites",
               "repo",
               "searchScope",
               "query"
            ],
            selectedScope: "REPO",
            useInfiniteScroll: true,
            siteId: null,
            rootNode: null,
            repo: true,
            additionalControlsTarget: "FCTSRCH_RESULTS_MENU_BAR",
            widgets: [
               {
                  id: "FCTSRCH_SEARCH_ADVICE_NO_RESULTS",
                  name: "alfresco/documentlibrary/views/AlfSearchListView",
                  config: {
                     searchAdviceTitle: "faceted-search.advice.title",
                     searchAdvice: [
                        "faceted-search.advice.suggestion1",
                        "faceted-search.advice.suggestion2",
                        "faceted-search.advice.suggestion3"
                     ],
                     a11yCaption: "Faceted Search Results",
                     a11yCaptionClass: "hiddenAccessible",
                     widgetsForHeader: [
                        {
                           name: "alfresco/documentlibrary/views/layouts/HeaderCell",
                           config: {
                              label: "Thumbnail",
                              class: "hiddenAccessible",
                              a11yScope: "col"
                           }
                        },
                        {
                           name: "alfresco/documentlibrary/views/layouts/HeaderCell",
                           config: {
                              label: "Details",
                              class: "hiddenAccessible",
                              a11yScope: "col"
                           }
                        },
                        {
                           name: "alfresco/documentlibrary/views/layouts/HeaderCell",
                           config: {
                              label: "Actions",
                              class: "hiddenAccessible",
                              a11yScope: "col"
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/documentlibrary/AlfDocumentListInfiniteScroll"
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/SearchMockXhr"
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};