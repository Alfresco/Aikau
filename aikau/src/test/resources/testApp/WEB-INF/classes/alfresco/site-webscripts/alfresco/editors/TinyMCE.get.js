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
                        toolbar: "visualchars",
                        browser_spellcheck: true,
                        additionalPlugins: [
                           "visualchars"
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
               },
               {
                  // Pre-populated editor used to verify that existing content (e.g. an existing
                  // comment on a node) is loaded correctly for editing and can be edited/saved.
                  // The value contains multiple formatting styles so that the "formatting is
                  // maintained" scenario can also be asserted on the round-tripped content.
                  id: "TINY_MCE_3",
                  name: "alfresco/forms/controls/TinyMCE",
                  config: {
                     label: "Existing Comment",
                     name: "RichText3",
                     value: "<p><strong>Bold</strong> <em>italic</em> <u>underline</u></p><ul><li>one</li><li>two</li></ul>"
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