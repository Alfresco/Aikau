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
      "alfresco/services/SiteService"
   ],
   widgets:[
      {
         name: "alfresco/forms/controls/ContainerPicker",
         config: {
            id: "FOLDER_PICKER",
            label: "Folders"
         }
      },
      {
         name: "aikauTesting/mockservices/ContainerListPickerMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};