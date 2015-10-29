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
      "alfresco/services/DocumentService"
   ],
   widgets: [
      {
         id: "LOADING_DOCUMENT",
         name: "alfresco/documentlibrary/AlfDocument",
         config: {
            itemProperty: "response",
            nodeRef: "some://dummy/node",
            widgets: [
               {
                  id: "PROPERTYLINK",
                  name: "alfresco/renderers/PropertyLink",
                  config: {
                     label: "Click to populate second AlfDocument",
                     propertyToRender: "displayName",
                     publishTopic: "SCOPED_ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST_SUCCESS"
                  }
               }
            ]
         }
      },
      {
         id: "NON_LOADING_DOCUMENT",
         name: "alfresco/documentlibrary/AlfDocument",
         config: {
            pubSubScope: "SCOPED_",
            itemProperty: "",
            widgets: [
               {
                  id: "PROPERTY",
                  name: "alfresco/renderers/Property",
                  config: {
                     propertyToRender: "displayName"
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/AlfDocumentMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};