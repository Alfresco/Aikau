/* global model */
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
      "alfresco/services/UserService"
   ],
   widgets: [
      {
         name: "alfresco/lists/AlfFilteredList",
         config: {
            loadDataPublishTopic: "ALF_GET_USERS",
            sortField: "fullName",
            currentPageSize: 10,
            filteringTopics: ["_valueChangeOf_FILTER"],
            widgetsForFilters: [
               {
                  id: "FILTER_TEXTBOX",
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     fieldId: "FILTER",
                     name: "filter",
                     placeHolder: "Filter by name",
                     label: "Name filter"
                  }
               },
               {
                  id: "HASH_CUSTOM_PAGE_SIZE_PAGINATOR",
                  name: "alfresco/lists/Paginator",
                  config: {
                     useHash: false,
                     documentsPerPage: 10,
                     pageSizes: [5,10,20],
                     widgetsAfter: [
                        {
                           id: "SORTFIELD",
                           name: "alfresco/menus/AlfMenuBarSelect",
                           config: {
                              selectionTopic: "ALF_DOCLIST_SORT",
                              widgets: [
                                 {
                                    id: "SORTFIELD_GROUP",
                                    name: "alfresco/menus/AlfMenuGroup",
                                    config: {
                                       widgets: [
                                          {
                                             id: "SORT_BY_FULLNAME",
                                             name: "alfresco/menus/AlfCheckableMenuItem",
                                             config: {
                                                label: "Full Name",
                                                value: "fullName",
                                                group: "USER_SORTING",
                                                publishTopic: "ALF_DOCLIST_SORT",
                                                checked: true,
                                                publishPayload: {
                                                   label: "Full Name",
                                                   direction: "ascending"
                                                }
                                             }
                                          },
                                          {
                                             id: "SORT_BY_USERNAME",
                                             name: "alfresco/menus/AlfCheckableMenuItem",
                                             config: {
                                                label: "User Name",
                                                value: "userName",
                                                group: "USER_SORTING",
                                                publishTopic: "ALF_DOCLIST_SORT",
                                                checked: false,
                                                publishPayload: {
                                                   label: "User Name",
                                                   direction: "ascending"
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
                           id: "ASCENDING",
                           name: "alfresco/menus/AlfMenuBarItem",
                           config: {
                              label: "Ascending",
                              publishTopic: "ALF_DOCLIST_SORT",
                              publishPayload: {
                                 direction: "ascending"
                              }
                           }
                        },
                        {
                           id: "DESCENDING",
                           name: "alfresco/menus/AlfMenuBarItem",
                           config: {
                              label: "Descending",
                              publishTopic: "ALF_DOCLIST_SORT",
                              publishPayload: {
                                 direction: "descending"
                              }
                           }
                        }
                     ]
                  }
               }
            ],
            widgets: [
               {
                  name: "alfresco/lists/views/HtmlListView",
                  config: {
                     propertyToRender: "displayName"
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/UserMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};