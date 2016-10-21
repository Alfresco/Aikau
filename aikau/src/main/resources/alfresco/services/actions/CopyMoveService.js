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
 * This service handles requests to copy or move nodes from one location to another. It does this by displaying
 * a [Dialog]{@link module:alfresco/dialogs/AlfDialog} containing a [ContainerPicker]{@link module:alfresco/pickers/ContainerPicker}.
 * The [Dialog]{@link module:alfresco/dialogs/AlfDialog} is created via the [DialogService]{@link module:alfresco/services/DialogService}
 * so it is imperative that is also included on the page (or an alternative service that handles the same publications).
 *
 * @module alfresco/services/actions/CopyMoveService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/core/topics",
        "service/constants/Default",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/when",
        "alfresco/core/NodeUtils"],
        function(declare, BaseService, AlfCoreXhr, topics, AlfConstants, lang, array, when, NodeUtils) {

   return declare([BaseService, AlfCoreXhr], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/CopyMoveService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/CopyMoveService.properties"}],

      /**
       * This should be set to the NodeRef to be used to represent the root of the Repository. By default
       * this is "alfresco://company/home" but can be configured to be any other value. When used in Alfresco
       * Share this should be set to the configured value of <root-node>
       *
       * @instance
       * @type {string}
       * @default
       */
      repoNodeRef: "alfresco://company/home",

      /**
       * Indicates whether or not [CopyMoveService]{@link module:alfresco/services/CopyMoveService} should support the
       * creation of links for files and folders
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.92
       */
      supportLinkCreation: false,

      /**
       * URL to call to copy a document
       *
       * @instance
       * @type {string}
       * @default
       */
      copyAPI: "slingshot/doclib/action/copy-to/node/",

      /**
       * URL to call to move a document
       *
       * @instance
       * @type {string}
       * @default
       */
      moveAPI: "slingshot/doclib/action/move-to/node/",

      /**
       * URL to call to create a link to a document
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.92
       */
      createLinkAPI: "api/node/doclink/",


      /**
       * Sets up the service using the configuration provided.
       *
       * @instance
       * @since 1.0.32
       */
      registerSubscriptions: function alfresco_services_actions_CopyMoveService__registerSubscriptions() {
         this.alfSubscribe(topics.COPY_OR_MOVE, lang.hitch(this, this.createCopyMoveDialog));
      },

      /**
       * Create a typeDef for the createCopyMoveDialogConfig type used by {@link alfresco/services/ActionService:createCopyMoveDialog}
       *
       * @typedef {Object} createCopyMoveDialogConfig
       * @property [urlPrefix] {String} - The URL prefix for the action
       * @property [dialogTitle] {string} - The title for the dialog
       * @property [confirmButtonLabel] {String} - The label for the confirmation button
       * @property [singleItemMode] {Bool} - {@link alfresco/pickers/PickedItems:singleItemMode}
       */

      /* This function handles the creation of dialogs for both copy and move actions because
       * they are identical apart from the config object (which can be optionally passed in).
       * It defaults to copy mode if missing.
       *
       * @instance
       * @param {object} payload The action payload
       * @param {object} documents The documents selected for copy or move
       * @param {createCopyMoveDialogConfig} [config] The config object.
       * @fires module:alfresco/core/topics#CREATE_DIALOG
       */
      createCopyMoveDialog: function alfresco_services_ActionService__createCopyMoveDialog(payload) {
         var documents = payload.documents || [];

         var urlPrefix = payload.copy ? this.copyAPI : this.moveAPI, // Default to copy API.
             propertyType = payload.copy ? "copyTo" : "moveTo",
             dialogTitle = payload.dialogTitle || "services.ActionService." + propertyType + ".title", // Default to copy title
             confirmButtonLabel = payload.confirmButtonLabel || "services.ActionService." + propertyType + ".ok", // Default to copy confirmation
             singleItemMode = payload.singleItemMode !== false;

         var responseTopic = this.generateUuid() + "_ALF_MOVE_LOCATION_PICKED",
            nodes = NodeUtils.nodeRefArray(documents),
            publishPayload = {
               nodes: nodes,
               documents: documents,
               responseScope: payload.alfResponseScope
            };
         var createLinkButtonLabel = payload.createLinkButtonLabel || "services.ActionService.createLink",
             createLinkResponseTopic = this.generateUuid() + "_ALF_CREATE_LINK_LOCATION_PICKED",
             createLinkPublishPayload = {
                nodes: nodes,
                documents: documents,
                responseScope: payload.alfResponseScope
             };

         var firstFileName = documents.length ? documents[0].fileName : null;
         var fileName = (nodes.length === 1 && firstFileName) ? firstFileName : this.message("services.ActionService.copyMoveTo.multipleFiles");
         this._actionHandles = [
             this.alfSubscribe(responseTopic, lang.hitch(this, this.onLocationSelected, urlPrefix, payload.copy, this.performAction), true),
             this.alfSubscribe(createLinkResponseTopic, lang.hitch(this, this.onLocationSelected, urlPrefix, payload.copy, this.performCreateLinkAction), true)
          ];

         this.alfPublish(topics.CREATE_DIALOG, {
            dialogId: "ALF_COPY_MOVE_DIALOG",
            dialogTitle: this.message(dialogTitle, { 0: fileName}),
            handleOverflow: false,
            widgetsContent: [
               {
                  name: "alfresco/pickers/ContainerPicker",
                  config: {
                     singleItemMode: singleItemMode,
                     generatePubSubScope: true,
                     repoNodeRef: this.repoNodeRef || "alfresco://company/home",
                     supportLinkCreation : this.supportLinkCreation
                  }
               }
            ],
            widgetsButtons: [
               {
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: createLinkButtonLabel,
                     publishTopic: createLinkResponseTopic,
                     publishPayload: createLinkPublishPayload,
                     disableOnInvalidControls: true,
                     validTopic: "ALF_PICKER_VALID",
                     invalidTopic: "ALF_PICKER_INVALID",
                     additionalCssClasses: "call-to-action",
                     visibilityConfig: {
                        initialValue: this.supportLinkCreation && payload.copy
                     }
                  }
               },
               {
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: confirmButtonLabel,
                     publishTopic: responseTopic,
                     publishPayload: publishPayload,
                     disableOnInvalidControls: true,
                     validTopic: "ALF_PICKER_VALID",
                     invalidTopic: "ALF_PICKER_INVALID",
                     additionalCssClasses: "call-to-action"
                  }
               },
               {
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: "picker.cancel.label",
                     publishTopic: "NO_OP"
                  }
               }
            ]
         }, true);
      },

      /**
       * Handles the actual copy,move or create link XHR call
       *
       * @instance
       * @param {string} urlPrefix The specific URL prefix to use for the action (e.g. either move or copy)
       * @param {boolean} copy A boolean indicating if this is a copy action or not
       * @param {object} payload The payload from confirmation of the action dialog
       * @param {function} function to call: create link or copy/move
       */
      onLocationSelected: function alfresco_services_ActionService__onLocationSelected(urlPrefix, copy, actionToCall, payload) {
         this.alfUnsubscribeSaveHandles(this._actionHandles);

         // Get the locations to copy/move/create link to and the documents to them...
         if (payload.dialogContent)
         {
            when(payload.dialogContent, lang.hitch(this, function(content) {
               if (content && content.length)
               {
                  var locations = lang.getObject("pickedItemsWidget.currentData.items", false, content[0]);
                  var documents = lang.getObject("documents", false, payload);
                  if (!locations || locations.length === 0)
                  {
                     this.alfLog("error", "copyMoveTarget not specified");
                  }
                  else if (!documents || documents.length === 0)
                  {
                     this.alfLog("error", "Documents to copy/move not specified.");
                  }
                  else
                  {
                     var nodeRefs = NodeUtils.nodeRefArray(documents);
                     array.forEach(locations, lang.hitch(this, actionToCall, nodeRefs, urlPrefix, copy, payload.alfResponseScope));
                  }
               }
            }));
         }
      },

      /**
       * Makes an XHR call to move or copy the selected documents to the location provided.
       *
       * @instance
       * @param {array} nodeRefs An array of the nodes to move or copy
       * @param {string} urlPrefix The prefix to use in the action URL
       * @param {boolean} copy A boolean indicating if this is a copy action or not
       * @param {array} location  The location to move or copy the documents to
       */
      performAction: function alfresco_services_actions_CopyMoveService__performAction(nodeRefs, urlPrefix, copy, responseScope, location) {
         var responseTopic = this.generateUuid();
         var successSubscription = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onActionSuccess), true);
         var failureSubscription = this.alfSubscribe(responseTopic + "_FAILURE", lang.hitch(this, this.onActionFailure), true);
         this.serviceXhr({
            alfTopic: responseTopic,
            subscriptionHandles: [successSubscription,failureSubscription],
            copy: copy,
            responseScope: responseScope,
            url: AlfConstants.PROXY_URI + urlPrefix + location.nodeRef.replace("://", "/"),
            method: "POST",
            data: {
               nodeRefs: nodeRefs,
               parentId: location
            }
         });
      },

      /**
       * Makes an XHR call to create links for the selected documents to the location provided.
       *
       * @instance
       * @param {array} nodeRefs An array of the nodes to create links for
       * @param {string} urlPrefix The prefix to use in the action URL
       * @param {boolean} copy A boolean indicating if this is a copy action or not
       * @param {array} location  The location where links will be created
       * @since 1.0.92
       */
      performCreateLinkAction: function alfresco_services_actions_CopyMoveService__performCreateLinkAction(nodeRefs, urlPrefix, copy, responseScope, location) {
         var responseTopic = this.generateUuid();
         var successSubscription = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onCreateLinkActionSuccess), true);
         var failureSubscription = this.alfSubscribe(responseTopic + "_FAILURE", lang.hitch(this, this.onCreateLinkActionFailure), true);
         this.serviceXhr({
            alfTopic: responseTopic,
            subscriptionHandles: [successSubscription,failureSubscription],
            responseScope: responseScope,
            url: AlfConstants.PROXY_URI +  this.createLinkAPI + location.nodeRef.replace("://", "/"),
            method: "POST",
            data: {
               destinationNodeRef: location.nodeRef,
               multipleFiles: nodeRefs
            }
         });
      },


      /**
       * Handles successful actions in one of two ways. When an attempt is made to move or copy more than one node
       * it is possible that only some of the nodes will be moved/copied successfully. If all the nodes were moved or
       * copied successfully then a simple notification is displayed indicating a successful action was completed, however
       * if a partial success was reported then a prompt is displayed listing the nodes that could not be copied or moved.
       *
       * @instance
       * @param {object} payload
       * @fires module:alfresco/core/topics#DISPLAY_NOTIFICATION
       * @fires module:alfresco/core/topics#DISPLAY_PROMPT
       * @fires module:alfresco/core/topics#RELOAD_DATA_TOPIC
       */
      onActionSuccess: function alfresco_services_actions_CopyMoveService__onActionSuccess(payload) {
         // jshint unused:false, maxcomplexity:false
         var subscriptionHandles = lang.getObject("requestConfig.subscriptionHandles", false, payload);
         if (subscriptionHandles)
         {
            this.alfUnsubscribeSaveHandles(subscriptionHandles);
         }
         if (payload.response.successCount === 0)
         {
            // See AKU-1068 - total failure returned as success...
            var failureMessage;
            if (payload.requestConfig.copy)
            {
               failureMessage = payload.response.totalResults === 1 ? "copyMoveService.copy.failure" : "copyMoveService.copy.multiple.failure";
            }
            else
            {
               failureMessage = payload.response.totalResults === 1 ? "copyMoveService.move.failure" : "copyMoveService.move.multiple.failure";
            }

            this.alfServicePublish(topics.DISPLAY_PROMPT, {
               title: payload.requestConfig.copy ? this.message("copyMoveService.copy.failure.title") : this.message("copyMoveService.move.failure.title"),
               message: this.message(failureMessage)
            });
         }
         else if (payload.response.overallSuccess === true)
         {
            this.alfServicePublish(topics.DISPLAY_NOTIFICATION, {
               message: payload.requestConfig.copy ? this.message("copyMoveService.copy.completeSuccess") : this.message("copyMoveService.move.completeSuccess")
            });
         }
         else
         {
            var failures = "";
            array.forEach(payload.response.results, function(result) {
               if (!result.success)
               {
                  failures += result.id + ", ";
               }
            });
            if (failures.length > 2)
            {
               failures = failures.substring(0, failures.length - 2);
            }
            var messageKey = payload.requestConfig.copy ? "copyMoveService.copy.multiple.failure" : "copyMoveService.move.multiple.failure";
            var message = this.message(messageKey);
            this.alfPublish(topics.DISPLAY_PROMPT, {
               title: payload.requestConfig.copy ? this.message("copyMoveService.copy.failure.title") : this.message("copyMoveService.move.failure.title"),
               message: message
            });
         }
         this.alfPublish(topics.RELOAD_DATA_TOPIC, {}, false, false, payload.requestConfig.responseScope);
      },

      /**
       * Handles successful actions. When an attempt is made to create link to more than one node it is possible that
       * only for some of the nodes it will be created successfully. If for all the nodes the link was created
       * successfully then a simple notification is displayed indicating a successful action was completed, or partial
       * completed.
       *
       * @instance
       * @param {object} payload
       * @fires module:alfresco/core/topics#DISPLAY_NOTIFICATION
       * @fires module:alfresco/core/topics#DISPLAY_PROMPT
       * @fires module:alfresco/core/topics#RELOAD_DATA_TOPIC
       * @since 1.0.92
       */
      onCreateLinkActionSuccess: function alfresco_services_actions_CopyMoveService__onCreateLinkActionSuccess(payload) {
         // jshint unused:false
         var subscriptionHandles = lang.getObject("requestConfig.subscriptionHandles", false, payload);
         if (subscriptionHandles)
         {
            this.alfUnsubscribeSaveHandles(subscriptionHandles);
         }
         if (payload.response.successCount === 0)
         {
            // See AKU-1068 - total failure returned as success...
            var failureMessage;
            failureMessage = payload.response.failureCount === 1 ? "copyMoveService.createLink.failure" : "copyMoveService.createLink.multiple.failure";

            this.alfServicePublish(topics.DISPLAY_PROMPT, {
               title: this.message("copyMoveService.createLink.failure.title"),
               message: this.message(failureMessage)
            });
         }
         else if (payload.response.overallSuccess === "true")
         {
            this.alfServicePublish(topics.DISPLAY_NOTIFICATION, {
               message: this.message("copyMoveService.createLink.completeSuccess")
            });
         }
         this.alfPublish(topics.RELOAD_DATA_TOPIC, {}, false, false, payload.requestConfig.responseScope);
      },

      /**
       * Handles failed actions by displaying a notification indicating that the action was not successful.
       *
       * @instance
       * @param {object} payload
       * @fires module:alfresco/core/topics#DISPLAY_PROMPT
       */
      onActionFailure: function alfresco_services_actions_CopyMoveService__onActionFailure(payload) {
         // jshint unused:false
         // TODO: Not all success is success. Need to check response.overallSuccess rather than just response status.
         var subscriptionHandles = lang.getObject("requestConfig.subscriptionHandles", false, payload);
         if (subscriptionHandles)
         {
            this.alfUnsubscribeSaveHandles(subscriptionHandles);
         }
         this.alfServicePublish(topics.DISPLAY_PROMPT, {
            title: payload.requestConfig.copy ? this.message("copyMoveService.copy.failure.title") : this.message("copyMoveService.move.failure.title"),
            message: payload.requestConfig.copy ? this.message("copyMoveService.copy.failure") : this.message("copyMoveService.move.failure")
         });
      },

      /**
       * Handles failed actions by displaying a notification indicating that the action was not successful.
       *
       * @instance
       * @param {object} payload
       * @fires module:alfresco/core/topics#DISPLAY_PROMPT
       * @since 1.0.92
       */
      onCreateLinkActionFailure: function alfresco_services_actions_CopyMoveService__onCreateLinkActionFailure(payload) {
         // jshint unused:false
         var subscriptionHandles = lang.getObject("requestConfig.subscriptionHandles", false, payload);
         if (subscriptionHandles)
         {
            this.alfUnsubscribeSaveHandles(subscriptionHandles);
         }
         this.alfServicePublish(topics.DISPLAY_PROMPT, {
            title: this.message("copyMoveService.createLink.failure.title"),
            message: this.message("copyMoveService.createLink.failure")
         });
      }
   });
});
