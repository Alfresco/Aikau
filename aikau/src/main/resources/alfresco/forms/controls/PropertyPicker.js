/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * <p>Extends the standard [picker form control]{@link module:alfresco/forms/controls/Picker} to allow the user to select 
 * properties defined in the Alfresco model. It allows the user to select from all defined properties or to scope properties
 * by specific aspects or types.</p>
 *
 * @module alfresco/forms/controls/PropertyPicker
 * @extends module:alfresco/forms/controls/Picker
 * @author Dave Draper
 */
define(["alfresco/forms/controls/Picker",
        "dojo/_base/declare"], 
        function(PropertyPicker, declare) {
   
   return declare([PropertyPicker], {
      
      /**
       * This should be overridden to define the widget model for rendering the picked items.
       *
       * @instance
       * @type {object}
       * @default []
       */
      configForPickedItems: {
         itemKey: "name",
         widgets: [
            {
               name: "alfresco/documentlibrary/views/layouts/Row",
               config: {
                  widgets: [
                     {
                        name: "alfresco/documentlibrary/views/layouts/Cell",
                        config: {
                           widgets: [
                              {
                                 name: "alfresco/renderers/Property",
                                 config: {
                                    propertyToRender: "name"
                                 }
                              },
                              {
                                 name: "alfresco/renderers/Property",
                                 config: {
                                    propertyToRender: "title",
                                    renderedValuePrefix: "(",
                                    renderedValueSuffix: ")",
                                    renderSize: "small"
                                 }
                              }
                           ]
                        }
                     },
                     {
                        name: "alfresco/documentlibrary/views/layouts/Cell",
                        config: {
                           width: "20px",
                           widgets: [
                              {
                                 name: "alfresco/renderers/PublishAction",
                                 config: {
                                    iconClass: "delete-16",
                                    publishTopic: "ALF_ITEM_REMOVED",
                                    publishPayloadType: "CURRENT_ITEM"
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

      /**
       * This should be overridden to define the widget model for rendering the picker that appears within the 
       * dialog.
       *
       * @instance
       * @type {object}
       * @default []
       */
      configForPicker: {
         generatePubSubScope: true,
         widgetsForPickedItems: [
            {
               name: "alfresco/pickers/PickedItems",
               assignTo: "pickedItemsWidget",
               config: {
                  itemKey: "name",
                  widgets: [
                     {
                        name: "alfresco/documentlibrary/views/layouts/Row",
                        config: {
                           widgets: [
                              {
                                 name: "alfresco/documentlibrary/views/layouts/Cell",
                                 config: {
                                    widgets: [
                                       {
                                          name: "alfresco/renderers/Property",
                                          config: {
                                             propertyToRender: "name"
                                          }
                                       },
                                       {
                                          name: "alfresco/renderers/Property",
                                          config: {
                                             propertyToRender: "title",
                                             renderedValuePrefix: "(",
                                             renderedValueSuffix: ")",
                                             renderSize: "small"
                                          }
                                       }
                                    ]
                                 }
                              },
                              {
                                 name: "alfresco/documentlibrary/views/layouts/Cell",
                                 config: {
                                    width: "20px",
                                    widgets: [
                                       {
                                          name: "alfresco/renderers/PublishAction",
                                          config: {
                                             iconClass: "delete-16",
                                             publishTopic: "ALF_ITEM_REMOVED",
                                             publishPayloadType: "CURRENT_ITEM"
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
         ],
         widgetsForRootPicker: [
            {
               name: "alfresco/menus/AlfVerticalMenuBar",
               config: {
                  widgets: [
                     {
                        name: "alfresco/menus/AlfMenuBarItem",
                        config: {
                           label: "All",
                           publishTopic: "ALF_ADD_PICKER",
                           publishPayload: {
                              currentPickerDepth: 0,
                              picker: [
                                 {
                                    name: "alfresco/pickers/PropertyPicker",
                                    config: {
                                       itemsProperty: null,
                                       loadDataPublishTopic: "ALF_CRUD_GET_ALL",
                                       loadDataPublishPayload: {
                                          url: "api/properties"
                                       },
                                       publishPickedItemsToParent: false
                                    }
                                 }
                              ]
                           }
                        }
                     },
                     {
                        name: "alfresco/menus/AlfMenuBarItem",
                        config: {
                           label: "Aspects",
                           publishTopic: "ALF_ADD_PICKER",
                           publishPayload: {
                              currentPickerDepth: 0,
                              picker: [
                                 {
                                    name: "alfresco/pickers/PropertyPicker",
                                    config: {
                                       generatePubSubScope: true,
                                       itemsProperty: null,
                                       loadDataPublishTopic: "ALF_CRUD_GET_ALL",
                                       loadDataPublishPayload: {
                                          url: "api/classes?cf=aspect"
                                       },
                                       widgets: [
                                          {
                                             name: "alfresco/documentlibrary/views/AlfDocumentListView",
                                             config: {
                                                widgets: [
                                                   {
                                                      name: "alfresco/documentlibrary/views/layouts/Row",
                                                      config: {
                                                         widgets: [
                                                            {
                                                               name: "alfresco/documentlibrary/views/layouts/Cell",
                                                               config: {
                                                                  widgets: [
                                                                     {
                                                                        name: "alfresco/renderers/PropertyLink",
                                                                        config: {
                                                                           propertyToRender: "title",
                                                                           useCurrentItemAsPayload: false,
                                                                           publishTopic: "ALF_ADD_PICKER",
                                                                           publishPayload: {
                                                                              currentPickerDepth: 1,
                                                                              picker: [
                                                                                 {
                                                                                    name: "alfresco/pickers/PropertyPicker",
                                                                                    config: {
                                                                                       generatePubSubScope: true,
                                                                                       itemsProperty: null,
                                                                                       loadDataPublishTopic: "ALF_CRUD_GET_ALL",
                                                                                       loadDataPublishPayload: {
                                                                                          url: "api/classes/{name}/properties"
                                                                                       },
                                                                                       publishPickedItemsToParent: true
                                                                                    }
                                                                                 }
                                                                              ]
                                                                           },
                                                                           publishToParent: true
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
                     },
                     {
                        name: "alfresco/menus/AlfMenuBarItem",
                        config: {
                           label: "Types",
                           publishTopic: "ALF_ADD_PICKER",
                           publishPayload: {
                              currentPickerDepth: 0,
                              picker: [
                                 {
                                    name: "alfresco/pickers/PropertyPicker",
                                    config: {
                                       generatePubSubScope: true,
                                       itemsProperty: null,
                                       loadDataPublishTopic: "ALF_CRUD_GET_ALL",
                                       loadDataPublishPayload: {
                                          url: "api/classes?cf=type"
                                       },
                                       widgets: [
                                          {
                                             name: "alfresco/documentlibrary/views/AlfDocumentListView",
                                             config: {
                                                widgets: [
                                                   {
                                                      name: "alfresco/documentlibrary/views/layouts/Row",
                                                      config: {
                                                         widgets: [
                                                            {
                                                               name: "alfresco/documentlibrary/views/layouts/Cell",
                                                               config: {
                                                                  widgets: [
                                                                     {
                                                                        name: "alfresco/renderers/PropertyLink",
                                                                        config: {
                                                                           propertyToRender: "title",
                                                                           useCurrentItemAsPayload: false,
                                                                           publishTopic: "ALF_ADD_PICKER",
                                                                           publishPayload: {
                                                                              currentPickerDepth: 1,
                                                                              picker: [
                                                                                 {
                                                                                    name: "alfresco/pickers/PropertyPicker",
                                                                                    config: {
                                                                                       generatePubSubScope: true,
                                                                                       itemsProperty: null,
                                                                                       loadDataPublishTopic: "ALF_CRUD_GET_ALL",
                                                                                       loadDataPublishPayload: {
                                                                                          url: "api/classes/{name}/properties"
                                                                                       },
                                                                                       publishPickedItemsToParent: true
                                                                                    }
                                                                                 }
                                                                              ]
                                                                           },
                                                                           publishToParent: true
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
                     }
                  ]
               }
            }
         ]
      }
   });
});