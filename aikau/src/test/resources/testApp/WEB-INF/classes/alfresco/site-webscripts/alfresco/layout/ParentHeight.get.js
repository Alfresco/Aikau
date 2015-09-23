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
      "alfresco/services/ErrorReporter",
      "alfresco/services/DialogService",
      "alfresco/services/NotificationService"
   ],
   widgets: [
      {
         id: "SIMPLE_PANEL_1",
         name: "alfresco/layout/SimplePanel",
         config: {
            height: "600px",
            widgets: [
               {
                  id: "HORIZ_1",
                  name: "alfresco/layout/HorizontalWidgets",
                  config: {
                     widgets: [
                        {
                           id: "FIXED_HEADER_FOOTER_1",
                           name: "alfresco/layout/FixedHeaderFooter",
                           config: {
                              heightMode: "PARENT",
                              widgetsForHeader: [
                                 {
                                    name: "alfresco/html/Label",
                                    config: {
                                       label: "Header"
                                    }
                                 }
                              ],
                              widgets: [
                                 {
                                    id: "PDF_DOCUMENT",
                                    name: "alfresco/documentlibrary/AlfDocument",
                                    config: {
                                       nodeRef: "workspace://SpacesStore/f8394454-0651-48a5-b583-d067c7d03339",
                                       widgets: [
                                          {
                                             id: "PDF_PREVIEW",
                                             name: "alfresco/preview/AlfDocumentPreview",
                                             config: {
                                                heightMode: "PARENT",
                                                heightAdjustment: 4
                                             }
                                          }
                                       ]
                                    }
                                 }
                              ],
                              widgetsForFooter: [
                                 {
                                    name: "alfresco/html/Label",
                                    config: {
                                       label: "Footer"
                                    }
                                 }
                              ]
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/PdfJsMockXhr",
         config: {
            
         }
      }
   ]
};