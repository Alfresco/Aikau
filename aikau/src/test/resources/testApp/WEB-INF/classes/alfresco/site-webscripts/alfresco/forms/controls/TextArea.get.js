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
            widgets: [
               {
                  name: "alfresco/forms/controls/TextArea",
                  id: "BASIC_TEXTAREA",
                  config: {
                     name: "basic_textarea",
                     label: "Basic textarea",
                     description: "This is a textarea with minimum configuration"
                  }
               },
               {
                  name: "alfresco/forms/controls/TextArea",
                  id: "SIZED_TEXTAREA",
                  config: {
                     name: "sized_textarea",
                     label: "Sized textarea",
                     rows: 3,
                     cols: 100,
                     description: "This is a textarea with the number of rows and columns specified"
                  }
               },
               {
                  name: "alfresco/forms/controls/TextArea",
                  id: "TEXTAREA_WITH_CONTENT",
                  config: {
                     name: "textarea_with_content",
                     label: "Textarea with content",
                     description: "This is a textarea with some default content provided",
                     value: "A some arguable jeepers cheerful pled impalpable yikes nosily however irresolute so tortoise amphibious."
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