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
      }
   ],
   widgets:[
      {
         id: "MENU_BAR",
         name: "alfresco/menus/AlfMenuBar",
         config: {
            widgets: [
               {
                  id: "SELECTED_ITEMS",
                  name: "alfresco/documentlibrary/AlfSelectedItemsMenuBarPopup",
                  config: {
                     debounceTime: 0, // Remove debounce time to aid testing
                     passive: false,
                     itemKeyProperty: "index",
                     label: "Selected items...",
                     widgets: [
                        {
                           name: "alfresco/menus/AlfMenuGroup",
                           config: {
                              widgets: [
                                 {
                                    id: "MENU_ITEM",
                                    name: "alfresco/menus/AlfSelectedItemsMenuItem",
                                    config: {
                                       label: "Test",
                                       clearSelectedItemsOnClick: true,
                                       publishTopic: "TEST_ITEMS"
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
         id: "LIST",
         name: "alfresco/lists/AlfList",
         config: {
            currentData: {
               items: [
                  {
                     name: "One"
                  },
                  {
                     name: "Two"
                  }
               ]
            },
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
                                    id: "CELL1",
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       width: "20px",
                                       widgets: [
                                          {
                                             id: "SELECTOR",
                                             name: "alfresco/renderers/Selector",
                                             config: {
                                                itemKey: "index"
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    id: "CELL2",
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
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