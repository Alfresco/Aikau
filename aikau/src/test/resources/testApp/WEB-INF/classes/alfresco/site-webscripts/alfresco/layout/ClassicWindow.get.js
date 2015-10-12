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
      }
   ]
};