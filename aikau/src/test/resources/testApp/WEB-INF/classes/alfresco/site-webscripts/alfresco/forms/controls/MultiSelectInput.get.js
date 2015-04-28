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
                           },
                           searchStartsWith: false
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
         id: "FORM1",
         name: "alfresco/forms/Form",
         config: {
            okButtonPublishTopic: "FORM_POST",
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
         name: "aikauTesting/mockservices/MultiSelectInputMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};