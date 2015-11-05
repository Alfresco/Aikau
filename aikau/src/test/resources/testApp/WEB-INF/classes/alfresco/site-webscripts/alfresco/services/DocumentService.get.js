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
      "alfresco/services/ActionService",
      "alfresco/services/DocumentService",
      "alfresco/services/DialogService"
   ],
   widgets: [
      {
         id: "SINGLE_DOCUMENT_DOCLIB",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Single document (DocLib API)",
            publishTopic: "ALF_MULTIPLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               actionTopic: "ALF_SMART_DOWNLOAD",
               documents: [
                  {
                     node: {
                        isContainer: false,
                        nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                        contentURL: "/slingshot/node/content/workspace/SpacesStore/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4/2013-12-29%2009.58.43.jpg"
                     }
                  }
               ]
            }
         }
      },
      {
         id: "SINGLE_FOLDER_DOCLIB",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Single folder (DocLib API)",
            publishTopic: "ALF_MULTIPLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               actionTopic: "ALF_SMART_DOWNLOAD",
               documents: [
                  {
                     node: {
                        isContainer: true,
                        nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e"
                     }
                  }
               ]
            }
         }
      },
      {
         id: "SINGLE_DOCUMENT_SEARCH",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Single document (Search API)",
            publishTopic: "ALF_MULTIPLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               actionTopic: "ALF_SMART_DOWNLOAD",
               documents: [
                  {
                     type: "document",
                     nodeRef: "workspace://SpacesStore/f8394454-0651-48a5-b583-d067c7d03339"
                  }
               ]
            }
         }
      },
      {
         id: "SINGLE_FOLDER_SEARCH",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Single folder (Search API)",
            publishTopic: "ALF_MULTIPLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               actionTopic: "ALF_SMART_DOWNLOAD",
               documents: [
                  {
                     type: "folder",
                     nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e"
                  }
               ]
            }
         }
      },
      {
         id: "MULTIPLE_DOCUMENTS",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Multiple documents",
            publishTopic: "ALF_MULTIPLE_DOCUMENT_ACTION_REQUEST",
            publishPayload: {
               actionTopic: "ALF_SMART_DOWNLOAD",
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
         name: "aikauTesting/mockservices/SmartDownloadMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};