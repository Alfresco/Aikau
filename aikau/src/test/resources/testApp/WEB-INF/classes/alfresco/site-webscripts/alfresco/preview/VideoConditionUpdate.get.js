/* global page */
/* jshint sub:true */
var pluginOverrides = null;
if (page.url.args["addCondition"] === "true") {
   pluginOverrides = [
      {
         attributes:{
            mimeType: "video/ogg"
         },
         plugins: [
            {
               name: "Video",
               attributes: {}
            }
         ]
      }
   ];
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
            markdown: "Use the request parameter 'addCondition=true' to update the conditions to support the video format"
         }
      },
      {
         name: "alfresco/documentlibrary/AlfDocument",
         config: {
            nodeRef: "workspace://SpacesStore/b5973042-9f07-472f-980d-940eb117524b",
            widgets: [
               {
                  name: "alfresco/preview/AlfDocumentPreview",
                  config: {
                     pluginConditionsOverrides: pluginOverrides
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