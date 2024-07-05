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
         id: "CATEGORY_1",
         name: "alfresco/renderers/Category"
      },
      {
         id: "CATEGORY_2",
         name: "alfresco/renderers/Category",
         config: {}
      },
      {
         id: "CATEGORY_3",
         name: "alfresco/renderers/Category",
         config: {
            currentItem: {}
         }
      },
      {
         id: "CATEGORY_4",
         name: "alfresco/renderers/Category",
         config: {
            currentItem: {
               node: {
                  nodeRef: "workspace://SpacesStore/d91128af-3b99-4710-95b6-a858eb090418",
                  name: "Languages",
                  properties: {}
               }
            }
         }
      },
      {
         id: "CATEGORY_5",
         name: "alfresco/renderers/Category",
         config: {
            currentItem: {
               node: {
                  nodeRef: "workspace://SpacesStore/d91128af-3b99-4710-95b6-a858eb090418",
                  name: "Languages",
                  properties: {
                     "cm:categories": []
                  }
               }
            }
         }
      },
      {
         id: "CATEGORY_6",
         name: "alfresco/renderers/Category",
         config: {
            currentItem: {
               node: {
                  nodeRef: "workspace://SpacesStore/d91128af-3b99-4710-95b6-a858eb090418",
                  name: "Languages",
                  properties: {
                     "cm:categories": [
                        {
                           nodeRef: "workspace://SpacesStore/284d485c-9cb7-42cb-8e3d-fed80de17f25",
                           name: "English",
                           path: "english"
                        },
                        {
                           nodeRef: "workspace://SpacesStore/d550426d-c70e-418f-a034-3668d704b9d6",
                           name: "French",
                           path: "french"
                        },
                        {
                           nodeRef: "workspace://SpacesStore/77ef6308-e6a9-433a-848c-6f70958b0534",
                           name: "German",
                           path: "german"
                        },
                        {
                           nodeRef: "workspace://SpacesStore/aae8bca4-1ee4-4347-bb13-4af89aa6d3f2",
                           name: "Spanish",
                           path: "spanish"
                        }
                     ]
                  }
               }
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