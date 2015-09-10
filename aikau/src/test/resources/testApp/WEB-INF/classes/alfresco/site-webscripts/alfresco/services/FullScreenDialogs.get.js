/*jshint maxlen:500*/
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
      "alfresco/services/DialogService",
      "aikauTesting/mockservices/FormDialogMockService"
   ],
   widgets: [
      {
         id: "LAYOUT",
         name: "alfresco/layout/FixedHeaderFooter",
         config: {
            autoHeightPaddingAllowance: 10,
            widgets: [
               {
                  id: "FULL_SCREEN_DIALOG",
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: "Create Full Screen Dialog",
                     publishTopic: "ALF_CREATE_DIALOG_REQUEST",
                     publishPayload: {
                        dialogId: "FSD1",
                        dialogTitle: "Full Screen Dialog",
                        fullScreenMode: true,
                        fullScreenPadding: 20,
                        textContent: "Hello World",
                        publishOnShow: [
                           {
                              publishTopic: "DISPLAYED_FD1",
                              publishPayload: {}
                           }
                        ],
                        widgetsButtons: [
                           {
                              id: "FULL_SCREEN_DIALOG_CLOSE",
                              name: "alfresco/buttons/AlfButton",
                              config: {
                                 label: "OK",
                                 additionalCssClasses: "cancellationButton",
                                 publishTopic: "ALF_ITEMS_SELECTED"
                              }
                           }
                        ]
                     }
                  }
               },
               {
                  id: "FULL_SCREEN_FORM_DIALOG",
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: "Create Form Dialog (with custom scoping)",
                     publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
                     publishPayload: {
                        dialogId: "FSD2",
                        dialogTitle: "Full Screen Form Dialog",
                        fullScreenMode: true,
                        fullScreenPadding: 40,
                        formSubmissionTopic: "FULL_SCREEN_TOPIC",
                        formSubmissionGlobal: false,
                        formSubmissionScope: "FULL_SCREEN__SCOPE_",
                        widgets: [
                           {
                              id: "FS_FORM_TEXTBOX",
                              name: "alfresco/forms/controls/TextBox",
                              config: {
                                 name: "text",
                                 label: "Enter some text",
                                 value: "This is some sample text"
                              }
                           }
                        ]
                     }
                  }
               }
            ]
         }
      }
      
   ]
};