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
      }
   ],
   widgets: [
      {
         id: "DOCUMENT_LIST",
         name: "alfresco/documentlibrary/AlfDocumentList",
         config: {
            useHash: true,
            currentPath: "/",
            siteId: "fake-site",
            containerId: "documentlibrary",
            filteringTopics: ["_valueChangeOf_FILTER"],
            widgetsForFilters: [
               {
                  id: "COMPOSITE_DROPDOWN",
                  name: "alfresco/forms/controls/RadioButtons",
                  config: {
                     fieldId: "DROPDOWN_FILTER",
                     name: "dataType",
                     label: "Document List Type...",
                     value: "PERSONAL",
                     optionsConfig: {
                        fixed: [
                           {
                              label: "Personal Files",
                              value: "PERSONAL"
                           },
                           {
                              label: "Document Libraries",
                              value: "DOCLIBS"
                           }
                        ],
                        queryAttribute: "label",
                        labelAttribute: "label",
                        valueAttribute: "value"
                     }
                  }
               }
            ],
            widgets: [
               {
                  id: "VIEW",
                  name: "alfresco/lists/views/AlfListView",
                  config: {
                     widgets: [
                        {
                           id: "ROW",
                           name: "alfresco/lists/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    id: "CELL",
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets:[
                                          {
                                             id: "PROPERTY",
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "name"
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
         id: "PUBLISH_DATA",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Fake Data",
            publishTopic: "ALF_RETRIEVE_DOCUMENTS_REQUEST_SUCCESS",
            publishPayload: {
               response: {
                  totalRecords: 3,
                  totalRecordsUpper: 3,
                  startIndex: 0,
                  numberFound: 3,
                  items: [
                     {
                        name: "Res1",
                        title: "Result 1"
                     },
                     {
                        name: "Res2",
                        title: "Result 2"
                     },
                     {
                        name: "Res3",
                        title: "Result 2"
                     }
                  ]
               }
            }
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};