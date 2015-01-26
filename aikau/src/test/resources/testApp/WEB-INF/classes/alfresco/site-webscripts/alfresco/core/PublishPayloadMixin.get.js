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
   widgets: [
      {
         name: "alfresco/layout/VerticalWidgets",
         config: {
            widgets: [
               {
                  id: "PA_NO_TYPE",
                  name: "alfresco/renderers/PublishAction",
                  config: {
                     publishTopic: "TOPIC1",
                     publishPayload: {
                        data1: "value1"
                     }
                  }
               },
               {
                  id: "PA_CONFIGURED",
                  name: "alfresco/renderers/PublishAction",
                  config: {
                     currentItem: {
                        mixinData1: "mixinValue1"
                     },
                     publishTopic: "TOPIC2",
                     publishPayloadType: "CONFIGURED",
                     publishPayload: {
                        data2: "value2"
                     }
                  }
               },
               {
                  id: "PA_CONFIGURED_WITH_ITEM_MIXIN",
                  name: "alfresco/renderers/PublishAction",
                  config: {
                     currentItem: {
                        mixinData2: "mixinValue2"
                     },
                     publishTopic: "TOPIC3",
                     publishPayloadType: "CONFIGURED",
                     publishPayloadItemMixin: true,
                     publishPayload: {
                        data3: "value3"
                     }
                  }
               },
               {
                  id: "PA_CURRENT_ITEM",
                  name: "alfresco/renderers/PublishAction",
                  config: {
                     currentItem: {
                        mixinData3: "mixinValue3"
                     },
                     publishTopic: "TOPIC4",
                     publishPayloadType: "CURRENT_ITEM",
                     publishPayload: {
                        data4: "value4"
                     }
                  }
               },
               {
                  id: "PA_PROCESS",
                  name: "alfresco/renderers/PublishAction",
                  config: {
                     currentItem: {
                        mixinData4: "mixinValue4"
                     },
                     publishTopic: "TOPIC5",
                     publishPayloadType: "PROCESS",
                     publishPayloadModifiers: ["processCurrentItemTokens","replaceColons",null,"junk"],
                     publishPayload: {
                        data5: "prefix:{mixinData4}:postfix"
                     }
                  }
               },
               {
                  id: "PA_BUILD",
                  name: "alfresco/renderers/PublishAction",
                  config: {
                     currentItem: {
                        mixinData5: "mixinValue5"
                     },
                     publishTopic: "TOPIC6",
                     publishPayloadType: "BUILD",
                     publishPayload: {
                        itemData: {
                           alfType: "item",
                           alfProperty: "mixinData5"
                        }
                     }
                  }
               },
               {
                  id: "PROPERTYLINK",
                  name: "alfresco/renderers/PropertyLink",
                  config: {
                     currentItem: {
                        site: {
                           title: "A Site",
                           shortName: "abcdefg"
                        }
                     },
                     propertyToRender: "site.title",
                     publishTopic: "PROPERTY_LINK",
                     useCurrentItemAsPayload: false,
                     publishPayloadType: "PROCESS",
                     publishPayloadModifiers: ["processCurrentItemTokens"],
                     publishPayload: {
                        url: "site/{site.shortName}/dashboard",
                        type: "SHARE_PAGE_RELATIVE"
                     }
                  }
               },
               {
                  id: "DATELINK",
                  name: "alfresco/renderers/DateLink",
                  config: {
                     currentItem: {
                        modifiedOn: "2000-04-11T12:42:02+00:00",
                        modifiedBy: "Brian Griffin",
                        modifiedByUser: "bgriffin"
                     },
                     modifiedDateProperty: "modifiedOn",
                     modifiedByProperty: "modifiedBy",
                     publishTopic: "DATE_LINK",
                     useCurrentItemAsPayload: false,
                     publishPayloadType: "PROCESS",
                     publishPayloadModifiers: ["processCurrentItemTokens"],
                     publishPayload: {
                        url: "user/{modifiedByUser}/profile",
                        type: "SHARE_PAGE_RELATIVE"
                     }
                  }
               }
            ]
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