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
                              value: "2012-12-25",
                              label: "Valid date",
                              description: "Preset with the value \"2012-12-25\""
                           }
                        },
                        {
                           name: "alfresco/forms/controls/DateTextBox",
                           id: "VALID_DATE_VALUE_2",
                           config: {
                              name: "validDate2",
                              value: "2015-10-31",
                              label: "Valid date (mandatory)",
                              description: "Preset with the value \"2015-10-31\"",
                              requirementConfig: {
                                 initialValue: true
                              }
                           }
                        },
                        {
                           name: "alfresco/forms/controls/DateTextBox",
                           id: "TODAYS_DATE",
                           config: {
                              name: "todaysDate",
                              value: "TODAY",
                              label: "Today's date",
                              description: "Preset with today's date"
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
                              label: "Letters date (mandatory)",
                              description: "Preset with the value \"letters\"",
                              requirementConfig: {
                                 initialValue: true
                              }
                           }
                        },
                        {
                           name: "alfresco/forms/controls/DateTextBox",
                           id: "EMPTY_DATE_VALUE",
                           config: {
                              name: "emptyDate",
                              value: "",
                              label: "Empty date",
                              description: "Preset with the value \"\""
                           }
                        },
                        {
                           name: "alfresco/forms/controls/DateTextBox",
                           id: "NULL_DATE_VALUE",
                           config: {
                              name: "nullDate",
                              value: null,
                              label: "Null date",
                              description: "Preset with the value null"
                           }
                        },
                        {
                           name: "alfresco/forms/controls/DateTextBox",
                           id: "UNDEFINED_DATE_VALUE",
                           config: {
                              name: "undefinedDate",
                              value: undefined,
                              label: "Undefined date",
                              description: "Preset with the value undefined"
                           }
                        },
                        {
                           id: "RULES_CHECKER",
                           name: "alfresco/forms/controls/DateTextBox",
                           config: {
                              fieldId: "RULES_CHECKER",
                              name: "date3",
                              value: null,
                              label: "Any Date",
                              description: "Enter a data via the keyboard to ensure that the TextBox below becomes required."
                           }
                        },
                        {
                           id: "RULES_SUBSCRIBER",
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              fieldId: "RULES_SUBSCRIBER",
                              label: "Test",
                              name: "test",
                              description: "This should become required when a date is entered into the previous DataTextBox",
                              value: "",
                              requirementConfig: {
                                 initialValue: false,
                                 rules: [
                                    {
                                       targetId: "RULES_CHECKER",
                                       isNot: ["",null]
                                    }
                                 ]
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