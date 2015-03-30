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
      }
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
                  id: "CODE_MIRROR_1",
                  name: "alfresco/forms/controls/CodeMirrorEditor"
               }
            ]
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "DIALOG_BUTTON",
         config: {
            label: "Display editor in dialog",
            publishTopic: "ALF_CREATE_DIALOG_REQUEST",
            publishPayload: {
               dialogTitle: "CodeMirror Editor Dialog",
               widgetsContent: [
                  {
                     id: "CODE_MIRROR_2",
                     name: "alfresco/forms/controls/CodeMirrorEditor"
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};