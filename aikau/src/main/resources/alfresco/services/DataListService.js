/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
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
 * @module alfresco/services/DataListService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 * @since 1.0.85
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/core/NodeUtils",
        "alfresco/core/topics",
        "dojo/_base/array",
        "dojo/_base/lang",
        "service/constants/Default",
        "jquery",
        // No call backs from here...
        "alfresco/layout/TitleDescriptionAndContent",
        "alfresco/lists/AlfList",
        "alfresco/lists/views/AlfListView",
        "alfresco/lists/views/layouts/Row",
        "alfresco/lists/views/layouts/Cell",
        "alfresco/lists/views/layouts/HeaderCell",
        "alfresco/renderers/Date",
        "alfresco/renderers/Property"],
        function(declare, BaseService, CoreXhr, NodeUtils, topics, array, lang, AlfConstants, $) {
   
   return declare([BaseService, CoreXhr], {
      
      /**
       * An array of the i18n files to use with this service.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/DataListService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/DataListService.properties"}],

      /**
       * 
       * @instance
       * @type {object}
       * @default
       */
      defaultDataTypeMappings: {
         "datetime": {
            name: "alfresco/renderers/Date",
            config: {
               simple: true
            }
         },
         "date": {
            name: "alfresco/renderers/Date",
            config: {
               simple: true
            }
         }
      },

      /**
       * 
       * @instance
       * @type {object}
       * @default
       */
      defaultDataNameMappings: {
         "dl:attachments": {
            name: "alfresco/lists/AlfList",
            config: {
               style: {
                  overflow: "hidden"
               },
               waitForPageWidgets: false,
               noDataMessage: " ",
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
                                          width: "50px",
                                          widgets: [
                                             {
                                                name: "alfresco/renderers/SmallThumbnail",
                                                config: {
                                                   itemKey: "value",
                                                   assumeRendition: true,
                                                   showDocumentPreview: true,
                                                   usePreviewService: true
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
                                                name: "alfresco/renderers/Property",
                                                config: {
                                                   propertyToRender: "displayValue"
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
         "cm:attachments": {
            name: "alfresco/lists/AlfList",
            config: {
               style: {
                  overflow: "hidden"
               },
               waitForPageWidgets: false,
               noDataMessage: " ",
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
                                          width: "50px",
                                          widgets: [
                                             {
                                                name: "alfresco/renderers/SmallThumbnail",
                                                config: {
                                                   itemKey: "value",
                                                   assumeRendition: true,
                                                   showDocumentPreview: true,
                                                   usePreviewService: true
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
                                                name: "alfresco/renderers/Property",
                                                config: {
                                                   propertyToRender: "displayValue"
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
         "dl:issueAssignedTo": {
            name: "alfresco/lists/AlfList",
            config: {
               style: {
                  overflow: "hidden"
               },
               waitForPageWidgets: false,
               noDataMessage: " ",
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
                                          width: "40px",
                                          widgets: [
                                             {
                                                name: "alfresco/renderers/AvatarThumbnail",
                                                config: {
                                                   userNameProperty: "metadata",
                                                   dimensions: {
                                                      w: "32px",
                                                      h: "32px",
                                                      margins: "5px"
                                                   }
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
                                                name: "alfresco/renderers/Property",
                                                config: {
                                                   propertyToRender: "displayValue"
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

      /**
       * Sets up the subscriptions for the LoginService
       * 
       * @instance
       * @listens module:alfresco/core/topics#DELETE_DATA_LIST
       * @listens module:alfresco/core/topics#DELETE_DATA_LIST_CONFIRMATION
       * @listens module:alfresco/core/topics#DELETE_DATA_LIST_ITEMS
       * @listens module:alfresco/core/topics#DELETE_DATA_LIST_ITEMS_CONFIRMATION
       * @listens module:alfresco/core/topics#GET_DATA_LISTS
       * @listens module:alfresco/core/topics#GET_DATA_LIST_ITEMS
       * @listens module:alfresco/core/topics#GET_DATA_LIST_WIDGETS
       * @listens module:alfresco/core/topics#UPDATE_DATA_LIST
       */
      registerSubscriptions: function alfresco_services_DataListService__registerSubscriptions() {
         this.alfSubscribe(topics.DELETE_DATA_LIST, lang.hitch(this, this.onDeleteDataListRequest));
         this.alfSubscribe(topics.DELETE_DATA_LIST_CONFIRMATION, lang.hitch(this, this.onDeleteDataListConfirmation));
         this.alfSubscribe(topics.DELETE_DATA_LIST_ITEMS, lang.hitch(this, this.onDeleteDataListItemsRequest));
         this.alfSubscribe(topics.DELETE_DATA_LIST_ITEMS_CONFIRMATION, lang.hitch(this, this.onDeleteDataListItemsConfirmation));
         this.alfSubscribe(topics.GET_DATA_LISTS, lang.hitch(this, this.getDataLists));
         this.alfSubscribe(topics.GET_DATA_LIST_ITEMS, lang.hitch(this, this.getDataListItems));
         this.alfSubscribe(topics.GET_DATA_LIST_WIDGETS, lang.hitch(this, this.getDataListWidgets));
         this.alfSubscribe(topics.UPDATE_DATA_LIST, lang.hitch(this, this.updateDataList));
      },

      /**
       * Handles requests to retrieve Data Lists for the supplied site.
       * 
       * @instance
       * @param  {object} payload The payload containing the details of the site to retrieve the Data Lists for
       */
      getDataLists: function alfresco_services_DataListService__getDataLists(payload) {
         if (payload.siteId)
         {
            var url = AlfConstants.PROXY_URI + "slingshot/datalists/lists/site/" + payload.siteId + "/dataLists";
            var config = {
               url: url,
               method: "GET"
            };
            this.mergeTopicsIntoXhrPayload(payload, config);
            this.serviceXhr(config);
         }
         else
         {
            this.alfLog("warn", "A request was made to retrive Data Lists but no 'siteId' attribute was provided", payload, this);
         }
      },

      /**
       * Handles requests to retrieve Data Lists for the supplied site.
       * 
       * @instance
       * @param  {object} payload The payload containing the details of the Data List to retreive items for
       * @since 1.0.86
       */
      getDataListItems: function alfresco_services_DataListService__getDataListItems(payload) {
         if (payload.nodeRef && payload.fields)
         {
            var nodeRef = NodeUtils.processNodeRef(payload.nodeRef);
            var url = AlfConstants.PROXY_URI + "slingshot/datalists/data/node/" + nodeRef.uri;
            var config = {
               url: url,
               method: "POST",
               alfTopic: payload.alfResponseTopic,
               data: {
                  fields: payload.fields,
                  filter: {
                     filterData: "", // TODO: Handle filtering
                     filterId: "all" // TODO: Handle filtering
                  }
               }
            };
            this.serviceXhr(config);
         }
         else
         {
            this.alfLog("warn", "A request was made to retrive Data List items either the 'nodeRef' or 'fields' attribute was not provided", payload, this);
         }
      },

      /**
       * Handles requests to retrieve a model for displaying the requests Data List. In order to render
       * the Data List it is necessary to request the columns details for it. This function makes and
       * XHR request to retrieve this data which is then handled by
       * [onColumnsRetrieved]{@link module:alfresco/services/DataListService}.
       * 
       * @instance
       */
      getDataListWidgets: function alfresco_services_DataListService__doLogout(payload) {
         if (payload.nodeRef && payload.itemType)
         {
            var url = AlfConstants.URL_SERVICECONTEXT + "components/data-lists/config/columns?itemType=" + payload.itemType;
            this.serviceXhr({
               url: url,
               data: payload,
               method: "GET",
               successCallback: this.onColumnsRetrieved,
               failureCallback: this.onColumnsFailed,
               callbackScope: this
            });
         }
         else
         {
            this.alfLog("warn", "A request was made to request DataList data either the 'nodeRef' or 'itemType' data was missing", payload, this);
         }
      },

      /**
       * This is the failure callback for requesting the column data for a DataList. It publishes
       * a request to display a notification prompt to inform the user of the failure.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       * @fires module:alfresco/core/topics#DISPLAY_PROMPT
       */
      onColumnsFailed: function alfresco_services_DataListService__onColumnsRetrieved(/*jshint unused:false*/ response, originalRequestConfig) {
         this.alfServicePublish(topics.DISPLAY_PROMPT, {
            title: this.message("datalistservice.column.retrieval.failure.title"),
            message: this.message("datalistservice.column.retrieval.failure.message")
         });
      },

      /**
       * This is the successful callback handler for [getDataListWidgets]{@link module:alfresco/services/getDataListWidgets}.
       * Using the data provided it builds a model for rendering the DataList and then publishes. Currently the model
       * structure is fixed, but in the future will be made configurable. 
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      onColumnsRetrieved: function alfresco_services_DataListService__onColumnsRetrieved(response, originalRequestConfig) {
         var columns = lang.getObject("columns", false, response);
         if (columns)
         {
            var fields = [];
            var rowWidgets = [];
            var widgetsForHeader = [];
            var widgets = [
               {
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     style: {
                        marginBottom: "5px"
                     },
                     label: "New Item",
                     additionalCssClasses: "call-to-action",
                     publishTopic: topics.REQUEST_FORM,
                     publishPayload: {
                        formConfig: {
                           useDialog: true,
                           formId: "NEW_DATA_LIST_ITEM_DIALOG",
                           dialogTitle: "Create New Item",
                           formSubmissionPayloadMixin: {
                              responseScope: "ALF_DATA_LIST_"
                           }
                        },
                        alfDestination: originalRequestConfig.data.nodeRef,
                        itemId: originalRequestConfig.data.itemType,
                        itemKind: "type",
                        mode: "create"
                     }
                  }
               },
               {
                  name: "alfresco/lists/AlfList",
                  config: {
                     pubSubScope: "ALF_DATA_LIST_",
                     waitForPageWidgets: false,
                     loadDataPublishTopic: topics.GET_DATA_LIST_ITEMS,
                     loadDataPublishPayload: {
                        nodeRef: originalRequestConfig.data.nodeRef,
                        fields: fields
                     },
                     itemsProperty: "items",
                     widgets: [
                        {
                           name: "alfresco/lists/views/AlfListView",
                           config: {
                              widgetsForHeader: widgetsForHeader,
                              widgets: [
                                 {
                                    name: "alfresco/lists/views/layouts/Row",
                                    config: {
                                       widgets: rowWidgets
                                    }
                                 }
                              ]
                           }
                        }
                     ]
                  }
               }
            ];
            array.forEach(columns, function(column) {

               fields.push(column.name.replace(":","_"));

               widgetsForHeader.push({
                  name: "alfresco/lists/views/layouts/HeaderCell",
                  config: {
                     label: column.label,
                     sortable: false
                  }
               });

               // These are the attributes available to work with...
               // dataType, formsName, label, name, type

               var data;
               var widget = lang.getObject(column.name, false, this.defaultDataNameMappings);
               if (widget)
               {
                  widget = lang.clone(widget);
                  data = {
                     config: {
                        currentItemPropertyForDataItems: "itemData." + column.formsName
                     }
                  };
                  $.extend(true, widget, data);
               }
               else
               {
                  widget = lang.getObject(column.dataType, false, this.defaultDataTypeMappings);
                  if (widget)
                  {
                     widget = lang.clone(widget);
                     data = {
                        config: {
                           propertyToRender: "itemData." + column.formsName + ".displayValue"
                        }
                     };
                     $.extend(true, widget, data);
                  }
                  else
                  {
                     widget = {
                        name: "alfresco/renderers/Property",
                        config: {
                           propertyToRender: "itemData." + column.formsName + ".displayValue"
                        }
                     };
                  }
               }

               rowWidgets.push({
                  name: "alfresco/lists/views/layouts/Cell",
                  config: {
                     additionalCssClasses: "mediumpad",
                     widgets: [
                        widget
                     ]
                  }
               });
            }, this);

            widgetsForHeader.push({
               name: "alfresco/lists/views/layouts/HeaderCell",
               config: {
                  label: "Actions",
                  sortable: false
               }
            });

            rowWidgets.push({
               name: "alfresco/lists/views/layouts/Cell",
               config: {
                  additionalCssClasses: "mediumpad",
                  widgets: [
                     {
                        name: "alfresco/renderers/PublishAction",
                        config: {
                           iconClass: "delete-16",
                           onlyShowOnHover: true,
                           publishTopic: topics.DELETE_DATA_LIST_ITEMS,
                           publishPayloadType: "PROCESS",
                           publishPayloadModifiers: ["processCurrentItemTokens"],
                           publishPayload: {
                              url: "slingshot/datalists/action/items?alf_method=delete",
                              nodeRefs: ["{nodeRef}"]
                           },
                           publishGlobal: true
                        }
                     },
                     {
                        name: "alfresco/renderers/PublishAction",
                        config: {
                           iconClass: "edit-16",
                           onlyShowOnHover: true,
                           publishTopic: topics.REQUEST_FORM,
                           publishPayloadType: "PROCESS",
                           publishPayloadModifiers: ["processCurrentItemTokens"],
                           publishPayload: {
                              formConfig: {
                                 useDialog: true,
                                 formId: "EDIT_DATA_LIST_ITEM_DIALOG",
                                 dialogTitle: "Edit Data Item",
                                 formSubmissionPayloadMixin: {
                                    responseScope: "ALF_DATA_LIST_"
                                 }
                              },
                              itemId: "{nodeRef}",
                              itemKind: "node",
                              mode: "edit"
                           },
                           publishGlobal: true
                        }
                     }
                  ]
               }
            });

            if (originalRequestConfig.data.title)
            {
               widgets = [
                  {
                     name: "alfresco/layout/TitleDescriptionAndContent",
                     config: {
                        title: originalRequestConfig.data.title,
                        description: originalRequestConfig.data.description,
                        itemKeyProperty: "nodeRef",
                        subscriptionTopic: topics.DATA_LIST_UPDATED,
                        subscribeGlobal: true,
                        currentItem: {
                           nodeRef: originalRequestConfig.data.nodeRef
                        },
                        widgets: widgets,
                        invisibilityConfig: {
                           initialValue: false,
                           rules: [
                              {
                                 topic: topics.DELETE_DATA_LIST_SUCCESS,
                                 attribute: "nodeRef",
                                 is: [originalRequestConfig.data.nodeRef],
                                 subscribeGlobal: true
                              }
                           ]
                        }
                     }
                  }
               ];
            }



            this.alfPublish(originalRequestConfig.data.alfResponseTopic || originalRequestConfig.data.alfTopic + "_SUCCESS" , {
               widgets: widgets
            });
         }
      },

      /**
       * Handles requests to delete a Data List. Generates a confirmation prompt to the user.
       *
       * @instance
       * @param  {object} payload The payload containing the NodeRef of the Data List to delete
       * @fires module:alfresco/core/topics#REQUEST_CONFIRMATION_PROMPT
       */
      onDeleteDataListRequest: function alfresco_services_DataListService__onDeleteDataListRequest(payload) {
         if (payload.nodeRef)
         {
            this.alfServicePublish(topics.REQUEST_CONFIRMATION_PROMPT, {
               confirmationTitle: "Delete " + payload.title,
               confirmationPrompt: "Are you sure you want to delete " + payload.title +" ?",
               confirmationButtonLabel: "Yes",
               cancellationButtonLabel: "No",
               confirmationPublication: {
                  publishTopic: topics.DELETE_DATA_LIST_CONFIRMATION,
                  publishPayload: {
                     nodeRef: payload.nodeRef
                  },
                  publishGlobal: true
               }
            });
         }
         else
         {
            this.alfLog("warn", "A request was made to delete a Data List but no 'nodeRef' attribute was provided in the payload", payload, this);
         }
      },

      /**
       * Handles the confrmation of a request to delete a Data List.
       *
       * @instance
       * @param  {object} payload The payload containing the NodeRef of the Data List to delete
       */
      onDeleteDataListConfirmation: function alfresco_services_DataListService__onDeleteDataListConfirmation(payload) {
         var nodeRef = NodeUtils.processNodeRef(payload.nodeRef);
         this.serviceXhr({
            url: AlfConstants.PROXY_URI + "slingshot/datalists/list/node/" + nodeRef.uri,
            method: "DELETE",
            nodeRef: payload.nodeRef,
            successCallback: this.onDeleteDataListSuccess,
            failureCallback: this.onDeleteDataListFailure,
            callbackScope: this
         });
      },

      /**
       * @instance
       * @param {object} response The response from the original XHR request.
       * @param {object} originalRequestConfig The configuration passed to the original XHR request.
       *
       * @fires module:alfresco/core/topics#RELOAD_DATA_TOPIC
       * @fires module:alfresco/core/topic#DELETE_DATA_LIST_SUCCESS
       */
      onDeleteDataListSuccess: function alfresco_services_DataListService__onDeleteDataListSuccess(response, originalRequestConfig) {
         // TODO: May need a more specific scoped publication
         this.alfPublish(topics.RELOAD_DATA_TOPIC);

         // Publish a success topic... 
         // this is done so that if the Data List items are currently being displayed they can be hidden...
         this.alfPublish(topics.DELETE_DATA_LIST_SUCCESS, {
            nodeRef: originalRequestConfig.nodeRef
         }); 
      },

      /**
       * Handles failed attempts to delete a Data List
       * 
       * @instance
       * @param {object} response The response from the original XHR request.
       * @param {object} originalRequestConfig The configuration passed to the original XHR request.
       */
      onDeleteDataListFailure: function alfresco_services_DataListService__onDeleteDataListFailure(response, originalRequestConfig) {
         this.alfLog("error", "It was not possible to delete a Data List", response, originalRequestConfig, this);
      },

      /**
       * Handles requests to delete items from a Data List. Generates a confirmation prompt to the user.
       *
       * @instance
       * @param  {object} payload The payload containing the NodeRefs of the items to delete
       * @since 1.0.86
       * @fires module:alfresco/core/topics#REQUEST_CONFIRMATION_PROMPT
       */
      onDeleteDataListItemsRequest: function alfresco_services_DataListService__onDeleteDataListItemsRequest(payload) {
         if (payload.nodeRefs)
         {
            this.alfServicePublish(topics.REQUEST_CONFIRMATION_PROMPT, {
               confirmationTitle: "Delete Item",
               confirmationPrompt: "Are you sure you want to delete the item(s)?",
               confirmationButtonLabel: "Yes",
               cancellationButtonLabel: "No",
               confirmationPublication: {
                  publishTopic: topics.DELETE_DATA_LIST_ITEMS_CONFIRMATION,
                  publishPayload: {
                     nodeRefs: payload.nodeRefs,
                     alfResponseScope: payload.alfResponseScope
                  },
                  publishGlobal: true
               }
            });
         }
         else
         {
            this.alfLog("warn", "A request was made to delete items from a Data List but no 'nodeRefs' attribute was provided in the payload", payload, this);
         }
      },

      /**
       * Handles the confrmation of a request to delete a Data List.
       *
       * @instance
       * @param  {object} payload The payload containing the NodeRef of the Data List to delete
       */
      onDeleteDataListItemsConfirmation: function alfresco_services_DataListService__onDeleteDataListItemsConfirmation(payload) {
         this.serviceXhr({
            url: AlfConstants.PROXY_URI + "slingshot/datalists/action/items?alf_method=delete",
            method: "POST",
            data: {
               alfResponseTopic: topics.RELOAD_DATA_TOPIC,
               alfResponseScope: payload.alfResponseScope,
               nodeRefs: payload.nodeRefs
            }
         });
      },

      

      /**
       * Handles requests to update the title and description of a Data List
       * 
       * @instance
       * @param {object} payload The details of the Data List to update.
       */
      updateDataList: function alfresco_services_DataListService__updateDataList(payload) {
         if (payload.nodeRef && payload.title)
         {
            var nodeRef = NodeUtils.processNodeRef(payload.nodeRef);
            var url = AlfConstants.PROXY_URI + "api/node/" + nodeRef.uri + "/formprocessor";
            var config = {
               url: url,
               method: "POST",
               nodeRef: payload.nodeRef,
               data: {
                  prop_cm_title: payload.title,
                  prop_cm_description: payload.description
               },
               successCallback: this.updateDataListSuccess,
               failureCallback: this.updateDataListFailure,
               callbackScope: this
            };
            this.serviceXhr(config);
         }
         else
         {
            this.alfLog("warn", "A request was made to update a Data List but either a 'nodeRef' or 'title' attribute was missing from the supplied payload", payload, this);
         }
      },

      /**
       * This handles successfully completed requests to update a Data List
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       *
       * @fires module:alfresco/core/topics#RELOAD_DATA_TOPIC
       * @fires module:alfresco/core/topics#DATA_LIST_UPDATED
       */
      updateDataListSuccess: function alfresco_services_DataListService__updateDataListSuccess(response, originalRequestConfig) {
         this.alfPublish(topics.RELOAD_DATA_TOPIC);
         this.alfPublish(topics.DATA_LIST_UPDATED, {
            nodeRef: originalRequestConfig.nodeRef,
            title: originalRequestConfig.data.prop_cm_title,
            description: originalRequestConfig.data.prop_cm_description
         });
      },

      /**
       * This handles failed requests to update a Data List
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      updateDataListFailure: function alfresco_services_DataListService__updateDataListFailure(response, originalRequestConfig) {
         this.alfLog("error", "Could not update Data List", response, originalRequestConfig);
         this.alfServicePublish(topics.DISPLAY_PROMPT, {
            title: "Update Failure",
            message: "It was not possible to update the Data List"
         });
      }
   });
});