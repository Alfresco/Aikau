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
         name: "alfresco/logging/DebugLog"
      }
   ]
};