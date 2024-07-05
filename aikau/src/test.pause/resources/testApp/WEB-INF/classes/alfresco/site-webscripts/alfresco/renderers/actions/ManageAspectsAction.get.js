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
      "alfresco/services/NotificationService",
      "alfresco/services/DialogService",
      {
         name: "alfresco/services/actions/ManageAspectsService",
         config: {
            availableAspects: ["cm:generalclassifiable",
                               "cm:complianceable",
                               "cm:effectivity",
                               "cm:summarizable",
                               "cm:versionable",
                               "cm:templatable",
                               "cm:emailed",
                               "emailserver:aliasable",
                               "app:inlineeditable",
                               "cm:geographic",
                               "exif:exif",
                               "audio:audio",
                               "cm:indexControl",
                               "dp:restrictable"]
         }
      }
   ],
   widgets:[
      {
         id: "LIST",
         name: "alfresco/lists/views/AlfListView",
         config: {
            currentData: {
               items: [
                  {
                     displayName: "Basic node",
                     nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                     node: {
                        aspects: [],
                        nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                        isLocked: false,
                        isContainer: false,
                        permissions: {
                           user: {
                              Write: true
                           }
                        },
                        properties: {}
                     }
                  },
                  {
                     displayName: "Working copy (user owned)",
                     nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                     node: {
                        aspects: ["cm:workingcopy"],
                        nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                        isLocked: false,
                        isContainer: false,
                        permissions: {
                           user: {
                              Write: true
                           }
                        },
                        properties: {
                           "cm:workingCopyOwner": {
                              userName: "guest"
                           }
                        }
                     }
                  },
                  {
                     displayName: "Locked (lock owner)",
                     nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                     node: {
                        aspects: [],
                        nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                        isLocked: true,
                        isContainer: false,
                        permissions: {
                           user: {
                              Write: true
                           }
                        },
                        properties: {
                           "cm:lockOwner": "guest"
                        }
                     }
                  },
                  {
                     displayName: "No write permission",
                     nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                     node: {
                        aspects: [],
                        nodeRef: "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                        isLocked: false,
                        isContainer: false
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
                                             name: "alfresco/renderers/actions/ManageAspects"
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
         name: "aikauTesting/mockservices/ManageAspectsMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};