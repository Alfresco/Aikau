model.jsonModel = {
   services: [
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/menus/AlfVerticalMenuBar",
         config: {
            widgets: [
               {
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     id: "ITEM1",
                     label: "Item 1"
                  }
               },
               {
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     id: "ITEM1",
                     label: "Item 2"
                  }
               },
               {
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     id: "ITEM1",
                     label: "Item 3"
                  }
               },
               {
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     id: "ITEM1",
                     label: "Item 4"
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
}
;