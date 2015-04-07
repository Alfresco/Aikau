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
                  id: "DRAG_PALETTE1",
                  name: "alfresco/dnd/DragAndDropItems",
                  config: {
                     items: [
                        {
                           type: [ "widget" ],
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
                              value: null,
                              acceptTypes: ["widget"]
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
                           type: [ "widget" ],
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
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};