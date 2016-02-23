/* global page */
/* jshint sub:true */
var removeCondition = false;
if (page.url.args["removeCondition"]) {
   removeCondition = page.url.args["removeCondition"] === "true";
}

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
      "alfresco/services/DocumentService",
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         name: "alfresco/html/Markdown",
         config: {
            markdown: "Use the request parameter 'removeCondition=true' to update the conditions and prevent the preview from rendering"
         }
      },
      {
         name: "alfresco/documentlibrary/AlfDocument",
         config: {
            nodeRef: "workspace://SpacesStore/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4",
            widgets: [
               {
                  name: "alfresco/preview/AlfDocumentPreview",
                  config: {
                     pluginConditionsOverides: [
                        {
                           attributes:{
                              mimeType: "image/jpeg"
                           },
                           remove: removeCondition
                        },
                        {
                           attributes:{
                              thumbnail: "imgpreview"
                           },
                           remove: removeCondition
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/PreviewMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};