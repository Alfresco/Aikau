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
         id: "FORM1",
         name: "alfresco/forms/Form",
         config: {
            okButtonPublishTopic: "FORM_POST",
            scopeFormControls: false,
            widgets: [
               {
                  id: "TINY_MCE_1",
                  name: "alfresco/forms/controls/TinyMCE",
                  config: {
                     label: "Content",
                     name: "RichText"
                  }
               },
               {
                  id: "TINY_MCE_2",
                  name: "alfresco/forms/controls/TinyMCE",
                  config: {
                     label: "Custom Editor",
                     name: "RichText2",
                     editorConfig: {
                        toolbar: "spellchecker",
                        browser_spellcheck: true,
                        additionalPlugins: [
                           "spellchecker"
                        ]
                     },
                     widgetsForEditor: [
                        {
                           name: "aikauTesting/widgets/CustomTinyMceEditor",
                           config: {
                              additionalCssClasses: "custom-tiny-mce-editor"
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         id: "CREATE_FORM_DIALOG",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Create Form Dialog",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "FORM",
               dialogTitle: "Scoped Form Dialog",
               formSubmissionTopic: "DIALOG_FORM",
               widgets: [
                  {
                     id: "TINY_MCE_2",
                     name: "alfresco/forms/controls/TinyMCE",
                     config: {
                        name: "text",
                        label: "Enter some text"
                     }
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};