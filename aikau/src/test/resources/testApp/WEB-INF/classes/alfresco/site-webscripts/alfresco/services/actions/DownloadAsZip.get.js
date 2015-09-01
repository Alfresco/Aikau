// jshint undef:false
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
      "alfresco/services/DialogService",
      "alfresco/services/ActionService",
      "alfresco/services/DocumentService"
   ],
   widgets: [
      {
         id: "SINGLE_DOWNLOAD_VIA_ACTION_SERVICE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Single Node",
            publishTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: {
                  "id": "folder-download",
                  "icon": "document-download",
                  "type": "javascript",
                  "label": "actions.folder.download",
                  "params": {
                     "function": "onActionFolderDownload"
                  },
                  "index": "100"
               },
               document: {
                  node: {
                     nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e"
                  },
                  displayName: "Some Node Title"
               }
            }
         }
      },
      {
         id: "MULTIPLE_DOWNLOAD_VIA_ACTION_SERVICE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Multiple Nodes",
            publishTopic: "ALF_MULTIPLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               action: "onActionDownload",
               documents: [
                  {
                     node: {
                        nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e"
                     }
                  },
                  {
                     node: {
                        nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e"
                     }
                  }
               ]
            }
         }
      },
      {
         id: "LIST",
         name: "alfresco/lists/views/AlfListView",
         config: {
            currentData: {
               items: [
                  {
                     displayName: "Document",
                     nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                     node: {
                        nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                        isContainer: false
                     }
                  },
                  {
                     displayName: "Folder",
                     nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                     node: {
                        nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                        isContainer: true
                     }
                  }
               ]
            },
            widgets: [
               {
                  name: "alfresco/lists/views/layouts/Row",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/lists/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    id: "DISPLAY_NAME",
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "displayName"
                                    }
                                 },
                                 {
                                    id: "ACTIONS",
                                    name: "alfresco/renderers/Actions",
                                    config: {
                                       widgetsForActions: [
                                          {
                                             name: "alfresco/renderers/actions/DownloadAsZip"
                                          }
                                       ]
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
         name: "aikauTesting/mockservices/DownloadArchiveMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};