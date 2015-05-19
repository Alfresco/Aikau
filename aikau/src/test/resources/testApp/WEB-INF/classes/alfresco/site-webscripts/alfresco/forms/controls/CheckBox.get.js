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
      "alfresco/services/DialogService",
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "UNCHECK_CHECKBOX",
            label: "Uncheck checkbox",
            publishTopic: "SET_FORM_VALUE",
            publishPayload: {
               canbuild: false
            }
         }
      },
      // {
      //    id: "CHECK_CHECKBOX",
      //    name: "alfresco/buttons/AlfButton",
      //    config: {
      //       label: "Check checkbox",
      //       publishTopic: "SET_FORM_VALUE",
      //       publishPayload: {
      //          canbuild: true
      //       }
      //    }
      // },
      {
         name: "alfresco/html/Spacer",
         config: {
            height: "30px"
         }
      },
      {
         name: "alfresco/forms/Form",
         config: {
            id: "CHECKBOX_FORM",
            okButtonPublishTopic: "POST_FORM",
            setValueTopic: "SET_FORM_VALUE",
            scopeFormControls: false,
            value: {
               canbuild: true
            },
            widgets: [
               {
                  name: "alfresco/forms/controls/CheckBox",
                  config: {
                     name: "canbuild",
                     id: "CAN_BUILD",
                     label: "Yes we can",
                     description: "Can we build it?"
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/html/Spacer",
         config: {
            height: "30px"
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
   // simple stuff, setting checkbox via publication, making sure it can be toggled on/off with mouse and keyboard
};