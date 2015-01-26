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
         id: "WARNINGS1",
         name: "alfresco/header/Warning",
         config: {
            warnings: [
               {
                  message: "WARNING",
                  level: 1
               }
            ]
         }
      },
      {
         id: "WARNINGS2",
         name: "alfresco/header/Warning",
         config: {
            warnings: [
               {
                  message: "ERROR",
                  level: 3
               }
            ]
         }
      },
      {
         id: "LICENSEWARNING_READONLY",
         name: "alfresco/header/LicenseWarning",
         config: {
            usage: {
               readOnly: true
            }
         }
      },
      {
         id: "LICENSEWARNING_DISPLAY_TO_ADMIN",
         name: "alfresco/header/LicenseWarning",
         config: {
            userIsAdmin: true, 
            usage: {
               readOnly: false,
               level: 1,
               warnings: ["WARN1","WARN2"],
               errors: ["ERROR1"]
            }
         }
      },
      {
         id: "LICENSEWARNING_HIDE_FROM_USER",
         name: "alfresco/header/LicenseWarning",
         config: {
            userIsAdmin: false, 
            usage: {
               readOnly: false,
               level: 1,
               warnings: ["WARN3","WARN4"],
               errors: ["ERROR2"]
            }
         }
      },
      {
         id: "LICENSEWARNING_DISPLAY_TO_USER",
         name: "alfresco/header/LicenseWarning",
         config: {
            userIsAdmin: false, 
            usage: {
               readOnly: false,
               level: 2,
               warnings: ["WARN5","WARN6"],
               errors: ["ERROR3"]
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