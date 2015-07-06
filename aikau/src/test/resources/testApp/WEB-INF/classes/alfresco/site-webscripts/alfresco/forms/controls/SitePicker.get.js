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
      "alfresco/services/DialogService",
      "aikauTesting/mockservices/DocumentPickerTestService"
   ],
   widgets:[
      {
         "name": "alfresco/layout/HorizontalWidgets",
         "config": {
            "widgetMarginLeft": 10,
            "widgetMarginRight": 10,
            "widgets": [
               {
                  name: "alfresco/forms/Form",
                  id: "SITE_PICKER_FORM",
                  config: {
                     okButtonPublishTopic: "SITE_PICKED",
                     okButtonLabel: "OK",
                     widgets: [
                        {
                           name: "alfresco/forms/controls/SitePicker",
                           config: {
                              id: "SITE_PICKER",
                              name: "site",
                              description: "Pick a site, any site",
                              label: "Site",
                              multiSite: false
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/forms/Form",
                  id: "SITES_PICKER_FORM",
                  config: {
                     okButtonPublishTopic: "SITES_PICKED",
                     okButtonLabel: "OK",
                     widgets: [
                        {
                           name: "alfresco/forms/controls/SitePicker",
                           config: {
                              id: "SITES_PICKER",
                              name: "sites",
                              description: "Pick some sites, any sites",
                              label: "Sites",
                              multiSite: true
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