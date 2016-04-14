<import resource="classpath:alfresco/site-webscripts/org/alfresco/aikau/{aikauVersion}/libs/dnd-models/forms.lib.js">

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
      {
         name: "alfresco/services/DragAndDropModellingService",
         config: {
            models: [
               getDefaultFormModel(),
               getDefaultFormControlModel()
            ]
         }
      },
      "alfresco/services/DialogService",
      "alfresco/services/PageService",
      "alfresco/services/OptionsService"
   ],
   widgets: [
      {
         name: "alfresco/layout/VerticalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Preview",
                     widgets: [
                        {
                           name: "alfresco/prototyping/Preview"
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/layout/HorizontalWidgets",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/layout/ClassicWindow",
                           widthPx: 300,
                           config: {
                              title: "Widget Palette",
                              widgets: [
                                 {
                                    id: "DRAG_PALETTE",
                                    name: "alfresco/dnd/DragAndDropItems",
                                    config: {
                                       items: [
                                          {
                                             type: [ "widget" ],
                                             label: "Form Control",
                                             value: {
                                                name: "alfresco/forms/controls/TextBox",
                                                config: {
                                                   label: "No Label",
                                                   description: "No description",
                                                   value: ""
                                                }
                                             }
                                          },
                                          {
                                             type: [ "widget" ],
                                             label: "Form",
                                             value: {
                                                name: "alfresco/forms/Form",
                                                config: {
                                                }
                                             }
                                          }
                                       ]
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           name: "alfresco/layout/ClassicWindow",
                           config: {
                              title: "Widget Layout",
                              widgets: [
                                 {
                                    id: "FORM1",
                                    name: "alfresco/forms/Form",
                                    config: {
                                       scopeFormControls: false,
                                       okButtonLabel: "Save",
                                       okButtonPublishTopic: "FORM1_POST",
                                       okButtonPublishGlobal: true,
                                       showCancelButton: false,
                                       widgets: [
                                          {
                                             id: "ROOT_DROPPED_ITEMS1",
                                             name: "alfresco/forms/controls/DragAndDropTargetControl",
                                             config: {
                                                label: "Widgets",
                                                name: "widgets",
                                                value: null,
                                                acceptTypes: ["widget"],
                                                useModellingService: true
                                             }
                                          }
                                       ],
                                       widgetsAdditionalButtons: [
                                          {
                                             name: "alfresco/buttons/AlfButton",
                                             config: {
                                                label: "Preview",
                                                publishTopic: "ALF_GENERATE_PAGE_PREVIEW"
                                             }
                                          },
                                          {
                                             name: "alfresco/buttons/AlfButton",
                                             config: {
                                                label: "WebScript Controller Export",
                                                publishTopic: "ALF_EXPORT_PAGE_DEFINITION",
                                                publishGlobal: true
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