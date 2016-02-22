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
      }
   ],
   widgets: [
      {
         id: "STANDARD_FORM",
         name: "alfresco/forms/Form",
         config: {
            okButtonPublishTopic: "PUBLISH_FORM_DATA",
            cancelButtonPublishTopic: "CANCEL_FORM_DATA",
            widgets: [
               {
                  name: "alfresco/forms/ControlRow",
                  config: {
                     widgets: [
                        {
                           id: "FILE_SELECT",
                           name: "alfresco/forms/controls/FileSelect",
                           config: {
                              label: "File(s) selector",
                              name: "files_field",
                              value: "",
                              requirementConfig: {
                                 initialValue: true
                              }
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