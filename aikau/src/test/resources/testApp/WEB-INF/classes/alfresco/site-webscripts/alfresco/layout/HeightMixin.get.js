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
   widgets:[
      {
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgetMarginLeft: 10,
            widgetMarginRight: 10,
            widgets: [
               {
                  id: "AUTO",
                  name: "aikauTesting/widgets/TestHeight",
                  config: {
                     heightMode: "AUTO",
                     label: "Client height"
                  }
               },
               {
                  id: "FIXED",
                  name: "aikauTesting/widgets/TestHeight",
                  config: {
                     heightMode: 200,
                     label: "200px"
                  }
               },
               {
                  id: "MINUS",
                  name: "aikauTesting/widgets/TestHeight",
                  config: {
                     heightMode: -100,
                     label: "Client height minus 100px"
                  }
               },
               {
                  id: "LAUNCH_DIALOG",
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: "Launch dialog",
                     publishTopic: "ALF_CREATE_DIALOG_REQUEST",
                     publishPayload: {
                        dialogId: "HEIGHT_DIALOG",
                        dialogTitle: "Dialog",
                        contentWidth: "700px",
                        contentHeight: "300px",
                        additionalCssClasses: "no-padding",
                        widgetsContent: [
                           {
                              name: "aikauTesting/widgets/TestHeight",
                              config: {
                                 heightMode: "DIALOG",
                                 label: "Dialog body height"
                              }
                           }
                        ]
                     }
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