/* global RequestParameters */
var label;
var posted = RequestParameters.get("test");
if (posted)
{
   label = {
      id: "POSTED",
      name: "alfresco/html/Label",
      config: {
         label: posted
      }
   };
}
else
{
   label = {
      id: "NOTHING_POSTED",
      name: "alfresco/html/Label",
      config: {
         label: "Nothing posted"
      }
   };
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
      "alfresco/services/NavigationService",
      {
         name: "alfresco/services/NotificationService",
         config: {
            showProgressIndicator: true
         }
      }
   ],
   widgets: [
      label,
      {
         id: "SET_HASH",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set a hash",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            publishPayload: {
               url: "#hash1=bob&hash2=ted",
               type: "HASH",
               target: "CURRENT"
            }
         }
      },
      {
         id: "MODIFY_HASH",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Modify a hash",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            publishPayload: {
               url: "hash3=fred/barney",
               type: "HASH",
               target: "CURRENT",
               modifyCurrent: true
            }
         }
      },
      {
         id: "POST_TO_CURRENT_PAGE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Post to current page",
            publishTopic: "ALF_POST_TO_PAGE",
            publishPayload: {
               url: "tp/ws/NavigationService?same=true",
               type: "PAGE_RELATIVE",
               target: "CURRENT",
               parameters: {
                  test: "success"
               }
            }
         }
      },
      {
         id: "POST_TO_NEW_PAGE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Post to new page",
            publishTopic: "ALF_POST_TO_PAGE",
            publishPayload: {
               url: "tp/ws/NavigationService?new=true",
               type: "PAGE_RELATIVE",
               target: "NEW",
               parameters: {
                  test: "success"
               }
            }
         }
      },
      {
         id: "NAVIGATE_TO_NAMED_PAGE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Navigate to named page",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            publishPayload: {
               url: "tp/ws/NavigationService?named=true",
               type: "PAGE_RELATIVE",
               target: "NAMED",
               targetName: "new_window"
            }
         }
      },
      {
         id: "NAV_TO_PAGE_WITH_PARAMS",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Navigate with query and hash params",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            publishPayload: {
               url: "tp/ws/NavigationService",
               type: "PAGE_RELATIVE",
               target: "CURRENT",
               queryParams: {
                  foo: "qryprm",
                  bar: "scndqryprm"
               },
               hashParams: {
                  baz: "hshprm"
               }
            }
         }
      },
      {
         id: "BACK_TO_ORIGINAL_URL",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Reload original page",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            publishPayload: {
               url: "tp/ws/NavigationService",
               type: "PAGE_RELATIVE",
               target: "CURRENT"
            }
         }
      },
      {
         id: "ACTION_LINK_FOR_DOWNLOAD",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Simulate action download link",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            publishPayload: {
               url: "tp/ws/NavigationService?a=true",
               type: "PAGE_RELATIVE",
               target: "CURRENT"
            }
         }
      },
      {
         id: "MENU_BAR",
         name: "alfresco/menus/AlfMenuBar",
         config: {
            widgets: [
               {
                  id: "FULL_PATH_SITE_STRING",
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     label: "Full path site string",
                     publishTopic: "ALF_NAVIGATE_TO_PAGE",
                     publishPayload: {
                        url: "/aikau/page/tp/ws/NavigationService",
                        type: "FULL_PATH",
                        target: "CURRENT"
                     },
                     publishPayloadType: "PROCESS",
                     publishPayloadModifiers: ["processCurrentItemTokens"],
                     publishPayloadItemMixin: true,
                     currentItem: {
                        site: "gwen"
                     }
                  }
               },
               {
                  id: "PAGE_RELATIVE_SITE_OBJECT",
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     label: "Page relative site object",
                     publishTopic: "ALF_NAVIGATE_TO_PAGE",
                     publishPayload: {
                        url: "tp/ws/NavigationService",
                        type: "PAGE_RELATIVE",
                        target: "CURRENT"
                     },
                     publishPayloadType: "PROCESS",
                     publishPayloadModifiers: ["processCurrentItemTokens"],
                     publishPayloadItemMixin: true,
                     currentItem: {
                        site: {
                           shortName: "bob",
                           title: "Bob"
                        }
                     }
                  }
               },
               {
                  id: "PAGE_RELATIVE_SITE_STRING",
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     label: "Page relative site string",
                     publishTopic: "ALF_NAVIGATE_TO_PAGE",
                     publishPayload: {
                        url: "tp/ws/NavigationService",
                        type: "PAGE_RELATIVE",
                        target: "CURRENT"
                     },
                     publishPayloadType: "PROCESS",
                     publishPayloadModifiers: ["processCurrentItemTokens"],
                     publishPayloadItemMixin: true,
                     currentItem: {
                        site: "gwen"
                     }
                  }
               },
               {
                  id: "PAGE_RELATIVE_INVALID_SITE",
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     label: "Page relative invalid site object",
                     publishTopic: "ALF_NAVIGATE_TO_PAGE",
                     publishPayload: {
                        url: "tp/ws/NavigationService",
                        type: "PAGE_RELATIVE",
                        target: "CURRENT"
                     },
                     publishPayloadType: "PROCESS",
                     publishPayloadModifiers: ["processCurrentItemTokens"],
                     publishPayloadItemMixin: true,
                     currentItem: {
                        site: {
                           wrong: "tony"
                        }
                     }
                  }
               },
               {
                  id: "PAGE_RELATIVE_NO_SITE",
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     label: "Page relative no site",
                     publishTopic: "ALF_NAVIGATE_TO_PAGE",
                     publishPayload: {
                        url: "tp/ws/NavigationService",
                        type: "PAGE_RELATIVE",
                        target: "CURRENT"
                     },
                     publishPayloadType: "PROCESS",
                     publishPayloadModifiers: ["processCurrentItemTokens"],
                     publishPayloadItemMixin: true,
                     currentItem: {
                        
                     }
                  }
               },
               {
                  id: "SAME_PAGE_BUT_WITH_HASHES",
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     label: "Page relative no site with hash",
                     publishTopic: "ALF_NAVIGATE_TO_PAGE",
                     publishPayload: {
                        url: "tp/ws/NavigationService#hash=test",
                        type: "PAGE_RELATIVE",
                        target: "CURRENT"
                     },
                     publishPayloadType: "PROCESS",
                     publishPayloadModifiers: ["processCurrentItemTokens"],
                     publishPayloadItemMixin: true,
                     currentItem: {
                        
                     }
                  }
               }

            ]
         }
      },
      {
         name: "aikauTesting/mockservices/NavigationServiceMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};