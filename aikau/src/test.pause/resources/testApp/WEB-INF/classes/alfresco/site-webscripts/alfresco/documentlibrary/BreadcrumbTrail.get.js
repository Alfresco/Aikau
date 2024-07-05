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
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         id: "FIXED_BREADCRUMBS",
         name: "alfresco/documentlibrary/AlfBreadcrumbTrail",
         config: {
            breadcrumbs: [
               {
                  label: "Small"
               },
               {
                  label: "Crumb"
               },
               {
                  label: "Of"
               },
               {
                  label: "Comfort"
               }
            ]
         }
      },
      {
         id: "PATH_BREADCRUMBS",
         name: "alfresco/documentlibrary/AlfBreadcrumbTrail",
         config: {
            showRootLabel: false,
            pathChangeTopic: "CHANGE_PATH",
            currentPath: "/the/road/less/travelled"
         }
      },
      {
         id: "LINKING_PATH_BREADCRUMBS",
         name: "alfresco/documentlibrary/AlfBreadcrumbTrail",
         config: {
            showRootLabel: false,
            currentPath: "/ambition/is/the/path/to/success",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            publishPayloadType: "PROCESS",
            publishPayloadModifiers: ["processInstanceTokens"],
            publishPayload: {
               url: "documentlibrary#filter=path|/{path}"
            }
         }
      },
      {
         id: "HASH_BREADCRUMBS",
         name: "alfresco/documentlibrary/AlfBreadcrumbTrail",
         config: {
            pubSubScope: "SCOPED_",
            lastBreadcrumbIsCurrentNode: true,
            useHash: true,
            rootLabel: "HOME",
            lastBreadcrumbPublishTopic: "ALF_NAVIGATE_TO_PAGE",
            lastBreadcrumbPublishPayload: {
               url: "folder-details?nodeRef={currentNode.parent.nodeRef}",
               type: "PAGE_RELATIVE",
               target: "CURRENT"
            },
            lastBreadcrumbPublishPayloadType: "PROCESS",
            lastBreadcrumbPublishPayloadModifiers: ["processInstanceTokens"],
            currentPath: "/some/imaginary/path",
            currentNode: {
            }
         }
      },
      {
         id: "OVERFLOW_BREADCRUMBS",
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  widthPx: 400,
                  name: "alfresco/documentlibrary/AlfBreadcrumbTrail",
                  config: {
                     breadcrumbs: [
                        {
                           label: "There's"
                        },
                        {
                           label: "a"
                        },
                        {
                           label: "lady"
                        },
                        {
                           label: "who's"
                        },
                        {
                           label: "sure"
                        },
                        {
                           label: "all"
                        },
                        {
                           label: "that"
                        },
                        {
                           label: "glitters"
                        },
                        {
                           label: "is"
                        },
                        {
                           label: "gold,"
                        },
                        {
                           label: "and"
                        },
                        {
                           label: "she's"
                        },
                        {
                           label: "buying"
                        },
                        {
                           label: "a"
                        },
                        {
                           label: "breadcrumb"
                        },
                        {
                           label: "to"
                        },
                        {
                           label: "heaven"
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         id: "ESCAPED_BREADCRUMBS",
         name: "alfresco/documentlibrary/AlfBreadcrumbTrail",
         config: {
            breadcrumbs: [
               {
                  label: "These breadcrumbs contain XSS attacks"
               },
               {
                  label: "<script>alert('XSS');</script>"
               },
               {
                  label: "<div style='width: expression(alert(\'XSS\'));'>"
               }
            ]
         }
      },
      {
         id: "CHANGE_NODEREF",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Change Current NodeRef",
            publishTopic: "SCOPED_ALF_CURRENT_NODEREF_CHANGED",
            publishPayload: {
               node: {
                  parent: {
                     nodeRef: "some://fake/nodeRef"
                  }
               }
            }
         }
      },
      {
         id: "SET_HASH",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Change Hash",
            publishTopic: "ALF_HASH_CHANGED",
            publishPayload: {
               path: "/different/path"
            },
            pubSubScope: "SCOPED_"
         }
      },
      {
         id: "SHOW_PATH",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Show Path",
            publishTopic: "ALF_DOCLIST_SHOW_PATH",
            publishPayload: {
               selected: true
            }
         }
      },
      {
         id: "HIDE_PATH",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Hide Path",
            publishTopic: "ALF_DOCLIST_SHOW_PATH",
            publishPayload: {
               selected: false
            }
         }
      },
      {
         id: "FILTER_SELECTION",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Select Filter",
            publishTopic: "ALF_DOCLIST_FILTER_SELECTION",
            publishPayload: {
               description: "Simulated Filter"
            }
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};