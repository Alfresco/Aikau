model.jsonModel = {
   services: [
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/menus/AlfMenuBar",
         config: {
            widgets: [
               {
                  name: "alfresco/menus/AlfMenuBarPopup",
                  config: {
                     id: "DROP_DOWN",
                     label: "Menu Item Wrappers",
                     widgets: [
                        {
                           name: "alfresco/menus/AlfMenuGroup",
                           config: {
                              id: "GROUP",
                              widgets: [
                                 {
                                    name: "alfresco/menus/AlfCascadingMenu",
                                    config: {
                                       id: "CASCADE1",
                                       label: "Get text (no label, no value)...",
                                       widgets: [
                                          {
                                             name: "alfresco/menus/AlfMenuTextForClipboard",
                                             config: {
                                                id: "TEXT1"
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    name: "alfresco/menus/AlfCascadingMenu",
                                    config: {
                                       id: "CASCADE2",
                                       label: "Get text (with value)...",
                                       widgets: [
                                          {
                                             name: "alfresco/menus/AlfMenuTextForClipboard",
                                             config: {
                                                id: "TEXT2",
                                                textForClipboard: "Some sample text"
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    name: "alfresco/menus/AlfCascadingMenu",
                                    config: {
                                       id: "CASCADE3",
                                       label: "Get text...",
                                       widgets: [
                                          {
                                             name: "alfresco/menus/AlfMenuTextForClipboard",
                                             config: {
                                                id: "TEXT3",
                                                label: "Copy me!",
                                                textForClipboard: "Some sample text"
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
         name: "alfresco/forms/controls/TextArea",
         config: {
            id: "TEXTAREA"
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
}
;