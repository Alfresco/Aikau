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
         id: "TDAC",
         name: "alfresco/layout/TitleDescriptionAndContent",
         config: {
            title: "Aikau Unit Tests",
            description: "This page provides links to all the Aikau unit test pages.",
            widgets: [
               {
                  name: "alfresco/lists/AlfList",
                  config: {
                     loadDataPublishTopic: "ALF_CRUD_GET_ALL",
                     loadDataPublishPayload: {
                       url: "unitTestList",
                       urlType: "SHARE"
                     },
                     itemsProperty: "unitTestPages",
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
                                                            type: "SHARE_PAGE_RELATIVE",
                                                            url: "tp/ws{url}"
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