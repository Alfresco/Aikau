<import resource="classpath:alfresco/site-webscripts/imports/sandpit.lib.js">

buildPageModel({
   title: "page.title",
   description: "page.description",
   jsdoc: "https://dev.alfresco.com/resource/docs/aikau-jsdoc/SelectedListItems.html",
   services: ["alfresco/services/DocumentService"],
   mockXhrWidgets: [
      {
         name: "alfresco/testing/NodesMockXhr"
      }
   ],
   examples: [
      {
         title: "example1.title",
         description: "example1.description",
         model: [
            {
               name: "alfresco/forms/Form",
               config: {
                  pubSubScope: "FORM",
                  okButtonPublishTopic: "SAVE",
                  value: {
                     selectedItems: [
                        {
                           nodeRef: "workspace://SpacesStore/d040aa05-ad54-495f-bf4e-3266b96391e9"
                        }
                     ]
                  },
                  widgets: [
                     {
                        name: "alfresco/forms/controls/SelectedListItems",
                        config: {
                           fieldId: "LIST",
                           label: "Select items",
                           description: "This form control has a value that is the array of the items selected in the rendered list",
                           name: "selectedItems",
                           widgetsForList: [
                              {
                                 name: "alfresco/lists/AlfList",
                                 config: {
                                    itemKeyProperty: "nodeRef",
                                    widgets: [
                                       {
                                          name: "alfresco/lists/views/AlfListView",
                                          config: {
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
                                                                     name: "alfresco/renderers/Selector",
                                                                     config: {
                                                                        itemKeyProperty: "nodeRef"
                                                                     }
                                                                  }
                                                               ]
                                                            }
                                                         },
                                                         {
                                                            name: "alfresco/lists/views/layouts/Cell",
                                                            config: {
                                                               widgets: [
                                                                  {
                                                                     id: "PROPERTY",
                                                                     name: "alfresco/renderers/Property",
                                                                     config: {
                                                                        propertyToRender: "displayName"
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
   ]
});