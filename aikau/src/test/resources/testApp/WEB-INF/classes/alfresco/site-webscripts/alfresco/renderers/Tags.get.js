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
      "alfresco/services/TagService",
      "alfresco/services/CrudService",
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         id: "TAGS_1",
         name: "alfresco/renderers/Tags",
         config: {
            permissionProperty: null
         }
      },
      {
         id: "TAGS_2",
         name: "alfresco/renderers/Tags",
         config: {
            propertyToRender: "node.properties.cm:taggable",
            permissionProperty: null
         }
      },
      {
         id: "TAGS_3",
         name: "alfresco/renderers/Tags",
         config: {
            propertyToRender: "node.properties.cm:taggable",
            currentItem: {
               node: {
                  nodeRef: "workspace://SpacesStore/d91128af-3b99-4710-95b6-a858eb090418",
                  name: "TAGS_3",
                  properties: {
                     "cm:taggable": {}
                  },
                  permissions: {
                     user: {
                        Write: true
                     }
                  }
               }
            }
         }
      },
      {
         id: "TAGS_4",
         name: "alfresco/renderers/Tags",
         config: {
            propertyToRender: "node.properties.cm:taggable",
            currentItem: {
               node: {
                  nodeRef: "workspace://SpacesStore/d91128af-3b99-4710-95b6-a858eb090418",
                  name: "TAGS_4",
                  properties: {
                     "cm:taggable": [
                        {
                           nodeRef: "workspace://SpacesStore/284d485c-9cb7-42cb-8e3d-fed80de17f25",
                           name: "Test1"
                        },
                        {
                           nodeRef: "workspace://SpacesStore/d550426d-c70e-418f-a034-3668d704b9d6",
                           name: "Test2"
                        },
                        {
                           nodeRef: "workspace://SpacesStore/77ef6308-e6a9-433a-848c-6f70958b0534",
                           name: "Test3"
                        }
                     ]
                  },
                  permissions: {
                     user: {
                        Write: true
                     }
                  }
               }
            }
         }
      },
      {
         name: "aikauTesting/mockservices/TaggingMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};