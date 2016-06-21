model.jsonModel = {
   services: [
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         id: "WINDOW1",
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Test title",
            widgets: [
               {
                  name: "alfresco/logo/Logo",
                  config: {
                     logoClasses: "alfresco-logo-grey"
                  }
               }
            ]
         }
      },
      {
         id: "WINDOW2",
         name: "alfresco/layout/ClassicWindow",
         config: {
            hideTitle: true,
            widgets: [
               {
                  name: "alfresco/logo/Logo",
                  config: {
                     logoClasses: "alfresco-logo-grey"
                  }
               }
            ]
         }
      },
      {
         id: "HORIZONTAL_WIDGETS",
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  id: "WINDOW3",
                  name: "alfresco/layout/ClassicWindow",
                  widthPx: "200",
                  config: {
                     title: "Overflow",
                     additionalCssClasses: "bottomBorderRadius shadow",
                     widgets: [
                        {
                           name: "alfresco/logo/Logo",
                           config: {
                              logoClasses: "surf-logo-large"
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  id: "WINDOW4",
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "One",
                     additionalCssClasses: "no-margin"
                  }
               },
               {
                  id: "WINDOW5",
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Two",
                     additionalCssClasses: "no-margin"
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