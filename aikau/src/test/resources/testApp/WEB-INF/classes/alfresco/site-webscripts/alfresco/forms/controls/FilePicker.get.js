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
      "alfresco/services/DocumentService",
      "alfresco/services/SiteService",
      "alfresco/services/SearchService"
   ],
   widgets:[
      {
         id: "FORM",
         name: "alfresco/forms/Form",
         config: {
            pubSubScope: "FORM_SCOPE_",
            okButtonPublishTopic: "SAVE",
            widgets: [
               {
                  id: "SINGLE_ITEM_FILE_PICKER",
                  name: "alfresco/forms/controls/FilePicker",
                  config: {
                     fieldId: "SINGLE_FILE",
                     name: "singleFile",
                     label: "Pick a file, any file",
                     description: "This is an exmample file picker"
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/FilePickerMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};