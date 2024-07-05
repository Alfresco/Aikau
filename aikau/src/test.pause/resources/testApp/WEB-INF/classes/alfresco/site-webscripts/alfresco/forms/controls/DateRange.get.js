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
      }
   ],
   widgets: [
      {
         id: "DATE_RANGE_FORM",
         name: "alfresco/forms/Form",
         config: {
            pubSubScope: "FORM_",
            okButtonPublishTopic: "DATES",
            widgets: [
               {
                  id: "DATE_RANGE_1",
                  name: "alfresco/forms/controls/DateRange",
                  config: {
                     fieldId: "DATE_RANGE_1",
                     name: "dr1",
                     value: "2016-10-11|2016-10-22",
                     label: "Date Range 1",
                     description: "Select a date range (initial value provided)"
                  }
               },
               {
                  id: "DATE_RANGE_2",
                  name: "alfresco/forms/controls/DateRange",
                  config: {
                     fieldId: "DATE_RANGE_2",
                     name: "dr2",
                     label: "Date Range 2",
                     description: "Select a date range (no initial value)"
                  }
               },
               {
                  id: "DATE_RANGE_3",
                  name: "alfresco/forms/controls/DateRange",
                  config: {
                     fieldId: "DATE_RANGE_2",
                     name: "dr3",
                     value: "2016-10-11|null",
                     label: "Date Range 2",
                     description: "Select a date range (only one initial value)"
                  }
               },
               {
                  id: "DATE_RANGE_4",
                  name: "alfresco/forms/controls/DateRange",
                  config: {
                     fieldId: "DATE_RANGE_4",
                     name: "dr4",
                     value: "2016-10-22|2016-10-11",
                     label: "Date Range 2",
                     description: "Select a date range (from date after to date)"
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