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
 * This service handles requests to change the type of a particular node. The types that are available
 * are expected to be provided as [a configuration attribute]{@link module:alfresco/services/actions/ChangeTypeService#types} 
 * when instantiating this service. When used on Alfresco Share the types can be found in the XML configuration 
 * files.
 *
 * @example <caption>This is an example configuration:</caption>
 * {
 *   name: "alfresco/services/actions/ChangeTypeService",
 *   config: {
 *     types: [
 *       {
 *         name: "cm:folder"
 *       },
 *       {
 *         name: "cm:content",
 *         label: "Content",
 *         subTypes: [
 *           {
 *             name: "cm:sub-content",
 *             label: "Sub-Content",
 *               subTypes: [
 *                 {
 *                   name: "cm:super-sub-content"
 *                 }
 *               ]
 *            }
 *         ]
 *       }
 *     ]
 *   }
 * }
 *
 * @module alfresco/services/actions/ChangeTypeService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 * @since 1.0.58
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/core/topics",
        "service/constants/Default",
        "dojo/_base/lang",
        "dojo/_base/array",
        "alfresco/forms/controls/Select"],
        function(declare, BaseService, AlfCoreXhr, topics, AlfConstants, lang, array) {

   return declare([BaseService, AlfCoreXhr], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/ChangeTypeService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/ChangeTypeService.properties"}],

      /**
       * This is the array of available types that are available. 
       *
       * @instance
       * @type {array}
       * @default
       */
      types: null,

      /**
       * Registers change type subscriptions.
       *
       * @instance
       * @listens module:alfresco/core/topics#CHANGE_TYPE_REQUEST
       */
      registerSubscriptions: function alfresco_services_actions_ChangeTypeService__registerSubscriptions() {
         this.alfSubscribe(topics.CHANGE_TYPE_REQUEST, lang.hitch(this, this.onChangeTypeRequest));
      },

      /**
       * Handles requests to change the type of a node. This will perform an XHR request if necessary to load the full
       * metadata for the node to be upated in order to retrieve its current type.
       * 
       * @instance
       * @param {object} item The item to perform the action on
       * @fires module:alfresco/core/topics#GET_DOCUMENT
       */
      onChangeTypeRequest: function alfresco_services_actions_ChangeTypeService__onChangeTypeRequest(payload) {
         if (payload && payload.node && payload.node.type)
         {
            // We have all the information to check what types to list...
            this.showTypeSelectionDialog(payload);
         }
         else if ((payload.node && payload.node.nodeRef) || payload.nodeRef)
         {
            // We have a NodeRef so we can request the full node data...
            var nodeRef = payload.node.nodeRef || payload.nodeRef;
            var responseTopic = this.generateUuid();
            var subscriptionHandles = [];
            subscriptionHandles.push(this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onNodeDataSuccess), true));
            subscriptionHandles.push(this.alfSubscribe(responseTopic + "_FAILURE", lang.hitch(this, this.onNodeDataFailure), true));
            this.alfPublish(topics.GET_DOCUMENT, {
               subscriptionHandle: subscriptionHandles,
               alfResponseTopic: responseTopic,
               nodeRef: nodeRef
            }, true);
         }
         else
         {
            this.alfLog("warning", "A request was made to manage aspects, but no 'node' was provided in the 'payload' object", payload, this);
         }
      },

      /**
       * Handles requests to retrieve the full metadata for a Node.
       * 
       * @instance
       */
      onNodeDataSuccess: function alfresco_services_actions_ChangeTypeService__onNodeDataSuccess(payload) {
         if (payload.subscriptionHandles)
         {
            this.alfUnsubscribeSaveHandles([payload.subscriptionHandles]);
         }
         if (lang.exists("response.item", payload)) 
         {
            this.showTypeSelectionDialog(payload.response.item);
         }
         else
         {
            this.alfLog("warn", "Node data was provided but the 'response.item' attribute was not found", payload, this);
         }
      },

      /**
       * Handles requests to retrieve the full metadata for a Node.
       * 
       * @instance
       */
      onNodeDataFailure: function alfresco_services_actions_ChangeTypeService__onNodeDataFailure(payload) {
         this.alfLog("error", "It was not possible to retrieve the metadata for the requested Node", payload);
      },

      /**
       * Called from [updateApplicableTypes]{@link module:alfresco/services/actions/ChangeTypeService#updateApplicableTypes}
       * to add all applicable sub-types of the current node type.
       *
       * @instance
       * @param {object[]} applicableTypes An array to be populates with type options.
       * @param {string}   type The type of the node to be updated
       * @param {object[]} types An array of types to process.
       */
      addSubTypes: function alfresco_services_actions_ChangeTypeService__addSubTypes(applicableTypes, subType) {
         if (subType.name)
         {
            var label = subType.name;
            if (subType.label)
            {
               label = subType.label + " (" + subType.name + ")";
            }
            applicableTypes.push({
               value: subType.name,
               label: label
            });

            // Add all nested sub-types as well (as these are further specializations of the current node type)...
            array.forEach(subType.subTypes, lang.hitch(this, this.addSubTypes, applicableTypes));
         }
         else
         {
            this.alfLog("No 'name' attribute provided for sub-type", subType, this);
         }
      },

      /**
       * Updates the supplied array with applicable sub-types for the supplied type.
       *
       * @instance
       * @param {object[]} applicableTypes An array to be populates with type options.
       * @param {string}   type The type of the node to be updated
       * @param {object[]} types An array of types to process.
       */
      updateApplicableTypes: function alfresco_services_actions_ChangeTypeService__updateApplicableTypes(applicableTypes, currNodeType, types) {
         array.forEach(types, function(type) {
            if (type.name === currNodeType)
            {
               array.forEach(type.subTypes, lang.hitch(this, this.addSubTypes, applicableTypes));
            }
            else
            {
               array.forEach(type.subTypes, lang.hitch(this, this.getAvailableTypes, applicableTypes, currNodeType));
            }
         }, this);
      },

      /**
       * Shows the type selection dialog. The available types for selection are generated by calling 
       * [updateApplicableTypes]{@link module:alfresco/services/actions/ChangeTypeService#updateApplicableTypes}
       * with the type of the current node and the 
       * [configured types]{@link module:alfresco/services/actions/ChangeTypeService#types}.
       * 
       * @instance
       * @param {object} item The node to change the type of
       * @fires module:alfresco/core/topics#CREATE_FORM_DIALOG
       */
      showTypeSelectionDialog: function alfresco_services_actions_ChangeTypeService__showTypeSelectionDialog(item) {
         var responseTopic = this.generateUuid();
         var subscriptionHandle = this.alfSubscribe(responseTopic, lang.hitch(this, this.onTypeSelection), true);
         
         // Get the appropriate title for the dialog...
         var dialogTitle = this.message("change-type.dialog.title", {
            0: item.displayName
         });

         // Work out the applicable types for the node to be updated...
         var applicableTypes = [];
         this.updateApplicableTypes(applicableTypes, item.node.type, this.types);

         // Request a new dialog for selecting a new type...
         this.alfPublish(topics.CREATE_FORM_DIALOG, {
            dialogId: "ALF_CHANGE_TYPE_DIALOG",
            dialogTitle: dialogTitle,
            formSubmissionTopic: responseTopic,
            formSubmissionPayloadMixin: {
               item: item,
               subscriptionHandle: subscriptionHandle
            },
            widgets: [
               {
                  id: "CHANGE_TYPE_DIALOG_SELECT",
                  name: "alfresco/forms/controls/Select",
                  config: {
                     name: "type",
                     label: "change-type.select.label",
                     description: "change-type.select.desription",
                     requirementConfig: {
                        initialValue: true
                     },
                     optionsConfig: {
                        fixed: applicableTypes
                     }
                  }
               }
            ]
         });
      },

      /**
       * This function is called when a new type is selected for the node and it makes an XHR request to 
       * the Alfresco Repository to attempt to perform the requested change.
       * 
       * @instance
       * @param {object} The payload for generated when selecting a new type.
       */
      onTypeSelection: function aalfresco_services_actions_ChangeTypeService__onTypeSelection(payload) {
         // Clean up any subscription handles
         if (payload && payload.subscriptionHandle)
         {
            this.alfUnsubscribe(payload.subscriptionHandle);
            delete payload.subscriptionHandle;
         }

         // Post the update...
         var processedNodeRef = payload.item.node.nodeRef.replace("://", "/");
         this.serviceXhr({url: AlfConstants.PROXY_URI + "slingshot/doclib/type/node/" + processedNodeRef,
                          method: "POST",
                          item: payload.item,
                          data: {
                             type: payload.type
                          },
                          successCallback: this.onUpdateSuccess,
                          failureCallback: this.onUpdateFailure,
                          callbackScope: this});
      },

      /**
       * Handles successful requests to change a node type.
       *
       * @instance
       * @param {object} response The response object from the XHR request
       * @param  {object} originalRequestConfig The object passed when making the original XHR request
       * @fires module:alfresco/core/topics#DISPLAY_NOTIFICATION
       */
      onUpdateSuccess: function  alfresco_services_actions_ChangeTypeService__onUpdateSuccess(response, originalRequestConfig) {
         this.alfServicePublish(topics.DISPLAY_NOTIFICATION, {
            message: this.message("change-type.success", {
               "0": originalRequestConfig.item.displayName
            })
         });
      },

      /**
       * Handles failed requests to change a node type.
       *
       * @instance
       * @param {object} response The response object from the XHR request
       * @param  {object} originalRequestConfig The object passed when making the original XHR request
       * @fires module:alfresco/core/topics#DISPLAY_PROMPT
       */
      onUpdateFailure: function  alfresco_services_actions_ChangeTypeService__onUpdateFailure(response, originalRequestConfig) {
         this.alfPublish(topics.DISPLAY_PROMPT, {
            message: this.message("change-type.failure", {
               "0": originalRequestConfig.item.displayName
            })
         });
      }
   });
});