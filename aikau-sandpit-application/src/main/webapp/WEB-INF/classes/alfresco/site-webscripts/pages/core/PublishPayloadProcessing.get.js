<import resource="classpath:alfresco/site-webscripts/imports/sandpit.lib.js">

buildPageModel({
   title: "page.title",
   description: "page.description",
   jsdoc: "http://dev.alfresco.com/resource/docs/aikau-jsdoc/CoreWidgetProcessing.html",
   examples: [
      {
         title: "example1.title",
         description: "example1.description",
         model: [
            {
               name: "alfresco/buttons/AlfButton",
               config: {
                  label: "Simple Publish",
                  publishTopic: "EXAMPLE_TOPIC_1",
                  publishPayload: {
                     some: "data"
                  }
               }
            }
         ]
      },
      {
         title: "example2.title",
         description: "example2.description",
         model: [
            {
               name: "alfresco/buttons/AlfButton",
               config: {
                  label: "Scoped Publish",
                  pubSubScope: "SCOPE_1_",
                  publishTopic: "EXAMPLE_TOPIC_2",
                  publishPayload: {
                     different: "data"
                  }
               }
            }
         ]
      },
      {
         title: "example3.title",
         description: "example3.description",
         model: [
            {
               name: "alfresco/buttons/AlfButton",
               config: {
                  label: "Global Publish",
                  pubSubScope: "SCOPE_1_",
                  publishTopic: "EXAMPLE_TOPIC_3",
                  publishPayload: {
                     alternative: "data"
                  },
                  publishGlobal: true
               }
            }
         ]
      },
      {
         title: "example4.title",
         description: "example4.description",
         model: [
            {
               name: "alfresco/layout/VerticalWidgets",
               config: {
                  pubSubScope: "PARENT_SCOPE_",
                  widgets: [
                     {
                        name: "alfresco/buttons/AlfButton",
                        config: {
                           label: "Parent Publish",
                           pubSubScope: "SCOPE_1_",
                           publishTopic: "EXAMPLE_TOPIC_4",
                           publishPayload: {
                              more: "data"
                           },
                           publishToParent: true
                        }
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "example5.title",
         description: "example5.description",
         model: [
            {
               name: "alfresco/buttons/AlfButton",
               config: {
                  label: "Current Item Payload",
                  currentItem: {
                     key1: "value1",
                     key2: "value2"
                  },
                  publishTopic: "EXAMPLE_TOPIC_5",
                  publishPayloadType: "CURRENT_ITEM"
               }
            }
         ]
      },
      {
         title: "example6.title",
         description: "example6.description",
         model: [
            {
               name: "alfresco/lists/views/AlfListView",
               config: {
                  currentData: {
                     items: [
                        {
                           label: "One",
                           value: "1"
                        },
                        {
                           label: "Two",
                           value: "2"
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
                                          name: "alfresco/renderers/PropertyLink",
                                          config: {
                                             propertyToRender: "label",
                                             publishTopic: "PROPERTY_LINK_TOPIC_1"
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
            }
         ]
      },
      {
         title: "example7.title",
         description: "example7.description",
         model: [
            {
               name: "alfresco/buttons/AlfButton",
               config: {
                  label: "Processed Payload",
                  currentItem: {
                     label: "One",
                     nested: {
                        value: "1"
                     }
                  },
                  publishTopic: "EXAMPLE_TOPIC_7",
                  publishPayloadType: "PROCESS",
                  publishPayloadModifiers: ["processCurrentItemTokens"],
                  publishPayload: {
                     processedValue: "Value_is_{nested.value}"
                  }
               }
            }
         ]
      },
      {
         title: "example8.title",
         description: "example8.description",
         model: [
            {
               name: "alfresco/buttons/AlfButton",
               config: {
                  label: "Nested Current Item",
                  currentItem: {
                     label: "One",
                     nested: {
                        value: "1"
                     }
                  },
                  publishTopic: "EXAMPLE_TOPIC_8",
                  publishPayloadType: "PROCESS",
                  publishPayloadModifiers: ["setCurrentItem"],
                  publishPayload: {
                     nest: {
                        the: {
                           currentItem: "___AlfCurrentItem"
                        }
                     }
                  }
               }
            }
         ]
      },
      {
         title: "example9.title",
         description: "example9.description",
         model: [
            {
               name: "alfresco/buttons/AlfButton",
               config: {
                  label: "Current Item Mixed In",
                  currentItem: {
                     label: "One",
                     nested: {
                        value: "1"
                     }
                  },
                  publishTopic: "EXAMPLE_TOPIC_9",
                  publishPayloadType: "CONFIGURED",
                  publishPayloadItemMixin: true,
                  publishPayload: {
                     extra: "data"
                  }
               }
            }
         ]
      }
   ]
});
