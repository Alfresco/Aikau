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
                     label: "Pick a file, any file...",
                     description: "This is an example file picker (single item mode, no initial value, repository tab hidden)",
                     showRepository: false
                  }
               },
               {
                  id: "MULTI_ITEM_FILE_PICKER_PRE_SELECTED",
                  name: "alfresco/forms/controls/FilePicker",
                  config: {
                     fieldId: "MULTI_FILE",
                     name: "multiFile",
                     label: "Pick more than one file...",
                     description: "This is a multi-item file picker that is preset with a value (favourite sites hidden)",
                     value: [
                        { nodeRef:"workspace://SpacesStore/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4"}, 
                        { nodeRef: "workspace://SpacesStore/a4fc4392-27f6-49fd-8b6e-20b953c59ff5"}],
                     multipleItemSelection: true,
                     showFavouriteSites: false
                  }
               },
               {
                  id: "MULTI_ITEM_DELIMITED_VALUE",
                  name: "alfresco/forms/controls/FilePicker",
                  config: {
                     fieldId: "DELIMITED_VALUE",
                     name: "delimitedValue",
                     label: "Pick more than one file...",
                     description: "This is a multi-item file picker that is preset with a delimited value (search hidden)",
                     value: "workspace://SpacesStore/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4,workspace://SpacesStore/a4fc4392-27f6-49fd-8b6e-20b953c59ff5",
                     multipleItemSelection: true,
                     valueDelimiter: ",",
                     showSearch: false
                  }
               },
               {
                  id: "DELIMITED_ADDED_REMOVED_VALUES",
                  name: "alfresco/forms/controls/FilePicker",
                  config: {
                     fieldId: "DELIMITED_ADDED_REMOVED_VALUES",
                     name: "delimited",
                     label: "Pick more than one file...",
                     description: "This is a mult-item picker that returns values for both added and removed items",
                     value: "workspace://SpacesStore/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4,workspace://SpacesStore/a4fc4392-27f6-49fd-8b6e-20b953c59ff5",
                     multipleItemSelection: true,
                     valueDelimiter: ",",
                     showSearch: false,
                     addedAndRemovedValues: true
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