model.jsonModel = {
   services: [
      "alfresco/services/DialogService",
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/menus/AlfMenuBar",
         align: "left",
         config: {
            id: "MENU_BAR",
            widgets: [
               {
                  name: "alfresco/menus/AlfMenuBarPopup",
                  config: {
                     id: "DROP_DOWN_MENU",
                     label: "Drop Down",
                     widgets: [
                        {
                           name: "alfresco/menus/AlfFormDialogMenuItem",
                           config: {
                              id: "FDM1",
                              label: "Create Dialog",
                              dialogTitle: "New Dialog",
                              dialogConfirmationButtonTitle: "Save",
                              dialogCancellationButtonTitle: "Close",
                              formSubmissionTopic: "FORM_SUBMIT",
                              widgets: [
                                 {
                                    name: "alfresco/forms/controls/DojoValidationTextBox",
                                    config: {
                                       name: "text",
                                       label: "Enter text",
                                       value: ""
                                    }
                                 }
                              ]
                           }
                        }
                     ]
                  }
               }
            ]
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