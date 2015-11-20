/* This library file is provides the basic template for creation of pages and templates
 * for saving back to the Alfresco Repository
 */

/*jshint unused:false*/

function getBasicCreationTemplateServices() {
   return [
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
      "alfresco/services/DialogService",
      "alfresco/services/PageService",
      "alfresco/services/OptionsService"
   ];
}

function getBasicCreationTemplateWidgets(paletteWidgets) {
   return [
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
                              widgets: paletteWidgets
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
      }
   ];
}