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
      "alfresco/services/NavigationService",
      "alfresco/services/DocumentService",
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "alfresco/layout/VerticalWidgets",
         config: {
            widgets: [
               {
                  id: "MENU_BAR",
                  name: "alfresco/menus/AlfMenuBar",
                  config: {
                     widgets: [
                        {
                           id: "POPUP_MENU",
                           name: "alfresco/menus/AlfMenuBarPopup",
                           config: {
                              iconClass: "alf-configure-icon",
                              widgets: [
                                 {
                                    id: "VIEW_SELECTION_GROUP",
                                    name: "alfresco/documentlibrary/AlfViewSelectionGroup"
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
                           id: "DOCLIST",
                           name: "alfresco/documentlibrary/AlfDocumentList",
                           widthPx: 600,
                           config: {
                              waitForPageWidgets: false,
                              useHash: true,
                              widgets: [
                                 {
                                    id: "FILMSTRIP_VIEW",
                                    name: "alfresco/documentlibrary/views/AlfFilmStripView"
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
         name: "aikauTesting/mockservices/DocumentLibraryMockXhr"
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};