var hrStyle = "border: 1px solid #eee; width: 300px; margin: 25px 15px;";

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
      "alfresco/services/TagService",
      "aikauTesting/mockservices/MultiSelectMockService",
      "alfresco/services/DialogService"
   ],
   widgets: [
      {
         id: "CREATE_FORM_DIALOG",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Create dialog with MultiSelect",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "DIALOG_WITH_MULTISELECT",
               dialogTitle: "Dialog With MultiSelect",
               formSubmissionTopic: "DIALOG_POST",
               widgets: [
                  {
                     id: "MULTISELECT_IN_DIALOG",
                     name: "alfresco/forms/controls/MultiSelectInput",
                     config: {
                        label: "Tags",
                        name: "tags",
                        width: "400px",
                        optionsConfig: {
                           queryAttribute: "name",
                           valueAttribute: "nodeRef",
                           labelAttribute: "name",
                           pubSubScope: "DIALOG_",
                           publishTopic: "ALF_RETRIEVE_CURRENT_TAGS",
                           publishPayload: {
                              resultsProperty: "response.data.items"
                           }
                        }
                     }
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "FOCUS_HELPER_BUTTON",
         config: {
            label: "Focus helper"
         }
      },
      {
         name: "alfresco/html/HR",
         config: {
            style: hrStyle
         }
      },
      {
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  id: "FORM1",
                  name: "alfresco/forms/Form",
                  config: {
                     okButtonPublishTopic: "FORM_POST",
                     pubSubScope: "FORM1_",
                     scopeFormControls: false,
                     value: {
                        tags: ["workspace://SpacesStore/06bd4708-8998-47be-a4ea-0f418bc7bb38", "workspace://SpacesStore/d37d7dfa-8410-46be-af6a-5d5880ca478e"]
                     },
                     widgets: [
                        {
                           id: "MULTISELECT_1",
                           name: "alfresco/forms/controls/MultiSelectInput",
                           config: {
                              label: "Tags",
                              name: "tags",
                              width: "400px",
                              optionsConfig: {
                                 queryAttribute: "name",
                                 valueAttribute: "nodeRef",
                                 labelAttribute: "name",
                                 publishTopic: "ALF_RETRIEVE_CURRENT_TAGS",
                                 publishPayload: {
                                    resultsProperty: "response.data.items"
                                 },
                                 searchStartsWith: false
                              },
                              requirementConfig: {
                                 initialValue: true
                              }
                           }
                        }
                     ]
                  }
               },
               {
                  id: "FORM2",
                  name: "alfresco/forms/Form",
                  config: {
                     okButtonPublishTopic: "FORM2_POST",
                     pubSubScope: "FORM2_",
                     scopeFormControls: false,
                     value: {
                        categories: ["CAT_01", "CAT_10"]
                     },
                     widgets: [
                        {
                           id: "MULTISELECT_2",
                           name: "alfresco/forms/controls/MultiSelectInput",
                           config: {
                              label: "Celestial categories",
                              name: "categories",
                              width: "310px",
                              optionsConfig: {
                                 choiceCanWrap: true,
                                 choiceMaxWidth: "150px",
                                 publishTopic: "ALF_RETRIEVE_CELESTIAL_CATEGORIES",
                                 labelFormat: {
                                    choice: "{label}",
                                    result: "{value}: {label}",
                                    full: "ID={value}, Name={label}"
                                 },
                                 searchStartsWith: false
                              }
                           }
                        }
                     ]
                  }
               },
               {
                  id: "FORM3",
                  name: "alfresco/forms/Form",
                  config: {
                     okButtonPublishTopic: "FORM_POST",
                     pubSubScope: "FORM1_",
                     scopeFormControls: false,
                     value: {
                        tags: ["workspace://SpacesStore/06bd4708-8998-47be-a4ea-0f418bc7bb38", "workspace://SpacesStore/d37d7dfa-8410-46be-af6a-5d5880ca478e"]
                     },
                     widgets: [
                        {
                           id: "MULTISELECT_1",
                           name: "alfresco/forms/controls/MultiSelectInput",
                           config: {
                              label: "Tags (disabled)",
                              name: "tags",
                              width: "400px",
                              optionsConfig: {
                                 queryAttribute: "name",
                                 valueAttribute: "nodeRef",
                                 labelAttribute: "name",
                                 publishTopic: "ALF_RETRIEVE_CURRENT_TAGS",
                                 publishPayload: {
                                    resultsProperty: "response.data.items"
                                 },
                                 searchStartsWith: false
                              },
                              disablementConfig: {
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
         name: "alfresco/html/HR",
         config: {
            style: hrStyle
         }
      },
      {
         name: "aikauTesting/mockservices/MultiSelectInputMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};