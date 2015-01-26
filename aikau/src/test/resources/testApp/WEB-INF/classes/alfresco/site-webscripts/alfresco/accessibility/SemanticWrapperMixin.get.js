model.jsonModel = {
   services: [
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/footer/AlfShareFooter",
         config: {
            id: "NO_WRAPPER",
            licenseLabel: "NO_WRAPPER licenseLabel",
            copyrightLabel: "This application is copyright to Alfresco Software Ltd",
            altText: "This is the logo"
         }
      },
      {
         name: "alfresco/footer/AlfShareFooter",
         config: {
            id: "GOOD_WRAPPER",
            semanticWrapper: "footer",
            licenseLabel: "GOOD_WRAPPER licenseLabel",
            copyrightLabel: "This application is copyright to Alfresco Software Ltd",
            altText: "This is the logo"
         }
      },
      {
         name: "alfresco/footer/AlfShareFooter",
         config: {
            id: "BAD_WRAPPER",
            semanticWrapper: "sooter",
            licenseLabel: "BAD_WRAPPER licenseLabel",
            copyrightLabel: "This application is copyright to Alfresco Software Ltd",
            altText: "This is the logo"
         }
      },
      {
         name: "alfresco/layout/LeftAndRight",
         config:
         {
         	id: "LEFT_AND_RIGHT_WRAPPER",
            semanticWrapper: "header",
            widgets: [
               {
                  id: "HEADER_TITLE",
                  name: "alfresco/header/Title",
                  align: "left",
                  config: {
                     label: "This is a title with a semantic wrapper",
                     setBrowserTitle: true
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};