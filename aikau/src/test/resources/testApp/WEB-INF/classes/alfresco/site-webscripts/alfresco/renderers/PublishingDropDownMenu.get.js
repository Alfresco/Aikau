/* global widgetUtils */

// Define a list model that will be used in both the main list on the page and then again in a dialog...
var widgets = {
   id: "LIST_VIEW_1",
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
                              id: "PDM",
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
};

// Clone the widgets model so that we can override the ID for the PublishingDropDownMenu
// This needs to be done because otherwise a duplicate ID will attempt to be registered and
// will then be swapped out with an automatically generated one (which will make testing harder)...
var widgetsCopy = JSON.parse(JSON.stringify(widgets));
widgetsCopy.id = "LIST_VIEW_2";
var pdm = widgetUtils.findObject(widgetsCopy, "id", "PDM");
pdm.id = "DIALOG_PDM";

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
      "alfresco/services/DialogService"
   ],
   widgets:[
      widgets,
      {
         id: "SHOW_DIALOG",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show dialog",
            publishTopic: "ALF_CREATE_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "DIALOG1",
               dialogTitle: "Test dialog",
               widgetsContent: [widgetsCopy]
            }
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};