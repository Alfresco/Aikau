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
         id: "CRUD_FORM",
         name: "alfresco/forms/CrudForm",
         config: {
            defaultData: {
               prop1: "NewData"
            },
            createButtonLabel: "Create",
            createButtonPublishTopic: "CREATE_ITEM",
            createButtonPublishPayload: {

            },
            createButtonPublishGlobal: true,
            updateButtonLabel: "Update",
            updateButtonPublishTopic: "UPDATE_ITEM",
            updateButtonPublishPayload: {

            },
            updateButtonPublishGlobal: true,
            deleteButtonLabel: "Delete",
            deleteButtonPublishTopic: "DELETE_ITEM",
            deleteButtonPublishPayload: {

            },
            deleteButtonPublishGlobal: true,
            widgets: [
               {
                  id: "TEXT_FIELD",
                  name: "alfresco/forms/controls/DojoValidationTextBox",
                  config: {
                     label: "Test",
                     name: "prop1"
                  }
               }
            ],
            widgetsAdditionalButtons: [
               {
                  id: "ADDITIONAL_BUTTON",
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: "Additional Button",
                     publishTopic: "ADDITIONAL_BUTTON",
                     publishGlobal: true
                  }
               }
            ],
            showInfoTopics: ["DELETE_ITEM", "ADDITIONAL_BUTTON"],
            showFormTopics: ["SHOW_FORM"]
         }
      },
      {
         id: "SHOW_CREATE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show New",
            publishTopic: "ALF_CRUD_FORM_CREATE",
            publishPayload: {

            }
         }
      },
      {
         id: "SHOW_EXISTING_1",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show Existing 1",
            publishTopic: "ALF_CRUD_FORM_UPDATE",
            publishPayload: {
               prop1: "Existing 1"
            }
         }
      },
      {
         id: "SHOW_EXISTING_2",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show Existing 2",
            publishTopic: "ALF_CRUD_FORM_UPDATE",
            publishPayload: {
               prop1: "Existing 2"
            }
         }
      },
      {
         id: "SHOW_FORM",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show Form",
            publishTopic: "SHOW_FORM",
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
}
;