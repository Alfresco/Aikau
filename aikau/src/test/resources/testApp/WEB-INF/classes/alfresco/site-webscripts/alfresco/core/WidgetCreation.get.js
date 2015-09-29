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
         name: "alfresco/logo/Logo",
         config: {
            logoClasses: "alfresco-logo-only"
         }
      },
      {
         id: "USE_MODEL_ID_IN_DOM",
         name: "alfresco/logo/Logo",
         config: {
            logoClasses: "alfresco-logo-3d"
         }
      },
      {
         id: "OVERRIDE_ID_IN_DOM",
         name: "alfresco/logo/Logo",
         config: {
            id: "SPECIFIC_DOM_ID",
            logoClasses: "surf-logo-large"
         }
      },
      {
         id: "LIST",
         name: "alfresco/lists/AlfList",
         config: {
            currentData: {
               items: [
                  { value: "one"},
                  { value: "two"}
               ]
            },
            widgets: [
               {
                  id: "LIST_VIEW",
                  name: "alfresco/lists/views/AlfListView",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/lists/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             id: "PROPERTY_LINK",
                                             name: "alfresco/renderers/PropertyLink",
                                             config: {
                                                propertyToRender: "value",
                                                useCurrentItemAsPayload: false,
                                                publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
                                                publishPayloadType: "PROCESS",
                                                publishPayloadModifiers: ["processCurrentItemTokens"],
                                                publishPayload: {
                                                   dialogId: "{value}_DIALOG",
                                                   dialogTitle: "Dialog",
                                                   formSubmissionTopic: "POST_DIALOG_2",
                                                   widgets: [
                                                      {
                                                         id: "TABBED_CONTROLS",
                                                         name: "alfresco/forms/TabbedControls",
                                                         config: {
                                                            widgets: [
                                                               {
                                                                  id: "TABBED_CONTROL_COLUMN",
                                                                  name: "alfresco/forms/ControlColumn",
                                                                  title: "Tab 1",
                                                                  config: {
                                                                     widgets: [
                                                                        {
                                                                           id: "TEXTBOX",
                                                                           name: "alfresco/forms/controls/TextBox",
                                                                           config: {
                                                                              fieldId: "TB",
                                                                              name: "tab1tb",
                                                                              label: "Tab 1 TextBox"
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
               }
            ]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};