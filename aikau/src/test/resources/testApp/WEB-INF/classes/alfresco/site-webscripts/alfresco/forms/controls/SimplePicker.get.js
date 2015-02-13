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
   widgets: [
      {
         name: "alfresco/forms/controls/SimplePicker",
         config: {
            label: "Pick Some items",
            description: "This is a simple picker with some hard-coded data",
            name: "hardcoded",
            reorderable: true,
            currentData: {
               items: [
                  {
                     name: "One"
                  },
                  {
                     name: "Two"
                  },
                  {
                     name: "Three"
                  }
               ]
            }
        }
      },
      {
         name: "alfresco/forms/controls/SimplePicker",
         config: {
            label: "Pick Some items",
            description: "This is a simple picker with some hard-coded data",
            name: "hardcoded",
            reorderable: true,
            value: [
               {
                  name: "One"
               }
            ],
            currentData: {
               items: [
                  {
                     name: "One"
                  },
                  {
                     name: "Two"
                  },
                  {
                     name: "Three"
                  }
               ]
            }
        }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};