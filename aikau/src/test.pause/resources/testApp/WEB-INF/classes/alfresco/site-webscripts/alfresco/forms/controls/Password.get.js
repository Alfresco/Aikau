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
         name: "alfresco/forms/Form",
         config: {
            okButtonPublishTopic: "POST_FORM",
            scopeFormControls: false,
            widgets: [
               {
                  id: "PW1",
                  name: "alfresco/forms/controls/Password", 
                  config: {
                     fieldId: "PW1",
                     label: "Enter new password",
                     name: "pw1",
                     value: ""
                  }
               },
               {
                  id: "PW2",
                  name: "alfresco/forms/controls/Password", 
                  config: {
                     fieldId: "PW2",
                     label: "Confirm new password",
                     name: "pw2",
                     value: "",
                     confirmationTargetId: "PW1"
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