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
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  id: "DRAG_PALETTE",
                  name: "alfresco/dnd/DragAndDropItems",
                  config: {
                     items: [
                        {
                           type: [ "widget" ],
                           label: "Nestable",
                           value: {
                              name: "Nestable Widget",
                              label: "Moo"
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
                              value: null,
                              acceptTypes: ["widget"],
                              widgetsForWrappingDroppedItems: [
                                 {
                                    name: "alfresco/dnd/DroppedNestingItemWrapper",
                                    config: {
                                       label: "{label}",
                                       value: "{value}",
                                       widgets: "{widgets}"
                                    }
                                 }
                              ],
                              widgetsForDroppedItems: [
                                 {
                                    name: "alfresco/dnd/DragAndDropTarget",
                                    config: {
                                       label: "Widgets 1",
                                       targetProperty: "widgets1"
                                    }
                                 },
                                 {
                                    name: "alfresco/dnd/DragAndDropTarget",
                                    config: {
                                       label: "Widgets 2",
                                       targetProperty: "widgets2"
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
      }
   ]
};