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
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         id: "ITEM",
         name: "alfresco/renderers/Indicators",
         config: {
            currentItem: {
               node:{
                  nodeRef: "12345",
                  properties: {
                     name: "Fred"
                  }
               },
               indicators:[
                  {
                     id: "active-workflows-16.png",
                     label: "Active workflows label",
                     action: "Active workflows action",
                     icon: "active-workflows-16.png"
                  },
                  {
                     id: "cloud-indirect-sync-16.png",
                     label: "Cloud indirect sync label",
                     action: "Cloud indirect sync action",
                     icon: "cloud-indirect-sync-16.png"
                  },
                  {
                     id: "cloud-indirect-sync-failed-16.png",
                     label: "Cloud indirect sync failed label",
                     action: "Cloud indirect sync failed action",
                     icon: "cloud-indirect-sync-failed-16.png"
                  },
                  {
                     id: "cloud-sync-failed-16.png",
                     label: "Cloud sync failed label",
                     action: "Cloud sync failed action",
                     icon: "cloud-sync-failed-16.png"
                  },
                  {
                     id: "cloud-synced-16.png",
                     label: "Cloud sync label",
                     action: "Cloud sync action",
                     icon: "cloud-synced-16.png"
                  },
                  {
                     id: "editing-16.png",
                     label: "Editing label",
                     action: "Editing action",
                     icon: "editing-16.png"
                  },
                  {
                     id: "exif-16.png",
                     label: "Exif label",
                     action: "Exif action",
                     icon: "exif-16.png"
                  },
                  {
                     id: "geographic-16.png",
                     label: "Geographic label",
                     action: "Geographic action",
                     icon: "geographic-16.png"
                  },
                  {
                     id: "lock-owner-16.png",
                     label: "Lock owner label",
                     action: "Lock owner action",
                     icon: "lock-owner-16.png"
                  },
                  {
                     id: "locked-16.png",
                     label: "Locked label",
                     action: "Locked action",
                     icon: "locked-16.png"
                  },
                  {
                     id: "rules-16.png",
                     label: "Rules label",
                     action: "Rules action",
                     icon: "rules-16.png"
                  },
                  {
                     id: "simple-workflow-16.png",
                     label: "Simple workflow label",
                     action: "Simple workflow action",
                     icon: "simple-workflow-16.png"
                  },
                  {
                     id: "transferred-node-16.png",
                     label: "Transferred node label",
                     action: "Transferred node action",
                     icon: "transferred-node-16.png"
                  },
                  {
                     id: "indicatorWithNoAction",
                     label: "Indicator with no action",
                     icon: "transferred-node-16.png"
                  },
                  {
                     id: "indicatorWithMessageArgs",
                     label: "Indicator with message args {0}",
                     icon: "transferred-node-16.png",
                     action: "Transferred node action",
                     labelParams: [
                        "node.properties.name"
                     ]
                  }
               ]
            }
         }
      },
      {
         id: "ITEM2",
         name: "alfresco/renderers/Indicators",
         config: {
            currentItem: {
               node:{
                  nodeRef: "54321",
                  properties: {
                     name: "Wilma"
                  }
               }
            }
         }
      },
      {
         id: "ITEM3",
         name: "alfresco/renderers/Indicators",
         config: {}
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};