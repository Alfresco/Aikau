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
         id: "ITEM_JS_NODE",
         name: "alfresco/renderers/Thumbnail",
         config: {
            currentItem: {
               jsNode: {
                  nodeRef: "dummy://nodeRef/1",
                  isContainer: true
               },
               type: "folder",
               displayName: "ITEM_JS_NODE",
               renditionName: "doclib"
            }
         }
      },
      {
         id: "ITEM_JS_NODE_NO_DISPLAYNAME",
         name: "alfresco/renderers/Thumbnail",
         config: {
            currentItem: {
               jsNode: {
                  nodeRef: "dummy://nodeRef/1",
                  properties: {
                     "cm:name": "ITEM_JS_NODE_NO_DISPLAYNAME"
                  }
               },
               type: "folder"
            }
         }
      },
      {
         id: "ITEM_NODE_REF_FOLDER",
         name: "alfresco/renderers/Thumbnail",
         config: {
            currentItem: {
               nodeRef: "dummy://nodeRef/1",
               displayName: "ITEM_NODE_REF_FOLDER",
               type: "folder"
            }
         }
      },
      {
         id: "ITEM_NODE_REF_DOCUMENT",
         name: "alfresco/renderers/Thumbnail",
         config: {
            currentItem: {
               nodeRef: "dummy://nodeRef/1",
               displayName: "ITEM_NODE_REF_DOCUMENT",
               type: "document"
            }
         }
      },
      {
         id: "ITEM_NODE_REF_OTHER",
         name: "alfresco/renderers/Thumbnail",
         config: {
            currentItem: {
               nodeRef: "dummy://nodeRef/1",
               displayName: "ITEM_NODE_REF_OTHER",
               type: "blog"
            }
         }
      },
      {
         id: "ITEM_NO_NODE",
         name: "alfresco/renderers/Thumbnail",
         config: {
            currentItem: {}
         }
      },
      {
         id: "ITEM_NO_CURRENT_ITEM",
         name: "alfresco/renderers/Thumbnail",
         config: {}
      },
      {
         id: "SMALL_ITEM_JS_NODE_1",
         name: "alfresco/renderers/SmallThumbnail",
         config: {
            currentItem: {
               jsNode: {
                  nodeRef: "dummy://nodeRef/1",
                  isContainer: false
               },
               node: {
                  properties: {
                     "cm:name": "SMALL_ITEM_JS_NODE_1"
                  }
               },
               type: "folder",
               displayName: "SMALL_ITEM_JS_NODE_1",
               renditionName: "doclib"
            }
         }
      },
      {
         id: "SMALL_ITEM_JS_NODE_2",
         name: "alfresco/renderers/SmallThumbnail",
         config: {
            currentItem: {
               jsNode: {
                  nodeRef: "dummy://nodeRef/1",
                  isContainer: true
               },
               type: "folder",
               displayName: "SMALL_ITEM_JS_NODE_2",
               renditionName: "doclib"
            }
         }
      },
      {
         id: "SMALL_ITEM_JS_NODE_3",
         name: "alfresco/renderers/SmallThumbnail",
         config: {
            currentItem: {
               jsNode: {
                  nodeRef: "dummy://nodeRef/1",
                  isContainer: false,
                  isLink: true,
                  linkedNode: {
                     isContainer: true
                  }
               },
               type: "folder",
               displayName: "SMALL_ITEM_JS_NODE_3",
               renditionName: "doclib"
            }
         }
      },
      {
         id: "SMALL_ITEM_JS_NODE_4",
         name: "alfresco/renderers/SmallThumbnail",
         config: {
            currentItem: {
               jsNode: {
                  nodeRef: "dummy://nodeRef/1",
                  isContainer: false,
                  isLink: false,
                  linkedNode: {
                     isContainer: false
                  }
               },
               node: {
                  properties: {
                     "cm:name": "SMALL_ITEM_JS_NODE_4"
                  }
               },
               type: "folder",
               displayName: "SMALL_ITEM_JS_NODE_4",
               renditionName: "doclib"
            }
         }
      },
      {
         id: "SMALL_ITEM_NODE_REF_DOCUMENT",
         name: "alfresco/renderers/SmallThumbnail",
         config: {
            currentItem: {
               nodeRef: "dummy://nodeRef/1",
               displayName: "SMALL_ITEM_NODE_REF_DOCUMENT",
               type: "document"
            }
         }
      },
      {
         name: "aikauTesting/ConsoleLog"
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};