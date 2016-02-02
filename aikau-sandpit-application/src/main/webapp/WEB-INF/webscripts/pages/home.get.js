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
      "alfresco/services/NavigationService",
      "alfresco/services/CrudService"
   ],
   widgets: [
      {
         name: "alfresco/layout/StripedContent",
         config: {
            contentWidth: "1400px",
            widgets: [
               {
                  name: "alfresco/layout/LeftAndRight",
                  stripeClass: "header",
                  className: "share-header-title",
                  config: {
                     semanticWrapper: "header",
                     widgets: [
                        {
                           name: "alfresco/logo/Logo",
                           align: "left",
                           config:
                           {
                              logoClasses: "alfresco-logo-large"
                           }
                        },
                        {
                           name: "alfresco/header/Title",
                           align: "left",
                           config: {
                              label: "Aikau Sandpit",
                              setBrowserTitle: true
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/lists/AlfFilteredList",
                  config: {
                     useHash: true,
                     hashVarsForUpdate: [
                        "currentPage",
                        "currentPageSize"
                     ],
                     filteringTopics: ["_valueChangeOf_FILTER"],
                     loadDataPublishTopic: "ALF_CRUD_GET_ALL",
                     loadDataPublishPayload: {
                       url: "exampleList",
                       urlType: "SHARE"
                     },
                     widgetsForFilters: [
                        {
                           id: "TEXTBOX",
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              fieldId: "FILTER",
                              name: "filter",
                              placeHolder: "Filter by name",
                              label: "Filter results",
                              description: "Enter a value that the name must contain"
                           }
                        },
                        {
                           name: "alfresco/lists/Paginator",
                           config: {
                              documentsPerPage: 10,
                              pageSizes: [10, 25, 50, 100]
                           }
                        }
                     ],
                     widgets: [
                        {
                           name: "alfresco/lists/views/AlfListView",
                           config: {
                              additionalCssClasses: "bordered",
                              widgetsForHeader: [
                                 {
                                    name: "alfresco/lists/views/layouts/HeaderCell",
                                    config: {
                                       label: "Name"
                                    }
                                 },
                                 {
                                    name: "alfresco/lists/views/layouts/HeaderCell",
                                    config: {
                                       label: "Description"
                                    }
                                 }
                              ],
                              widgets: [
                                 {
                                    name: "alfresco/lists/views/layouts/Row",
                                    config: {
                                       additionalCssClasses: "zebra-striping",
                                       widgets: [
                                          {
                                             name: "alfresco/lists/views/layouts/Cell",
                                             config: {
                                                additionalCssClasses: "mediumpad",
                                                widgets: [
                                                   {
                                                      name: "alfresco/renderers/PropertyLink",
                                                      config: {
                                                         propertyToRender: "shortname",
                                                         useCurrentItemAsPayload: false,
                                                         publishTopic: "ALF_NAVIGATE_TO_PAGE",
                                                         publishPayloadType: "PROCESS",
                                                         publishPayloadModifiers: ["processCurrentItemTokens"],
                                                         publishPayload: {
                                                            type: "PAGE_RELATIVE",
                                                            url: "na/ws{url}"
                                                         }
                                                      }
                                                   }
                                                ]
                                             }
                                          },
                                          {
                                             name: "alfresco/lists/views/layouts/Cell",
                                             config: {
                                                additionalCssClasses: "mediumpad",
                                                widgets: [
                                                   {
                                                      name: "alfresco/renderers/Property",
                                                      config: {
                                                         propertyToRender: "description"
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
      }
   ]
};