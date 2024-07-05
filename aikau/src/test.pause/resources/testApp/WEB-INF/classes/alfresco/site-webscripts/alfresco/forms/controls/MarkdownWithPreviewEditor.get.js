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
                  id: "MDWPE1",
                  name: "alfresco/forms/controls/MarkdownWithPreviewEditor",
                  config: {
                     fieldId: "MDWPE1",
                     label: "Markdown with preview",
                     description: "This shows an editor configured for markdown format with an associated preview",
                     name: "markdown1",
                     value: "# Heading"
                  }
               }
            ]
         }
      },
      {
         id: "DIALOG_BUTTON",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Display editor in dialog",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogTitle: "Markdown with Preview Editor Dialog",
               formSubmissionTopic: "POST_FORM_DIALOG",
               contentWidth: "850px",
               widgets: [
                  {
                     id: "MDWPE2",
                     name: "alfresco/forms/controls/MarkdownWithPreviewEditor",
                     config: {
                        fieldId: "MDWPE2",
                        label: "Markdown with preview",
                        description: "This shows an editor configured for markdown format with an associated preview",
                        name: "markdown1",
                        width: 300
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