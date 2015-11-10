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
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "SET_FORM_VALUE_1",
            label: "Publish update without payload",
            publishTopic: "SET_FORM_CONTROL_VALUE",
            pubSubScope: "TEST_SCOPE_"
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "SET_FORM_VALUE_2",
            label: "Incorrect fieldname in update payload",
            publishTopic: "SET_FORM_CONTROL_VALUE",
            pubSubScope: "TEST_SCOPE_",
            publishPayload: {
               notValue: "this is the new value"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "SET_FORM_VALUE_3",
            label: "Update and set string value",
            publishTopic: "SET_FORM_CONTROL_VALUE",
            pubSubScope: "TEST_SCOPE_",
            publishPayload: {
               value: "this is the new value"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "SET_FORM_VALUE_4",
            label: "Update and set number value",
            publishTopic: "SET_FORM_CONTROL_VALUE",
            pubSubScope: "TEST_SCOPE_",
            publishPayload: {
               value: 3.14159265
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "SET_FORM_VALUE_5",
            label: "Update and set boolean value",
            publishTopic: "SET_FORM_CONTROL_VALUE",
            pubSubScope: "TEST_SCOPE_",
            publishPayload: {
               value: true
            }
         }
      },
      {
         name: "alfresco/html/HR"
      },
      {
         "name": "alfresco/layout/HorizontalWidgets",
         "config": {
            "widgets": [
               {
                  name: "alfresco/forms/Form",
                  id: "BASIC_FORM",
                  config: {
                     okButtonPublishTopic: "OK",
                     cancelButtonPublishTopic: "CANCEL",
                     widgets: [
                        {
                           id: "FORM_FIELD",
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              pubSubScope: "TEST_SCOPE_",
                              valueSubscriptionTopic: "SET_FORM_CONTROL_VALUE",
                              name: "control",
                              label: "Basic form control"
                           }
                        }
                     ]
                  }
               },
               {
                  "name": "alfresco/layout/VerticalWidgets",
                  "config": {
                     "widgets": [
                        {
                           name: "alfresco/forms/Form",
                           id: "AUTOSAVE_FORM",
                           config: {
                              autoSavePublishTopic: "AUTOSAVE_FORM_1",
                              autoSavePublishGlobal: true,
                              pubSubScope: "AUTOSAVE1_",
                              widgets: [
                                 {
                                    id: "AUTOSAVE_FORM_FIELD",
                                    name: "alfresco/forms/controls/TextBox",
                                    config: {
                                       name: "control",
                                       label: "Autosave form control",
                                       value: "Foo",
                                       valueSubscriptionTopic: "SET_FORM_CONTROL_VALUE",
                                       requirementConfig: {
                                          initialValue: true
                                       }
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           name: "alfresco/html/Spacer",
                           config: {
                              height: "10px"
                           }
                        },
                        {
                           name: "alfresco/buttons/AlfButton",
                           id: "CLEAR_AUTOSAVE_1",
                           config: {
                              label: "Clear autosave text box",
                              publishTopic: "SET_FORM_CONTROL_VALUE",
                              pubSubScope: "AUTOSAVE1_",
                              publishPayload: {
                                 value: ""
                              }
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/forms/Form",
                  id: "AUTOSAVE_FORM_INVALID",
                  config: {
                     autoSavePublishTopic: "AUTOSAVE_FORM_2",
                     autoSavePublishGlobal: true,
                     autoSavePublishPayload: {
                        customProperty: "awooga"
                     },
                     autoSaveOnInvalid: true,
                     pubSubScope: "AUTOSAVE2_",
                     widgets: [
                        {
                           id: "AUTOSAVE_INVALID_FORM_FIELD",
                           name: "alfresco/forms/controls/TextBox",
                           config: {
                              name: "control",
                              label: "Autosave form control (even invalid)",
                              value: "Bar",
                              valueSubscriptionTopic: "SET_FORM_CONTROL_VALUE",
                              requirementConfig: {
                                 initialValue: true
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
         name: "alfresco/html/Spacer",
         config: {
            height: "20px"
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};