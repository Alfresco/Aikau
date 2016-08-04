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
      "alfresco/services/NavigationService"
   ],
   widgets: [
      {
         id: "DYNAMIC_BUTTON",
         name: "alfresco/buttons/AlfDynamicPayloadButton",
         config: {
            label: "Dynamic Button",
            publishTopic: "DYNAMIC_BUTTON_TOPIC",
            publishPayload: {
               value: "Original Value"
            },
            publishPayloadSubscriptions: [
               {
                  topic: "MIXIN_COMPLETE_PAYLOAD"
               },
               {
                  topic: "MAP_SELECTED_DATA_WITH_OVERRIDES",
                  dataMapping: {
                     updatedValue: "value",
                     additional: "additional.data"
                  }
               },
               {
                  topic: "MAP_SELECTED_DATA_NO_OVERRIDES",
                  dataMapping: {
                     additional: "additional.data"
                  }
               },
               {
                  topic: "SCOPED_OVERRIDE",
                  subscribeGlobal: false,
                  subscribeParent: false,
                  subscribeScope: "CUSTOM_SCOPE",
                  dataMapping: {
                     additional: "additional.data"
                  }
               }
            ],
            useHash: true,
            hashDataMapping: {
               hashValue: "value",
               additionalHash: "additional.hash"
            }
         }
      },
      {
         id: "DYNAMIC_BUTTON_2",
         name: "alfresco/buttons/AlfDynamicPayloadButton",
         config: {
            label: "Dynamic Button 2",
            publishTopic: "DYNAMIC_BUTTON_TOPIC_2",
            publishPayload: {
               value: "Another Value"
            },
            useHash: true
         }
      },
      {
         id: "FULL_OVERRIDE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Override payload",
            publishTopic: "MIXIN_COMPLETE_PAYLOAD",
            publishPayload: {
               value: "Override 1"
            }
         }
      },
      {
         id: "MIXIN_WITH_OVERRIDES",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Mixin With Overrides",
            publishTopic: "MAP_SELECTED_DATA_WITH_OVERRIDES",
            publishPayload: {
               updatedValue: "Override 2",
               additional: "extra data"
            }
         }
      },
      {
         id: "MIXIN_NO_OVERRIDES",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Mixin Without Overrides",
            publishTopic: "MAP_SELECTED_DATA_NO_OVERRIDES",
            publishPayload: {
               additional: "bonus data"
            }
         }
      },
      {
         id: "HASH_OVERRIDE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Update URL hash",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            publishPayload: {
               url: "hashValue=Override3",
               type: "HASH"
            }
         }
      },
      {
         id: "HASH_OVERRIDE_EXTRA",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Update URL hash",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            publishPayload: {
               url: "hashValue=Override3&additionalHash=hashData",
               type: "HASH"
            }
         }
      },
      {
         id: "GROUP",
         name: "alfresco/layout/ClassicWindow",
         config: {
            title: "Scope handling",
            pubSubScope: "PARENT_SCOPE_",
            widgets: [
               {
                  id: "DYNAMIC_BUTTON_3",
                  name: "alfresco/buttons/AlfDynamicPayloadButton",
                  config: {
                     label: "Dynamic Button 3",
                     publishTopic: "DYNAMIC_BUTTON_TOPIC_3",
                     publishPayload: {},
                     pubSubScope: "SCOPE_",
                     publishPayloadSubscriptions: [
                        {
                           topic: "SCOPED_DATA",
                           subscribeGlobal: true,
                           dataMapping: {
                              value: "data.global"
                           }
                        },
                        {
                           topic: "SCOPED_DATA",
                           subscribeParent: true,
                           dataMapping: {
                              value: "data.parent"
                           }
                        },
                        {
                           topic: "SCOPED_DATA",
                           subscribeScope: "CUSTOM_",
                           dataMapping: {
                              value: "data.custom"
                           }
                        },
                        {
                           topic: "SCOPED_DATA",
                           dataMapping: {
                              value: "data.default"
                           }
                        }
                     ]
                  }
               },
               {
                  id: "GLOBAL_DATA",
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: "Global Scope Data",
                     publishTopic: "SCOPED_DATA",
                     publishGlobal: true,
                     publishPayload: {
                        value: "global"
                     }
                  }
               },
               {
                  id: "PARENT_SCOPE_DATA",
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     pubSubScope: "PARENT_SCOPE_",
                     label: "Parent Scope Data",
                     publishTopic: "SCOPED_DATA",
                     publishPayload: {
                        value: "parent"
                     }
                  }
               },
               {
                  id: "CUSTOM_SCOPE_DATA",
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     pubSubScope: "CUSTOM_",
                     label: "Custom Scope Data",
                     publishTopic: "SCOPED_DATA",
                     publishPayload: {
                        value: "custom"
                     }
                  }
               },
               {
                  id: "DEFAULT_SCOPE_DATA",
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     pubSubScope: "SCOPE_",
                     label: "Default Scope Data",
                     publishTopic: "SCOPED_DATA",
                     publishPayload: {
                        value: "default"
                     }
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/layout/ClassicWindow",
         config: {
            pubSubScope: "NON_TRUTHY_",
            title: "Non-truthy values",
            widgets: [
               {
                  id: "DYNAMIC_WITH_NON_TRUTHY",
                  name: "alfresco/buttons/AlfDynamicPayloadButton",
                  config: {
                     label: "Execute",
                     publishTopic: "EXECUTE_JS",
                     publishPayload: {},
                     publishPayloadSubscriptions: [ 
                        {
                           topic: "UPDATE_JS_SOURCE",
                           dataMapping: {
                              content: "javaScriptSource",
                              selectedContent: "selectedJavaScriptSource"
                           }
                        }
                     ]
                  }
               }, 
               {
                  id: "SET_TRUTHY",
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: "setSource (with selected code)",
                     publishTopic: "UPDATE_JS_SOURCE",
                     publishPayload: {
                        content: "print(10);",
                        selectedContent: "print(10);"
                     }
                  }
               },
               {
                  id: "SET_NON_TRUTHY",
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: "removeCodeSelection",
                     publishTopic: "UPDATE_JS_SOURCE",
                     publishPayload : {
                        content: "print(10);",
                        selectedContent: null
                     }
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