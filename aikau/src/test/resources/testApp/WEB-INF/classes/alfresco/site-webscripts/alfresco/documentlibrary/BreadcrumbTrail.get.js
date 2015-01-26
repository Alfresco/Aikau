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
         id: "CHANGE_NODEREF",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Change Current NodeRef",
            publishTopic: "ALF_CURRENT_NODEREF_CHANGED",
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
            }
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
         name: "alfresco/documentlibrary/AlfBreadcrumbTrail",
         config: {
            rootLabel: "HOME",
            currentPath: "/some/imaginary/path",
            _currentNode: {
            }
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};