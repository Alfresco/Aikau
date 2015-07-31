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
         name: "alfresco/buttons/AlfButton",
         id: "RESET_VALUES",
         config: {
            label: "Reset control values",
            publishTopic: "FORM_VALUE_TOPIC",
            publishGlobal: true,
            publishPayload: {
               one: "",
               two: 5,
               three: 0,
               four: 1,
               five: 3,
               six: 1001,
               seven: "",
               eight: 5.5
            }
         }
      },
      {
         name: "alfresco/html/Spacer",
         config: {
            height: "20px"
         }
      },
      {
         name: "alfresco/forms/Form",
         config: {
            setValueTopic: "FORM_VALUE_TOPIC",
            okButtonPublishTopic: "FORM_POST",
            widgets: [
               {
                  name: "alfresco/forms/ControlRow",
                  config: {
                     widgets: [
                        {
                           id: "NS1",
                           name: "alfresco/forms/controls/NumberSpinner", 
                           config: {
                              fieldId: "NS1",
                              name: "one",
                              label: "Minimum config",
                              description: "This is a number spinner with the absolute minimum configuration."
                           }
                        },
                        {
                           id: "NS2",
                           name: "alfresco/forms/controls/NumberSpinner", 
                           config: {
                              fieldId: "NS2",
                              name: "two",
                              label: "Min and max",
                              description: "This is a number spinner with min and max thresholds set",
                              value: 3,
                              min: 5,
                              max: 10
                           }
                        },
                        {
                           id: "NS3",
                           name: "alfresco/forms/controls/NumberSpinner", 
                           config: {
                              fieldId: "NS2",
                              name: "three",
                              label: "Required",
                              value: 0,
                              description: "This is a number spinner that is a required field",
                              requirementConfig: {
                                 initialValue: true
                              }
                           }
                        },
                        {
                           id: "NS4",
                           name: "alfresco/forms/controls/NumberSpinner", 
                           config: {
                              fieldId: "NS4",
                              name: "four",
                              label: "Just min",
                              description: "This is a number spinner with just a min threshold",
                              min: 1
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/forms/ControlRow",
                  config: {
                     widgets: [
                        {
                           id: "NS5",
                           name: "alfresco/forms/controls/NumberSpinner", 
                           config: {
                              fieldId: "NS5",
                              name: "five",
                              label: "Just max",
                              description: "This is a number spinner with just a max threshold",
                              value: 3,
                              max: 5
                           }
                        },
                        {
                           id: "NS6",
                           name: "alfresco/forms/controls/NumberSpinner", 
                           config: {
                              fieldId: "NS6",
                              name: "six",
                              label: "Handle commas",
                              description: "This is a number spinner initialised to a value over a 1000",
                              value: 1001
                           }
                        },
                        {
                           id: "NS7",
                           name: "alfresco/forms/controls/NumberSpinner", 
                           config: {
                              fieldId: "NS7",
                              name: "seven",
                              label: "Empty value",
                              description: "This is a number spinner initialised to an empty string",
                              value: "",
                              permitEmpty: true
                           }
                        },
                        {
                           id: "NS8",
                           name: "alfresco/forms/controls/NumberSpinner", 
                           config: {
                              fieldId: "NS8",
                              name: "eight",
                              label: "Decimal points",
                              description: "This number spinner permits numbers to one decimal place",
                              value: "5.5",
                              permittedDecimalPlaces: 1
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