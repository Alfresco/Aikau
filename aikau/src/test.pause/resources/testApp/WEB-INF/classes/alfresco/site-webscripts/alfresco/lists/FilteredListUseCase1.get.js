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
      "aikauTesting/mockservices/PublishingDropDownMenuMockService",
      "alfresco/services/DialogService",
      {
         name: "aikauTesting/mockservices/PaginationService",
         config: {
            loadDataSubscriptionTopic: "ALF_RETRIEVE_DOCUMENTS_REQUEST"
         }
      },
      "alfresco/services/NavigationService"
   ],
   widgets:[
      {
         name: "alfresco/layout/TitleDescriptionAndContent",
         config: {
            title: "Filtered List (Use Case 1)",
            description: "In this example the displayed filter will not perform any action, the purpose of this test page " +
                         "is to verify that displaying a dialog will not cause the list to reload",
            widgets: [
               {
                  name: "alfresco/lists/AlfFilteredList",
                  config: {
                     noDataMessage: "No data",
                     filteringTopics: ["_valueChangeof_FILTER"],
                     useHash: true,
                     sortField: "cm:userName",
                     widgetsForFilters: [{
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              fieldId: "TEXTBOX_FILTER",
                              name: "nameFilter",
                              placeHolder: "Enter filter...",
                              label: "Filter"
                           }
                        }
                     ],
                     currentPageSize: 1,
                     widgets: [
                        {
                           id: "LIST_VIEW",
                           name: "alfresco/lists/views/AlfListView",
                           config: {
                              widgets:[
                                 {
                                    name: "alfresco/lists/views/layouts/Row",
                                    config: {
                                       widgets: [
                                          {
                                             name: "alfresco/lists/views/layouts/Cell",
                                             config: {
                                                widgets: [
                                                   {
                                                      id: "PDM",
                                                      name: "alfresco/renderers/PublishingDropDownMenu",
                                                      config: {
                                                         additionalCssClasses: "custom-css",
                                                         publishTopic: "ALF_CREATE_DIALOG_REQUEST",
                                                         publishPayload: {
                                                            dialogTitle: "Title",
                                                            handleOverflow: false,
                                                            textContent: "Test",
                                                            widgetsButtons: [
                                                               {
                                                                  name: "alfresco/buttons/AlfButton",
                                                                  id: "OK",
                                                                  config: {
                                                                     label: "OK",
                                                                     publishTopic: "CONFIRMATION",
                                                                     publishPayload: {}
                                                                  }
                                                               },
                                                               {
                                                                  name: "alfresco/buttons/AlfButton",
                                                                  id: "CANCEL",
                                                                  config: {
                                                                     label: "Cancel",
                                                                     publishTopic: "CANCEL"
                                                                  }
                                                               }
                                                            ]
                                                         },
                                                         propertyToRender: "index",
                                                         optionsConfig: {
                                                            fixed: [
                                                               {label: "Public", value: "PUBLIC"},
                                                               {label: "Moderated", value: "MODERATED"},
                                                               {label: "Private", value: "PRIVATE"}
                                                            ]
                                                         },
                                                         cancellationPublishTopic: "CANCEL_UPDATE",
                                                         cancellationPublishPayloadType: "CURRENT_ITEM"
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
            ]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};