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
      "alfresco/services/DocumentService"
   ],
   widgets: [
      {
         name: "alfresco/documentlibrary/AlfDocumentList",
         config: {
            widgets: [
               {
                  name: "alfresco/documentlibrary/views/AlfSimpleView"
               }
            ]
         }
      },
      {
         name: "alfresco/testing/NodesMockXhr",
         config: {
            totalItems: 0
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};