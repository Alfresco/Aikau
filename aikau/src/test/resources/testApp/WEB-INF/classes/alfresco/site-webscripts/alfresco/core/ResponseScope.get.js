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
         id: "B1",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Global with pubSubScope",
            pubSubScope: "",
            publishTopic: "B1",
            publishPayload: {
            }
         }
      },
      {
         id: "B2",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Scoped with pubSubScope",
            pubSubScope: "SCOPE_",
            publishTopic: "B2",
            publishPayload: {
            }
         }
      },
      {
         id: "B3",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Global with alfResponseScope",
            pubSubScope: "",
            publishTopic: "B3",
            publishPayload: {
               alfResponseScope: "OTHER_SCOPE_"
            }
         }
      },
      {
         id: "B4",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Scoped with alfResponseScope",
            pubSubScope: "SCOPE_",
            publishTopic: "B4",
            publishPayload: {
               alfResponseScope: "OTHER_SCOPE_"
            }
         }
      },
      {
         id: "B5",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Global with responseScope",
            pubSubScope: "",
            publishTopic: "B5",
            publishPayload: {
               alfResponseScope: "OTHER_SCOPE_",
               responseScope: "THIRD_SCOPE_"
            }
         }
      },
      {
         id: "B6",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Scoped with responseScope",
            pubSubScope: "SCOPE_",
            publishTopic: "B6",
            publishPayload: {
               alfResponseScope: "OTHER_SCOPE_",
               responseScope: "THIRD_SCOPE_"
            }
         }
      },
      {
         id: "B7",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Dialog (no responseScope)",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "B7_DIALOG",
               dialogTitle: "Dialog",
               formSubmissionTopic: "B7_DIALOG",
               formSubmissionPayloadMixin: {
               },
               widgets: [
                  {
                     id: "B7_TB",
                     name: "alfresco/forms/controls/TextBox",
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
         id: "B8",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Dialog (responseScope)",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "B8_DIALOG",
               dialogTitle: "Dialog",
               formSubmissionTopic: "B8_DIALOG",
               formSubmissionPayloadMixin: {
               },
               widgets: [
                  {
                     id: "B8_TB",
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        name: "text",
                        label: "Enter some text"
                     }
                  }
               ],
               responseScope: "FOURTH_SCOPE_"
            }
         }
      },
      {
         id: "B9",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Dialog (formSubmissionPayloadMixin)",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "B9_DIALOG",
               dialogTitle: "Dialog",
               formSubmissionTopic: "B9_DIALOG",
               formSubmissionPayloadMixin: {
                  responseScope: "FIFTH_SCOPE_"
               },
               widgets: [
                  {
                     id: "B9_TB",
                     name: "alfresco/forms/controls/TextBox",
                     config: {
                        name: "text",
                        label: "Enter some text"
                     }
                  }
               ],
               responseScope: "FOURTH_SCOPE_"
            }
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};