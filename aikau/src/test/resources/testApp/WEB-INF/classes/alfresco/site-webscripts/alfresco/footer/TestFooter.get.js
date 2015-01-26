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
         name: "alfresco/footer/AlfStickyFooter",
         config: {
            widgets: [
               {
                  id: "SHARE_VERTICAL_LAYOUT",
                  name: "alfresco/layout/VerticalWidgets",
                  config: 
                  {
                     widgets: [
                        {
                           name: "alfresco/logging/SubscriptionLog"
                        },
                        {
                           name: "aikauTesting/TestCoverageResults"
                        }
                     ]
                  }
               }
            ],
            widgetsForFooter: [
               {
                  name: "alfresco/footer/AlfShareFooter",
                  config: {
                     cssClass: "testCss",
                     licenseLabel: "SOME LICENSE LABEL",
                     copyrightLabel: "SOME COPYRIGHT LABEL",
                     altText: "SOME ALT TEXT",
                     logoImageSrc: "alfresco-share-logo-enterprise.png"
                  }
               },
               {
                  id: "FOOTER_WITH_NULL_VALUES",
                  name: "alfresco/footer/AlfShareFooter",
                  config: {
                     cssClass: null,
                     licenseLabel: null,
                     copyrightLabel: null,
                     altText: null,
                     logoImageSrc: null
                  }
               },
               {
                  id: "FOOTER_WITH_EMPTY_VALUES",
                  name: "alfresco/footer/AlfShareFooter",
                  config: {
                     cssClass: "",
                     licenseLabel: "",
                     copyrightLabel: "",
                     altText: "",
                     logoImageSrc: ""
                  }
               },
               {
                  id: "FOOTER_WITH_UNKNOWN_VALUE",
                  name: "alfresco/footer/AlfShareFooter",
                  config: {
                     licenseLabel: "UNKNOWN"
                  }
               },
               {
                  id: "FOOTER_WITH_NO_VALUES",
                  name: "alfresco/footer/AlfShareFooter"
               }
            ]
         }
      }
   ]
};