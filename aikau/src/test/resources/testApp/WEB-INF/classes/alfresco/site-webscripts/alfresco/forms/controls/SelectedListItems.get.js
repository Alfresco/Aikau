/* global page */
/* jshint sub:true */
var publishOnPageLoad = false;
if (page.url.args["publishOnPageLoad"])
{
   publishOnPageLoad = page.url.args["publishOnPageLoad"] === "true";
}

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
      "alfresco/services/DocumentService"
   ],
   widgets: [
      {
         id: "BUTTON",
         name: "alfresco/buttons/AlfButton",
         config: {
            pubSubScope: "FORM",
            label: "Select items",
            publishTopic: "SELECT_ITEMS",
            publishPayload: {
               selectedItems: [
                  {
                     nodeRef: "workspace://SpacesStore/d040aa05-ad54-495f-bf4e-3266b96391e9"
                  },
                  {
                     nodeRef: "workspace://SpacesStore/a8d2eb8b-dba3-438b-b24b-69a25be698ba"
                  }
               ]
            }
         }
      },
      {
         id: "FORM",
         name: "alfresco/forms/Form",
         config: {
            pubSubScope: "FORM",
            okButtonPublishTopic: "SAVE",
            setValueTopic: "SELECT_ITEMS",
            setValueTopicGlobalScope: false,
            value: {
               selectedItems: [
                  {
                     nodeRef: "workspace://SpacesStore/d040aa05-ad54-495f-bf4e-3266b96391e9"
                  }
               ]
            },
            widgets: [
               {
                  id: "SELECTED_LIST_ITEMS",
                  name: "alfresco/forms/controls/SelectedListItems",
                  config: {
                     fieldId: "LIST",
                     label: "Select items",
                     description: "This form control has a value that is the array of the items selected in the rendered list",
                     name: "selectedItems",
                     widgetsForList: [
                        {
                           id: "LIST",
                           name: "alfresco/lists/AlfList",
                           config: {
                              itemKeyProperty: "nodeRef",
                              widgets: [
                                 {
                                    id: "VIEW",
                                    name: "alfresco/lists/views/AlfListView",
                                    config: {
                                       widgets: [
                                          {
                                             id: "ROW",
                                             name: "alfresco/lists/views/layouts/Row",
                                             config: {
                                                widgets: [
                                                   {
                                                      id: "CELL",
                                                      name: "alfresco/lists/views/layouts/Cell",
                                                      config: {
                                                         widgets: [
                                                            {
                                                               id: "SELECTOR",
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
      },
      {
         name: "alfresco/testing/NodesMockXhr",
         config: {
            totalItems: 10,
            folderRatio: [100]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};

if (publishOnPageLoad) {
   model.jsonModel.publishOnReady = [
      {
         publishTopic: "FORMSELECT_ITEMS",
         publishPayload: {
            selectedItems: [
               {
                  nodeRef: "workspace://SpacesStore/d040aa05-ad54-495f-bf4e-3266b96391e9"
               },
               {
                  nodeRef: "workspace://SpacesStore/0ca6baf8-599b-4b72-9e22-6e761fac54cb"
               }
            ]
         }
      }
   ];
}