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
         name: "alfresco/logging/SubscriptionLog"
      }
   ]
};