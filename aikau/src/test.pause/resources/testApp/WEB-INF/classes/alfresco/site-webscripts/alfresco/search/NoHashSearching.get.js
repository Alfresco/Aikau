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
      "alfresco/services/SearchService",
      "alfresco/services/NavigationService"
   ],
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
                                    id: "FCTSRCH_SET_ALL_SITES_SCOPE",
                                    name: "alfresco/menus/AlfCheckableMenuItem",
                                    config: {
                                       label: "All Sites",
                                       value: "all_sites",
                                       group: "SEARCHLIST_SCOPE",
                                       publishTopic: "ALF_SEARCHLIST_SCOPE_SELECTION",
                                       checked: false,
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
         name: "alfresco/forms/SingleComboBoxForm",
         config: {
            useHash: false,
            okButtonLabel: "OK",
            okButtonPublishTopic : "ALF_SET_SEARCH_TERM",
            okButtonPublishGlobal: true,
            okButtonIconClass: "alf-white-search-icon",
            okButtonClass: "call-to-action",
            textFieldName: "searchTerm",
            textBoxIconClass: "alf-search-icon",
            textBoxCssClasses: "long hiddenlabel",
            textBoxLabel: "Search",
            queryAttribute: "term",
            optionsPublishTopic: "ALF_AUTO_SUGGEST_SEARCH",
            optionsPublishPayload: {
               resultsProperty: "response.suggestions"
            }
         }
      },
      {
         id: "ALTERNATIVE_SEARCH",
         name: "alfresco/search/AlternativeSearchLabel",
         config: {
            useHash: false,
            visibilityConfig: {
               initialValue: false,
               rules: [
                  {
                     topic: "ALF_SEARCH_REQUEST",
                     attribute: "term",
                     isNot: [""]
                  },
                  {
                     topic: "ALF_SPELL_CHECK_SEARCH_TERM",
                     attribute: "searchedFor",
                     is: ["home"]
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/search/FacetFilters",
         config: {
            additionalCssClasses: "separated",
            label: "Created",
            facetQName: "{http://www.alfresco.org/model/content/1.0}created",
            sortBy: "INDEX",
            maxFilters: 5,
            hitThreshold: 1,
            minFilterValueLength: 4,
            useHash: false,
            headingLevel: 3,
            blockIncludeFacetRequest: false
         }
      },
      {
         id: "SEARCH_RESULTS_LIST",
         name: "alfresco/search/AlfSearchList",
         config: {
            waitForPageWidgets: true,
            useHash: false,
            widgets: [
               {
                  id: "SEARCH_RESULTS_VIEW",
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
         name: "aikauTesting/mockservices/SearchMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};