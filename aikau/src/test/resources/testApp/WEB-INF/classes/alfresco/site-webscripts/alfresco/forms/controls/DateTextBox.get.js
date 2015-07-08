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
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/forms/Form",
                  id: "VALID_DATES_FORM",
                  config: {
                     okButtonPublishTopic: "VALID_DATES_FORM_SUBMIT",
                     widgets: [
                        {
                           name: "alfresco/forms/controls/DateTextBox",
                           id: "VALID_DATE_VALUE_1",
                           config: {
                              name: "validDate1",
                              value: "2012-12-12",
                              label: "Valid date #1"
                           }
                        },
                        {
                           name: "alfresco/forms/controls/DateTextBox",
                           id: "VALID_DATE_VALUE_2",
                           config: {
                              name: "validDate2",
                              value: "2015-07-07",
                              label: "Valid date #2"
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/forms/Form",
                  id: "INVALID_DATES_FORM",
                  config: {
                     okButtonPublishTopic: "INVALID_DATES_FORM_SUBMIT",
                     widgets: [
                        {
                           name: "alfresco/forms/controls/DateTextBox",
                           id: "LETTERS_DATE_VALUE",
                           config: {
                              name: "lettersDate",
                              value: "letters",
                              label: "Letters date"
                           }
                        },
                        {
                           name: "alfresco/forms/controls/DateTextBox",
                           id: "NULL_DATE_VALUE",
                           config: {
                              name: "nullDate",
                              value: null,
                              label: "Null date"
                           }
                        },
                        {
                           name: "alfresco/forms/controls/DateTextBox",
                           id: "UNDEFINED_DATE_VALUE",
                           config: {
                              name: "undefinedDate",
                              value: undefined,
                              label: "Undefined date"
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