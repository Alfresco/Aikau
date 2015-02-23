/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
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
 * This service handles requests to manage the aspects on particular node. The aspects that are available
 * to be added (and optionally those that can be added and removed) are expected to be provided as configuration
 * attributes when instantiating this service.
 *
 * @module alfresco/services/actions/ManageAspectsService
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "service/constants/Default",
        "dojo/_base/lang",
        "dojo/_base/array",
        "alfresco/core/ObjectTypeUtils"],
        function(declare, AlfCore, AlfCoreXhr, AlfConstants, lang, array, ObjectTypeUtils) {

   return declare([AlfCore, AlfCoreXhr], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/ManageAspectsService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/ManageAspectsService.properties"}],

      /**
       * This is the array of available aspects that are available. 
       *
       * @instance
       * @type {array}
       * @default null
       */
      availableAspects: null,

      /**
       * This is the array of available aspects can be added to a node. If this is not provided then it
       * is assumed that all the aspected configured in the 
       * [availableAspects]{@link module:alfresco/services/actions/ManageAspectsService#availableAspects}
       * array can be added to a node.
       *
       * @instance
       * @type {array}
       * @default null
       */
      addableAspects: null,

      /**
       * This is the array of available aspects can be removed from a node. If this is not provided then it
       * is assumed that all the aspected configured in the 
       * [availableAspects]{@link module:alfresco/services/actions/ManageAspectsService#availableAspects}
       * array can be removed from a node.
       *
       * @instance
       * @type {array}
       * @default null
       */
      removableAspects: null,

      /**
       * The key of each aspect that is used as the unique identifier of that aspect.
       *
       * @instance
       * @type {string}
       * @default "id"
       */
      itemKey: "id",

      /**
       * Sets up the service using the configuration provided. This will check to see what aspects are available,
       * addable and removable. If no addble or removable aspects are explicitly configured then it is assumed that
       * all available aspects are both addable and removable. Only aspects that are configured as being available
       * will be displayed in the manage aspects picker, only aspects that are addable can be added in the manage
       * aspects picker and only aspects that are removable can be removed in the manage aspects picker.
       *
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_services_actions_ManageAspectsService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("ALF_MANAGE_ASPECTS_REQUEST", lang.hitch(this, this.onManageAspects));

         if (!this.availableAspects)
         {
            this.availableAspects = [];
         }
         if (!this.addableAspects)
         {
            // If no explicitly addable aspects have been declared, then all available aspects are addable
            this.addableAspects = lang.clone(this.availableAspects);
         }
         if (!this.removableAspects)
         {
            // If no explicitly removable aspects have been declared, then all available aspects are removable
            this.removableAspects = lang.clone(this.availableAspects);
         }

         // Clone the available aspects for use as determining which aspects to display...
         this.aspectsToDisplay = lang.clone(this.availableAspects);

         // Process the final available aspects list to convert arrays of Strings into arrays of objects
         // and make an attempt at generating a user-friendly label for the aspect...
         var availableAspects = [];
         array.forEach(this.availableAspects, lang.hitch(this, this.processAspect, availableAspects));
         this.availableAspects = availableAspects;
      },

      /**
       *
       * @param {object} item The item to perform the action on
       */
      onManageAspects: function alfresco_services_actions_ManageAspectsService__onManageAspects(payload) {
         if (payload && payload.item && payload.item.nodeRef)
         {
            // This is the array of aspects that are currently applied to the node. These will automatically
            // be hidden from the list of available aspects to be applied...
            var aspects = [];

            // The aspects may already be available in the node data, if not they will need to be requested...
            if (payload.item.node && payload.item.node.aspects)
            {
               // Aspects are already provided, use these...
               array.forEach(payload.item.node.aspects, lang.hitch(this, this.processAspect, aspects));
               this.showAspectsDialog(payload.item, aspects);
            }
            else
            {
               // We need to request the aspects for the current node...
               this.onAspects(payload.item);
            }
         }
         else
         {
            this.alfLog("warning", "A request was made to manage aspects, but no 'item.nodeRef' was provided in the 'payload' object", payload, this);
         }
      },

      /**
       * Displays a dialog containing a [SimplePicker]{@link module:alfresco/forms/controls/SimplePicker} control
       * that allows the user to select which aspects they wish to have applie to the current item.
       * 
       * @param {object} item The item to modify the applied aspects of.
       * @param {array} currentAspects The array of aspects that are currently applied to the item.
       */
      showAspectsDialog: function alfresco_services_actions_ManageAspectsService__onAspectsDialog(item, currentAspects) {
         var responseTopic = this.generateUuid();
         var subscriptionHandle = this.alfSubscribe(responseTopic, lang.hitch(this, this.onActionManageAspectsConfirmation), true);
         
         var dialogTitle = this.message("services.actionservice.ManageAspects.dialogTitle", {
            0: item.displayName
         });

         this.alfPublish("ALF_CREATE_FORM_DIALOG_REQUEST", {
            dialogId: "ALF_MANAGE_ASPECTS_DIALOG",
            dialogTitle: dialogTitle,
            formSubmissionTopic: responseTopic,
            formSubmissionPayloadMixin: {
               item: item,
               subscriptionHandle: subscriptionHandle,
               originallySelected: lang.clone(currentAspects)
            },
            widgets: [
               {
                  name: "alfresco/forms/controls/SimplePicker",
                  config: {
                     label: "services.actionservice.ManageAspects.label",
                     description: "services.actionservice.ManageAspects.description",
                     name: "selectedAspects",
                     itemKey: this.itemKey,
                     propertyToRender: "label",
                     noItemsMessage: "services.actionservice.ManageAspects.noAspects",
                     availableItemsLabel: "services.actionservice.ManageAspects.available",
                     pickedItemsLabel: "services.actionservice.ManageAspects.applied",
                     value: currentAspects,
                     currentData: {
                        items: this.availableAspects
                     },
                     aspectsToDisplay: this.aspectsToDisplay,
                     addableAspects: this.addableAspects,
                     removableAspects: this.removableAspects,
                     widgetsForAvailableItemsView: this.widgetsForAvailableItemsView,
                     widgetsForPickedItemsView: this.widgetsForPickedItemsView
                  }
               }
            ]
         });
      },

      /**
       * Handles requests to retrieve the currently applied aspects to the supplied item. It is expected that the
       * item will have a "nodeRef" attribute.
       * 
       * @param {object} item The item to retrieve the currently applied aspects to.
       */
      onAspects: function alfresco_services_actions_ManageAspectsService__onAspects(item) {
         this.serviceXhr({url: AlfConstants.PROXY_URI + "slingshot/doclib/aspects/node/" + item.nodeRef,
                          method: "GET",
                          item: item,
                          successCallback: this.onAspectsSuccess,
                          failureCallback: this.onAspectsFailure,
                          callbackScope: this});
      },

      /**
       * Handles successful requests to retrieve the currently applied aspects for a given node.
       * 
       * @param {object} response The response object from the XHR request
       * @param  {object} originalRequestConfig The object passed when making the original XHR request
       */
      onAspectsSuccess: function  alfresco_services_actions_ManageAspectsService__onAspectsSuccess(response, originalRequestConfig) {
         if (response && response.current)
         {
            var aspects = [];
            array.forEach(response.current, lang.hitch(this, this.processAspect, aspects));
            this.showAspectsDialog(originalRequestConfig.item, aspects);
         }
         else
         {
            this.alfLog("error", "The response to a request for currently available aspects did not contain a 'current' attribute", response, originalRequestConfig, this);
         }
      },

      /**
       * Inspects the supplied aspect data and adds it into the aspects array if it is an object or constructs
       * an object for it if it is a string.
       * 
       * @param {array} The array of aspects to add the current aspect data into
       * @param {object|string} The current aspect data
       */
      processAspect: function alfresco_services_actions_ManageAspectsService__processAspect(aspects, aspect) {
         if (ObjectTypeUtils.isString(aspect)) {
            aspects.push({
               id: aspect,
               label: this.processAspectLabel(aspect)
            });
         }
         else if (ObjectTypeUtils.isObject(aspect))
         {
            if (!aspect.label)
            {
               aspect.label = this.processAspectLabel(aspect[this.itemKey]);
            }
            aspects.push(aspect);
         }
         else
         {
            this.alfLog("warn", "Unexpected aspect data encountered when processing current aspects", aspect, this);
         }
      },

      /**
       * Attempts to convert an aspect into user friendly label. This assumes that aspects are mapped to 
       * as follows, if the aspect is "cm:complianceable" then the NLS key is expected to be: "aspect.cm_complianceable"
       * 
       * @param {string} aspect The aspect to get a user friendly label for
       * @return {string} A user friendly label for the aspect (or the original aspect if one can't be found)
       */
      processAspectLabel: function alfresco_services_actions_ManageAspectsService__processAspectLabel(aspect) {
         var label = aspect;
         var nlsKey = "aspect." + aspect.replace(":", "_");
         var nlsValue = this.message(nlsKey);
         if (nlsKey !== nlsValue)
         {
            label = nlsValue;
         }
         return label;
      },

      /**
       * Handles failed requests to retrieve the currently applied aspects for a given node.
       * 
       * @param {object} response The response object from the XHR request
       * @param  {object} originalRequestConfig The object passed when making the original XHR request
       */
      onAspectsFailure: function  alfresco_services_actions_ManageAspectsService__onAspectsFailure(response, originalRequestConfig) {
         this.alfLog("error", "It was not possible to retrieve a list of currently available aspects", response, originalRequestConfig, this);
         this.alfPublish("ALF_DISPLAY_PROMPT", {
            message: this.message("services.actionservice.ManageAspects.aspectRetrievalFailed", {
               "0": originalRequestConfig.item.displayName
            })
         });
      },

      /**
       * This function should be called when a user confirms the changes that they have made to aspects for a
       * particular item (e.g. document or folder).
       * 
       * @param {object} payload The payload containing the updated aspects.
       */
      onActionManageAspectsConfirmation: function alfresco_services_ActionService__onActionManageAspectsConfirmation(payload) {
         // Clean up any subscription handles
         if (payload && payload.subscriptionHandle)
         {
            this.alfUnsubscribe(payload.subscriptionHandle);
            delete payload.subscriptionHandle;
         }

         // Generate the arrays of added and removed aspects...
         var added = [];
         var removed= [];
         array.forEach(payload.selectedAspects, lang.hitch(this, this.findAdded, payload.originallySelected, added));
         array.forEach(payload.originallySelected, lang.hitch(this, this.findRemoved, payload.selectedAspects, removed));

         // Post the update...
         var data = {
            added: added,
            removed: removed
         };
         this.serviceXhr({url: AlfConstants.PROXY_URI + "slingshot/doclib/aspects/node/" + payload.item.nodeRef,
                          method: "POST",
                          item: payload.item,
                          data: data,
                          successCallback: this.onUpdateSuccess,
                          failureCallback: this.onUpdateFailure,
                          callbackScope: this});
      },

      /**
       * This function generates the data to be posted when updating the applied aspects. The Alfresco Repository API
       * expects an "added" array to be provided in the POST body so this function will construct that array
       * from the data provided by the form submissions.
       * 
       * @param {array} originallySelected The originally selected aspects when the dialog was opened.
       * @param {array} added The array of added aspects to populate
       * @param {object} aspect The current for consideration of adding to the "added" array
       */
      findAdded: function alfresco_services_actions_ManageAspectsService__findAdded(originallySelected, added, aspect) {
         // Was the current item (that is now selected) in the original array of selected items?
         var found = array.some(originallySelected, function(item) {
            return item[this.itemKey] === aspect[this.itemKey];
         }, this);

         if (found === false)
         {
            added.push(aspect[this.itemKey]);
         }
      },

      /**
       * This function generates the data to be posted when updating the applied aspects. The Alfresco Repository API
       * expects a "removed" array to be provided in the POST body so this function will construct that array
       * from the data provided by the form submissions.
       * 
       * @param {array} originallySelected The originally selected aspects when the dialog was opened.
       * @param {array} removed The array of removed aspects to populate
       * @param {object} aspect The current for consideration of adding to the "removed" array
       */
      findRemoved: function alfresco_services_actions_ManageAspectsService__findRemoved(selected, removed, aspect) {
         // Was the current item (that was in the original array of selected items) in the new array of selected items?
         var found = array.some(selected, function(item) {
            return item[this.itemKey] === aspect[this.itemKey];
         }, this);

         if (found === false)
         {
            removed.push(aspect[this.itemKey]);
         }
      },

      /**
       * Handles successful requests update aspects on a node.
       * 
       * @param {object} response The response object from the XHR request
       * @param  {object} originalRequestConfig The object passed when making the original XHR request
       */
      onUpdateSuccess: function  alfresco_services_actions_ManageAspectsService__onUpdateSuccess(response, originalRequestConfig) {
         this.alfLog("info", "Aspects updated successfully", response, originalRequestConfig, this);
      },

      /**
       * Handles failed requests to update aspects on a node.
       * 
       * @param {object} response The response object from the XHR request
       * @param  {object} originalRequestConfig The object passed when making the original XHR request
       */
      onUpdateFailure: function  alfresco_services_actions_ManageAspectsService__onUpdateFailure(response, originalRequestConfig) {
         this.alfLog("error", "Aspects were not updated", response, originalRequestConfig, this);
         this.alfPublish("ALF_DISPLAY_PROMPT", {
            message: this.message("services.actionservice.ManageAspects.aspectUpdateFailed", {
               "0": originalRequestConfig.item.displayName
            })
         });
      },

      /**
       * This is the model to use for rendering the items that are available for selection.
       *
       * @instance
       * @type {object}
       */
      widgetsForAvailableItemsView: [
         {
            name: "alfresco/lists/views/AlfListView",
            config: {
               widgets: [
                  {
                     name: "alfresco/lists/views/layouts/Row",
                     config: {
                        visibilityConfig: {
                           rules: [
                              {
                                 topic: "ALF_ITEM_REMOVED",
                                 attribute: "{itemKey}",
                                 is: ["{itemKey}"],
                                 useCurrentItem: true,
                                 strict: false
                              }
                           ]
                        },
                        invisibilityConfig: {
                           rules: [
                              {
                                 topic: "ALF_ITEM_SELECTED",
                                 attribute: "{itemKey}",
                                 is: ["{itemKey}"],
                                 useCurrentItem: true,
                                 strict: false
                              }
                           ]
                        },
                        widgets: [
                           {
                              name: "alfresco/lists/views/layouts/Cell",
                              config: {
                                 widgets: [
                                    {
                                       name: "alfresco/renderers/Property",
                                       config: {
                                          propertyToRender: "{propertyToRender}"
                                       }
                                    }
                                 ]
                              }
                           },
                           {
                              name: "alfresco/lists/views/layouts/Cell",
                              config: {
                                 width: "20px",
                                 widgets: [
                                    {
                                       name: "alfresco/renderers/PublishAction",
                                       config: {
                                          publishPayloadType: "CURRENT_ITEM",
                                          publishGlobal: false,
                                          publishToParent: false,
                                          renderFilter: [
                                             {
                                                property: "{itemKey}",
                                                values: "{addableAspects}"
                                             }
                                          ]
                                       }
                                    }
                                 ]
                              }
                           }
                        ],
                        renderFilter: [
                           {
                              property: "{itemKey}",
                              values: "{aspectsToDisplay}"
                           }
                        ]
                     }
                  }
               ]
            }
         }
      ],

      /**
       * This is the model to use for rendering the items that have been picked.
       *
       * @instance
       * @type {object}
       */
      widgetsForPickedItemsView: [
         {
            name: "alfresco/lists/views/layouts/Row",
            config: {
               widgets: [
                  {
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/renderers/Reorder",
                              config: {
                                 propertyToRender: "{propertyToRender}",
                                 moveUpPublishTopic: "ALF_ITEM_MOVED_UP",
                                 moveUpPublishPayloadType: "CURRENT_ITEM",
                                 moveDownPublishTopic: "ALF_ITEM_MOVED_DOWN",
                                 moveDownPublishPayloadType: "CURRENT_ITEM"
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
                                 propertyToRender: "{propertyToRender}"
                              }
                           }
                        ]
                     }
                  },
                  {
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        width: "20px",
                        widgets: [
                           {
                              name: "alfresco/renderers/PublishAction",
                              config: {
                                 iconClass: "delete-16",
                                 publishTopic: "ALF_ITEM_REMOVED",
                                 publishPayloadType: "CURRENT_ITEM",
                                 renderFilter: [
                                    {
                                       property: "{itemKey}",
                                       values: "{removableAspects}"
                                    }
                                 ]
                              }
                           }
                        ]
                     }
                  }
               ],
               renderFilter: [
                  {
                     property: "{itemKey}",
                     values: "{aspectsToDisplay}"
                  }
               ]
            }
         }
      ]
   });
});