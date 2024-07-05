/* global page */
var value = null;
if (page.url.args.preset)
{
   value = [
      {
         name:"bob",
         label:"Item 1",
         type: ["widget"],
         config:{
            widgets:[
               {
                  name:"ted",
                  label:"Item 2",
                  type: ["not_a_widget"]
               }
            ]
         }
      },
      {
         name:"bob",
         label:"Item 1",
         type: ["widget"]
      }
   ];
}

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
      {
         name: "alfresco/services/DragAndDropModellingService",
         config: {
            models: [
               {
                  property: "name",
                  targetValues: ["bob"],
                  widgetsForConfig: [
                     // No config
                  ],
                  widgetsForDisplay: [
                     {
                        name: "alfresco/dnd/DroppedNestingItemWrapper",
                        config: {
                           showEditButton: false,
                           label: "{label}",
                           value: "{value}",
                           type: "{type}",
                           widgets: [
                              {
                                 name: "alfresco/dnd/DragAndDropNestedTarget",
                                 config: {
                                    useModellingService: true,
                                    label: "Widgets",
                                    targetProperty: "config.widgets",
                                    acceptTypes: [ "not_a_widget", "something_else" ]
                                 }
                              }
                           ]
                        }
                     }
                  ]
               },
               {
                  property: "name",
                  targetValues: ["ted"],
                  widgetsForConfig: [
                     // No config
                  ],
                  widgetsForDisplay: [
                     {
                        name: "alfresco/dnd/DroppedNestingItemWrapper",
                        config: {
                           showEditButton: false,
                           label: "{label}",
                           value: "{value}",
                           type: "{type}",
                           widgets: [
                              {
                                 name: "alfresco/dnd/DroppedItem"
                              }
                           ]
                        }
                     }
                  ]
               }

            ]
         }
      },
      "alfresco/services/DialogService"
   ],
   widgets: [
      {
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  id: "DRAG_PALETTE1",
                  name: "alfresco/dnd/DragAndDropItems",
                  config: {
                     items: [
                        {
                           type: [ "widget"],
                           label: "Item 1",
                           value: {
                              name: "bob"
                           }
                        }
                     ]
                  }
               },
               {
                  id: "FORM1",
                  name: "alfresco/forms/Form",
                  config: {
                     scopeFormControls: false,
                     okButtonLabel: "Save",
                     okButtonPublishTopic: "FORM1_POST",
                     okButtonPublishGlobal: true,
                     showCancelButton: false,
                     widgets: [
                        {
                           id: "ROOT_DROPPED_ITEMS1",
                           name: "alfresco/forms/controls/DragAndDropTargetControl",
                           config: {
                              label: "Data",
                              name: "data",
                              value: value,
                              acceptTypes: ["widget", "something_else"],
                              useModellingService: true,
                              clearTopic: "BRUTAL_CLEAR",
                              clearDroppedItemsTopic: "NICE_CLEAR"
                           }
                        }
                     ]
                  }
               },
               {
                  id: "DRAG_PALETTE2",
                  name: "alfresco/dnd/DragAndDropItems",
                  config: {
                     useItemsOnce: true,
                     items: [
                        {
                           type: [ "not_a_widget" ],
                           label: "Item 2",
                           value: {
                              name: "ted"
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         id: "BRUTAL_CLEAR_BUTTON",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Brute Force Clear",
            publishTopic: "BRUTAL_CLEAR"
         }
      },
      {
         id: "NICE_CLEAR_BUTTON",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Clear With Return",
            publishTopic: "NICE_CLEAR"
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};