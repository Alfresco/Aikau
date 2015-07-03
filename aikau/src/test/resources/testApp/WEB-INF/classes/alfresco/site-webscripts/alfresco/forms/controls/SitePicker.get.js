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
      "alfresco/services/DialogService",
      "aikauTesting/mockservices/DocumentPickerTestService"
   ],
   widgets:[
      {
         name: "alfresco/forms/Form",
         config: {
            okButtonPublishTopic: "SITES_PICKED",
            okButtonLabel: "OK",
            widgets: [
               {
                  name: "alfresco/forms/controls/SitePicker",
                  config: {
                     id: "SITE_PICKER",
                     name: "site",
                     description: "Pick a site, any site",
                     label: "Site"
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