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
      },
      "alfresco/services/DialogService"
   ],
   widgets: [
      {
         id: "LAUNCH_FORM_DIALOG",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Autosave Form in Dialog",
            publishTopic: "ALF_CREATE_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "DIALOG1",
               dialogTitle: "AutoSave Form",
               widgetsContent: [
                  {
                     name: "alfresco/forms/Form",
                     id: "AUTOSAVE_FORM2",
                     config: {
                        waitForPageWidgets: false,
                        autoSavePublishTopic: "AUTOSAVE_FORM2",
                        autoSavePublishGlobal: true,
                        autoSavePublishPayload: {
                           customProperty: "additional"
                        },
                        autoSaveOnInvalid: false,
                        pubSubScope: "FORM2_",
                        widgets: [
                           {
                              id: "FIELD2",
                              name: "alfresco/forms/controls/TextBox",
                              config: {
                                 fieldId: "FIELD2",
                                 name: "field2",
                                 label: "Two",
                                 value: "test",
                                 requirementConfig: {
                                    initialValue: true
                                 },
                                 validationConfig: [
                                    {
                                       validation: "minLength",
                                       length: 3,
                                       errorMessage: "Too short"
                                    }
                                 ]
                              }
                           }
                        ]
                     }
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/forms/Form",
         id: "AUTOSAVE_FORM",
         config: {
            autoSavePublishTopic: "AUTOSAVE_FORM",
            autoSavePublishGlobal: true,
            autoSavePublishPayload: {
               customProperty: "additional"
            },
            autoSaveOnInvalid: false,
            pubSubScope: "FORM1_",
            widgets: [
               {
                  id: "FIELD1",
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     fieldId: "FIELD1",
                     name: "field1",
                     label: "One",
                     value: "test",
                     requirementConfig: {
                        initialValue: true
                     },
                     validationConfig: [
                        {
                           validation: "minLength",
                           length: 3,
                           errorMessage: "Too short"
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/forms/ControlRow",
                  config: {
                     widgets: [
                        {
                           id: "FIELD3",
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              fieldId: "FIELD3",
                              name: "field3",
                              label: "Three",
                              value: "test"
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