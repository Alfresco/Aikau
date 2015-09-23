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
      "alfresco/services/SearchService"
   ],
   widgets:[
      {
         name: "aikauTesting/WaitForMockXhrService",
         config: {
            widgets: [
               {
                  id: "FCTSRCH_TOP_MENU_BAR_SCOPE_MENU_BAR",
                  name: "alfresco/menus/AlfMenuBar",
                  config: {
                     widgets: [
                        {
                           id: "FCTSRCH_SCOPE_SELECTION_MENU",
                           name: "alfresco/menus/AlfMenuBarSelect",
                           config: {
                              selectionTopic: "ALF_SEARCHLIST_SCOPE_SELECTION",
                              widgets: [
                                 {
                                    id: "FCTSRCH_SCOPE_SELECTION_MENU_GROUP",
                                    name: "alfresco/menus/AlfMenuGroup",
                                    config: {
                                       widgets: [
                                          {
                                             id: "FCTSRCH_SET_SPECIFIC_SITE_SCOPE",
                                             name: "alfresco/menus/AlfCheckableMenuItem",
                                             config: {
                                                label: "Site",
                                                value: "site",
                                                group: "SEARCHLIST_SCOPE",
                                                publishTopic: "ALF_SEARCHLIST_SCOPE_SELECTION",
                                                checked: false,
                                                hashName: "scope",
                                                publishPayload: {
                                                   label: "Site",
                                                   value: "site"
                                                }
                                             }
                                          },
                                          {
                                             id: "FCTSRCH_SET_ALL_SITES_SCOPE",
                                             name: "alfresco/menus/AlfCheckableMenuItem",
                                             config: {
                                                label: "All Sites",
                                                value: "all_sites",
                                                group: "SEARCHLIST_SCOPE",
                                                publishTopic: "ALF_SEARCHLIST_SCOPE_SELECTION",
                                                checked: false,
                                                hashName: "scope",
                                                publishPayload: {
                                                   label: "All Sites",
                                                   value: "all_sites"
                                                }
                                             }
                                          },
                                          {
                                             id: "FCTSRCH_SET_REPO_SCOPE",
                                             name: "alfresco/menus/AlfCheckableMenuItem",
                                             config: {
                                                label: "Repository",
                                                value: "repo",
                                                group: "SEARCHLIST_SCOPE",
                                                publishTopic: "ALF_SEARCHLIST_SCOPE_SELECTION",
                                                checked: true,
                                                hashName: "scope",
                                                publishPayload: {
                                                   label: "Repository",
                                                   value: "repo"
                                                }
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
                  name: "alfresco/search/AlfSearchList",
                  config: {
                     viewPreferenceProperty: "org.alfresco.share.searchList.viewRendererName",
                     view: "simple",
                     waitForPageWidgets: false,
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
                           name: "alfresco/search/AlfSearchListView",
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
                                    name: "alfresco/lists/views/layouts/HeaderCell",
                                    config: {
                                       label: "Thumbnail",
                                       className: "hiddenAccessible",
                                       a11yScope: "col"
                                    }
                                 },
                                 {
                                    name: "alfresco/lists/views/layouts/HeaderCell",
                                    config: {
                                       label: "Details",
                                       className: "hiddenAccessible",
                                       a11yScope: "col"
                                    }
                                 },
                                 {
                                    name: "alfresco/lists/views/layouts/HeaderCell",
                                    config: {
                                       label: "Actions",
                                       className: "hiddenAccessible",
                                       a11yScope: "col"
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
         name: "aikauTesting/mockservices/SearchMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};