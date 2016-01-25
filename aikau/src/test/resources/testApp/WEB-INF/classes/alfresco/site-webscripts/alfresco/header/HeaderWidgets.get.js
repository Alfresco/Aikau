/* global msg */
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
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         name: "alfresco/layout/VerticalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/header/Header",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/header/AlfMenuBar",
                           config: {
                              widgets: [
                                 {
                                    id: "HEADER_POPUP",
                                    name: "alfresco/header/AlfMenuBarPopup",
                                    config: {
                                       label: "Really, Really, Really Long Header Popup",
                                       widgets: [
                                          {
                                             id: "NO_STATUS",
                                             name: "alfresco/header/CurrentUserStatus",
                                             config: {

                                             }
                                          },
                                          {
                                             id: "PRESET_STATUS",
                                             name: "alfresco/header/CurrentUserStatus",
                                             config: {
                                                userStatus: "Test Status",
                                                userStatusTime: "2000-04-11T12:42:02+00:00"
                                             }
                                          },
                                          {
                                             id: "CASCADE_1",
                                             name: "alfresco/header/AlfCascadingMenu",
                                             config: {
                                                label: "Header Cascade",
                                                widgets: [
                                                   {
                                                      id: "MENU_ITEM_1",
                                                      name: "alfresco/header/AlfMenuItem",
                                                      config: {
                                                         label: "Update status",
                                                         publishTopic: "ALF_USER_STATUS_UPDATED",
                                                         publishPayload: {
                                                            userStatus: "Button Update",
                                                            userStatusTime: "2000-04-11T12:42:02+00:00"
                                                         }
                                                      }
                                                   }
                                                ]
                                             }
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    id: "SITES_MENU",
                                    name: "alfresco/header/AlfSitesMenu",
                                    config: {
                                       currentSite: "site1",
                                       currentUser: "admin"
                                    }
                                 }
                              ]
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/header/Title",
                  config: {
                     label: msg.get("test.page.title"),
                     setBrowserTitle: true
                  }
               },
               {
                  id: "SET_TITLE_BUTTON",
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: "Change Title",
                     publishTopic: "ALF_UPDATE_PAGE_TITLE",
                     publishPayload: {
                        title: msg.get("test.page.updated.title")
                     }
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/HeaderMockXhr",
         config: {
            location: "NON_SITE"
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};