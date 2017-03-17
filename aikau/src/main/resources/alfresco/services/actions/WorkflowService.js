/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * This service handles requests to either approve or reject a simple workflow action. It is written to handle
 * both Alfresco Share configured actions, but can be used independently for simple workflow handling in 
 * other application contexts.
 *
 * @module alfresco/services/actions/WorkflowService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @mixes module:alfresco/core/UrlUtilsMixin
 * @mixes module:alfresco/services/_NavigationServiceTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/core/UrlUtilsMixin",
        "alfresco/core/topics",
        "alfresco/enums/urlTypes",
        "alfresco/services/_NavigationServiceTopicMixin",
        "service/constants/Default",
        "dojo/_base/lang",
        "dojo/_base/array",
        "alfresco/core/NodeUtils"],
        function(declare, BaseService, AlfCoreXhr, UrlUtilsMixin, topics, urlTypes, _NavigationServiceTopicMixin, AlfConstants, lang, array, NodeUtils) {

   return declare([BaseService, AlfCoreXhr, UrlUtilsMixin, _NavigationServiceTopicMixin], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/WorkflowService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/WorkflowService.properties"}],

      /**
       * The notificatio message to display when a simple workflow is successfully approved. This
       * will be displayed unless the approval request publication payload is configured with an action
       * attribute containing a specific "successMessage" value.
       * 
       * @instance
       * @type {string}
       * @default
       */
      approveSuccessMessage: "message.simple-workflow.approved",

      /**
       * The notificatio message to display when a simple workflow cannot be approved. This
       * will be displayed unless the approval request publication payload is configured with an action
       * attribute containing a specific "failureMessage" value.
       * 
       * @instance
       * @type {string}
       * @default
       */
      approveFailureMessage: "message.simple-workflow.failure",

      /**
       * The notificatio message to display when a simple workflow is successfully rejected. This
       * will be displayed unless the reject request publication payload is configured with an action
       * attribute containing a specific "successMessage" value.
       * 
       * @instance
       * @type {string}
       * @default
       */
      rejectSuccessMessage: "message.simple-workflow.rejected",

      /**
       * The notificatio message to display when a simple workflow cannot be rejected. This
       * will be displayed unless the reject request publication payload is configured with an action
       * attribute containing a specific "failureMessage" value.
       * 
       * @instance
       * @type {string}
       * @default
       */
      rejectFailureMessage: "message.simple-workflow.failure",

      /**
       * 
       * @instance
       * @type {string}
       * @default
       */
      startWorkflowPage: "start-workflow",

      /**
       * @instance
       * @since 1.0.32
       *
       * @listens module:alfresco/core/topics#ASSIGN_WORKFLOW
       */
      registerSubscriptions: function alfresco_services_actions_WorkflowService__registerSubscriptions() {
         this.alfSubscribe("ALF_APPROVE_SIMPLE_WORKFLOW", lang.hitch(this, this.onApproveSimpleWorkflow));
         this.alfSubscribe("ALF_REJECT_SIMPLE_WORKFLOW", lang.hitch(this, this.onRejectSimpleWorkflow));
         this.alfSubscribe(topics.ASSIGN_WORKFLOW, lang.hitch(this, this.onAssignWorkflow));
      },

      /**
       * 
       * @instance
       * @param  {object} payload The payload containing the node to assign a workflow to.
       */
      onAssignWorkflow: function alfresco_services_actions_WorkflowService__onAssignWorkflow(payload) {
         if (payload && payload.nodes)
         {
            var nodeRefs = NodeUtils.nodeRefsString(payload.nodes);
            var postBody =
            {
               selectedItems: nodeRefs,
               destination: window.location.toString()
            };

            var url = this.buildUrl(this.startWorkflowPage, null);
            this.alfPublish(this.postToPageTopic, {
               method: "POST",
               type: urlTypes.FULL_PATH,
               url: url,
               target: payload.currentTarget || this.currentTarget,
               parameters: postBody
            });
         }
      },

      /**
       * 
       * @instance
       * @param {object} payload The payload containing the details of the workflow to approve
       */
      onApproveSimpleWorkflow: function alfresco_services_actions_WorkflowService__onApproveSimpleWorkflow(payload) {
         if (payload && payload.items)
         {
            array.forEach(payload.items, lang.hitch(this, this.performAction, "accept-simpleworkflow", this.onApproveSuccess, this.onApproveFailure, payload));
         }
      },

      /**
       * 
       * @instance
       * @param {object} payload The payload containing the details of the workflow to reject
       */
      onRejectSimpleWorkflow: function alfresco_services_actions_WorkflowService__onRejectSimpleWorkflow(payload) {
         if (payload && payload.items)
         {
            array.forEach(payload.items, lang.hitch(this, this.performAction, "reject-simpleworkflow", this.onRejectSuccess, this.onRejectFailure, payload));
         }
      },

      /**
       * Makes an XHR call to perform the approve or reject action.
       * 
       * @instance
       * @param {string} actionName The name of the action to perform
       * @param {function} successCallback The callback function to use if the action completes successfully
       * @param {function} failureCallback The callback function to use if the action fails to complete
       * @param {object} action Additional action configuration. This can be included to override success and failure messages
       * @param {object} item The item to perform the action on. This is expecte to have a "nodeRef" attribute.
       */
      performAction: function alfresco_services_actions_WorkflowService__performAction(actionName, successCallback, failureCallback, payload, item) {
         this.serviceXhr({
            url: AlfConstants.PROXY_URI + "api/actionQueue",
            method: "POST",
            action: actionName,
            responseScope: payload.alfResponseScope,
            data: {
               actionedUponNode: item.nodeRef,
               actionDefinitionName: actionName
            },
            successCallback: successCallback,
            failureCallback: failureCallback
         });
      },

      /**
       * Called when an approval was completed successfully.
       * 
       * @instance
       * @param {object} response
       * @param {object} originalRequestConfig The configuration used for the XHR request
       * @fires module:alfresco/core/topics#DISPLAY_NOTIFICATION
       */
      onApproveSuccess: function alfresco_services_actions_WorkflowService__onApproveSuccess(response, originalRequestConfig) {
         var message = lang.getObject("requestConfig.action.successMessage", false, response);
         this.alfServicePublish(topics.DISPLAY_NOTIFICATION, {
            message: this.message(message || this.approveSuccessMessage)
         });
         this.alfPublish("ALF_DOCLIST_RELOAD_DATA", {}, false, false, originalRequestConfig.responseScope);
      },

      /**
       * Called when an approval could not be completed.
       * 
       * @instance
       * @param {object} response
       * @fires module:alfresco/core/topics#DISPLAY_NOTIFICATION
       */
      onApproveFailure: function alfresco_services_actions_WorkflowService__onApproveFailure(response) {
         var message = lang.getObject("requestConfig.action.failureMessage", false, response);
         this.alfServicePublish(topics.DISPLAY_NOTIFICATION, {
            message: this.message(message || this.approveFailureMessage)
         });
      },

      /**
       * Called when a rejection was completed successfully.
       * 
       * @instance
       * @param {object} response
       * @param {object} originalRequestConfig The configuration used for the XHR request
       * @fires module:alfresco/core/topics#DISPLAY_NOTIFICATION
       */
      onRejectSuccess: function alfresco_services_actions_WorkflowService__onRejectSuccess(response, originalRequestConfig) {
         var message = lang.getObject("requestConfig.action.successMessage", false, response);
         this.alfServicePublish(topics.DISPLAY_NOTIFICATION, {
            message: this.message(message || this.rejectSuccessMessage)
         });
         this.alfPublish("ALF_DOCLIST_RELOAD_DATA", {}, false, false, originalRequestConfig.responseScope);
      },

      /**
       * Called when a rejection could not be completed.
       * 
       * @instance
       * @param {object} response
       * @fires module:alfresco/core/topics#DISPLAY_NOTIFICATION
       */
      onRejectFailure: function alfresco_services_actions_WorkflowService__onRejectFailure(response) {
         var message = lang.getObject("requestConfig.action.failureMessage", false, response);
         this.alfServicePublish(topics.DISPLAY_NOTIFICATION, {
            message: this.message(message || this.rejectFailureMessage)
         });
      }
   });
});