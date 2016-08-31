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
                  id: "VALID_DATES_FORM",
                  name: "alfresco/forms/Form",
                  config: {
                     pubSubScope: "FORM1_",
                     okButtonPublishTopic: "VALID_DATES_FORM_SUBMIT",
                     widgets: [
                        {
                           id: "VALID_DATE_VALUE_1",
                           name: "alfresco/forms/controls/DateTextBox",
                           config: {
                              fieldId: "VALID1",
                              name: "validDate1",
                              value: "2012-12-25",
                              label: "Valid date",
                              description: "Preset with the value \"2012-12-25\""
                           }
                        },
                        {
                           id: "VALID_DATE_VALUE_2",
                           name: "alfresco/forms/controls/DateTextBox",
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
                           id: "TODAYS_DATE",
                           name: "alfresco/forms/controls/DateTextBox",
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
                  id: "OTHER_DATES_FORM",
                  name: "alfresco/forms/Form",
                  config: {
                     okButtonPublishTopic: "OTHER_DATES_FORM_SUBMIT",
                     widgets: [
                        {
                           id: "DATE_WITH_PLACEHOLDER",
                           name: "alfresco/forms/controls/DateTextBox",
                           config: {
                              name: "dateWithPlaceholder",
                              label: "Date with placeholder",
                              description: "No preset value, but placeholder text",
                              placeHolder: "This is a placeholder"
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
               },
               {
                  id: "INVALID_DATES_FORM",
                  name: "alfresco/forms/Form",
                  config: {
                     okButtonPublishTopic: "INVALID_DATES_FORM_SUBMIT",
                     widgets: [
                        {
                           id: "LETTERS_DATE_VALUE",
                           name: "alfresco/forms/controls/DateTextBox",
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
                           id: "EMPTY_DATE_VALUE",
                           name: "alfresco/forms/controls/DateTextBox",
                           config: {
                              name: "emptyDate",
                              value: "",
                              label: "Empty date",
                              description: "Preset with the value \"\""
                           }
                        },
                        {
                           id: "NULL_DATE_VALUE",
                           name: "alfresco/forms/controls/DateTextBox",
                           config: {
                              name: "nullDate",
                              value: null,
                              label: "Null date",
                              description: "Preset with the value null"
                           }
                        },
                        {
                           id: "UNDEFINED_DATE_VALUE",
                           name: "alfresco/forms/controls/DateTextBox",
                           config: {
                              name: "undefinedDate",
                              value: undefined,
                              label: "Undefined date",
                              description: "Preset with the value undefined"
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