/*jshint maxlen:1000*/
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
      }
   ],
   widgets:[
      {
         name: "alfresco/html/Heading",
         config: {
            label: "Default image",
            level: 3
         }
      },
      {
         name: "alfresco/renderers/PublishAction",
         id: "DEFAULT",
         config: {
            publishTopic: "PUBLISH_ACTION_DEFAULT"
         }
      },
      {
         name: "alfresco/html/Heading",
         config: {
            label: "Custom icon with payload",
            level: 3
         }
      },
      {
         name: "alfresco/renderers/PublishAction",
         id: "CUSTOM_WITH_PAYLOAD",
         config: {
            iconClass: "edit-16",
            publishTopic: "PUBLISH_ACTION_CUSTOM_WITH_PAYLOAD",
            publishPayload: {
               editMode: true
            }
         }
      },
      {
         name: "alfresco/html/Heading",
         config: {
            label: "Custom image URL",
            level: 3
         }
      },
      {
         name: "alfresco/renderers/PublishAction",
         id: "CUSTOM_IMAGE",
         config: {
            src: "images/app-logo-48.png",
            srcType: "CONTEXT_RELATIVE",
            publishTopic: "PUBLISH_ACTION_CUSTOM_IMAGE"
         }
      },
      {
         name: "alfresco/lists/views/AlfListView",
         config: {
            currentData: {
               items: [
                  {
                     displayName: "Moomin"
                  },
                  {
                     displayName: "Giants"
                  }
               ]
            },
            widgets: [
               {
                  id: "ROW",
                  name: "alfresco/lists/views/layouts/Row",
                  config: {
                     widgets: [
                        {
                           id: "PROP_CELL",
                           name: "alfresco/lists/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    id: "PROPERTY",
                                    name: "alfresco/renderers/Property",
                                    config: {
                                       propertyToRender: "displayName",
                                       onlyShowOnHover: false
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           id: "ACTION_CELL",
                           name: "alfresco/lists/views/layouts/Cell",
                           config: {
                              widgets: [
                                 {
                                    id: "PUBLISH_ACTION",
                                    name: "alfresco/renderers/PublishAction",
                                    config: {
                                       onlyShowOnHover: true,
                                       publishTopic: "PUBLISH_ACTION_FOR_HOVER"
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
         name: "alfresco/logging/DebugLog"
      }
   ]
};