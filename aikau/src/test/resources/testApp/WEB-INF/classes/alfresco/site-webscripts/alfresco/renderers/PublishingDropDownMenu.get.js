/* global widgetUtils */

// Define a list model that will be used in both the main list on the page and then again in a dialog...
function getView(viewId, pdmId, disablementProperty, publishTopic) {
   var widgets = {
      id: viewId,
      name: "alfresco/lists/views/AlfListView",
      config: {
         subscribeToDocRequests: true,
         currentData: {
            items: [
               {col1:"Test1", col2:"PUBLIC", disabled: false},
               {col1:"Test2", col2:"MODERATED", disabled: true},
               {col1:"Test3", col2:"PRIVATE", disabled: false}
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
                                 id: pdmId,
                                 name: "alfresco/renderers/PublishingDropDownMenu",
                                 config: {
                                    additionalCssClasses: "custom-css",
                                    publishTopic: publishTopic,
                                    publishPayload: {
                                       shortName: {
                                          alfType: "item",
                                          alfProperty: "col1"
                                       }
                                    },
                                    disablementProperty: disablementProperty,
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
   };
   return widgets;
}


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
      "alfresco/services/ErrorReporter",
      "alfresco/services/DialogService",
      "alfresco/services/NotificationService"
   ],
   widgets:[
      getView("LIST_VIEW_1", "PDM", "disabled", "ALF_PUBLISHING_DROPDOWN_MENU"),
      {
         id: "SHOW_DIALOG",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show dialog",
            publishTopic: "ALF_CREATE_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "DIALOG1",
               dialogTitle: "Test dialog",
               widgetsContent: [getView("LIST_VIEW_2", "DIALOG_PDM", null, "CONFIRM_DROPDOWN_PUBLISH")]
            }
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};