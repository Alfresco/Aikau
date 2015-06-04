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
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         name: "alfresco/lists/views/AlfListView",
         config: {
            subscribeToDocRequests: true,
            currentData: {
               items: [
                  {col1:"Test1", col2:"PUBLIC"},
                  {col1:"Test2", col2:"MODERATED"},
                  {col1:"Test3", col2:"PRIVATE"}
               ]
            },
            widgetsForHeader: [
               {
                  name: "alfresco/lists/views/layouts/HeaderCell",
                  config: {
                     label: "Heading 1"
                  }
               },
               {
                  name: "alfresco/lists/views/layouts/HeaderCell",
                  config: {
                     label: "Heading 2"
                  }
               }
            ],
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
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "col1",
                                       renderAsLink: false
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           name: "alfresco/lists/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/renderers/PublishingDropDownMenu",
                                    config: {
                                       publishTopic: "ALF_PUBLISHING_DROPDOWN_MENU",
                                       publishPayload: {
                                          shortName: {
                                             alfType: "item",
                                             alfProperty: "col1"
                                          }
                                       },
                                       propertyToRender: "col2",
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
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};