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
                  name: "alfresco/lists/AlfList",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/dnd/DragAndDropItemsListView"
                        }
                     ],
                     currentData: {
                        items: [
                           {
                              type: [ "widget" ],
                              label: "dnd.item.label",
                              value: {
                                 name: "bob",
                                 ted: "geoff"
                              }
                           },
                           {
                              type: [ "widget" ],
                              label: "dnd.item.xss",
                              value: {
                                 name: "1",
                                 b: "2"
                              }
                           },
                           {
                              type: [ "widget" ],
                              label: "TextBox",
                              value: {
                                 name: "alfresco/forms/controls/TextBox",
                                 config: {
                                    name: "blah",
                                    label: "Moo"
                                 }
                              }
                           }
                        ]
                     }
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
               }
            ]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};