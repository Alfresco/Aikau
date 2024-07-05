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
         id: "FILTERS",
         name: "alfresco/documentlibrary/AlfDocumentFilters",
         config: {
            label: "first.dodgy.label",
            additionalCssClasses: "no-borders",
            widgets: [
               {
                  name: "alfresco/documentlibrary/AlfDocumentFilter",
                  config: {
                     label: "first.dodgy.label",
                     filter: "all",
                     description: "first.dodgy.label"
                  }
               }
            ]
         }
      },
      {
         id: "FILTER_DESCRIPTION",
         name: "alfresco/html/Label",
         config: {
            additionalCssClasses: "large",
            subscriptionTopic: "ALF_DOCLIST_FILTER_SELECTION",
            subscriptionPayloadProperty: "description",
            label: "second.dodgy.label"
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};