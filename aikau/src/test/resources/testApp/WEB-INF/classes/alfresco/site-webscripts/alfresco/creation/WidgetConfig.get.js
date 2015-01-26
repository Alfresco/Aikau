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
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  id: "DRAG_PALETTE",
                  name: "alfresco/creation/DragPalette",
                  widthPc: 33,
                  config: {
                     widgetsForPalette: [
                        {
                           type: [ "widget" ],
                           name: "Form",
                           module: "alfresco/forms/Form",
                           defaultConfig: {
                              label: "Value1"
                           },
                           widgetsForConfig: [
                              {
                                 name: "alfresco/forms/controls/DojoValidationTextBox",
                                 config: {
                                    name: "defaultConfig.label",
                                    label: "Field1",
                                    value: "Value1"
                                 }
                              }
                           ],
                           previewWidget: false,
                           widgetsForDisplay: [
                              {
                                 name: "alfresco/creation/DropZone",
                                 config: {
                                    horizontal: false
                                 }
                              }
                           ]
                        }
                     ]
                  }
               },
               {
                  id: "FORM",
                  name: "alfresco/forms/Form",
                  widthPc: 33,
                  config: {
                     scopeFormControls: false,
                     okButtonLabel: "Save",
                     okButtonPublishTopic: "WIDGET_CONFIG_POST",
                     okButtonPublishGlobal: true,
                     showCancelButton: false,
                     widgets: [
                        {
                           id: "ROOT_DROP_ZONE",
                           name: "alfresco/forms/controls/DropZoneControl",
                           config: {
                              label: "Widgets",
                              name: "widgets",
                              value: null,
                              acceptTypes: ["widget"]
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/creation/WidgetConfig",
                  widthPc: 33
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
};