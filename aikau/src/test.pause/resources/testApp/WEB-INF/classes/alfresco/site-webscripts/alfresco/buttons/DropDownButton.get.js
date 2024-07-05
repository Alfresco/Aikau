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
         name: "alfresco/layout/VerticalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/layout/LeftAndRight",
                  config: {
                     widgetsLeft: [
                        {
                           id: "DDB1",
                           name: "alfresco/buttons/DropDownButton",
                           config: {
                              hideDropDownTopics: ["SAVE", "CANCEL"],
                              label: "button.label.one",
                              widgets: [
                                 {
                                    id: "FORM",
                                    name: "alfresco/forms/Form",
                                    config: {
                                       okButtonLabel: "Save",
                                       okButtonPublishTopic: "SAVE",
                                       okButtonPublishGlobal: true,
                                       cancelButtonLabel: "Cancel",
                                       cancelButtonPublishTopic: "CANCEL",
                                       cancelButtonPublishGlobal: true,
                                       widgets: [
                                          {
                                             id: "TB1",
                                             name: "alfresco/forms/controls/TextBox",
                                             config: {
                                                label: "Name",
                                                name: "name",
                                                placeHolder: "Enter a name...",
                                                value: ""
                                             }
                                          },
                                          {
                                             id: "RB1",
                                             name: "alfresco/forms/controls/RadioButtons",
                                             config: {
                                                label: "Options",
                                                name: "options",
                                                optionsConfig: {
                                                   fixed: [
                                                      { label: "One", value: "ONE" },
                                                      { label: "Two", value: "TWO" },
                                                      { label: "Three", value: "THREE" }
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
                     ],
                     widgetsRight: [
                        {
                           id: "DDB2",
                           name: "alfresco/buttons/DropDownButton",
                           config: {
                              label: "button.label.two",
                              widgets: [
                                 {
                                    name: "alfresco/lists/AlfList",
                                    config: {
                                       currentData: {
                                          items: [
                                             { displayName: "One" },
                                             { displayName: "Two" },
                                             { displayName: "Three" }
                                          ]
                                       },
                                       widgets: [
                                          {
                                             name: "alfresco/lists/views/HtmlListView",
                                             config: {
                                                listStyleType: "square"
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