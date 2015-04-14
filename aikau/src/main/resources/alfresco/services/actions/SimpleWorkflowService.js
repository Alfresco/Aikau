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
 * This service handles requests to either approve or reject a simple workflow action. It is written to handle
 * both Alfresco Share configured actions, but can be used independently for simple workflow handling in 
 * other application contexts.
 *
 * @module alfresco/services/actions/SimpleWorkflowService
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "service/constants/Default",
        "dojo/_base/lang",
        "dojo/_base/array"],
        function(declare, AlfCore, AlfCoreXhr, AlfConstants, lang, array) {

   return declare([AlfCore, AlfCoreXhr], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/SimpleWorkflowService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/SimpleWorkflowService.properties"}],

      /**
       * The notificatio message to display when a simple workflow is successfully approved. This
       * will be displayed unless the approval request publication payload is configured with an action
       * attribute containing a specific "successMessage" value.
       * 
       * @instance
       * @type {string}
       * @default "message.simple-workflow.approved"
       */
      approveSuccessMessage: "message.simple-workflow.approved",

      /**
       * The notificatio message to display when a simple workflow cannot be approved. This
       * will be displayed unless the approval request publication payload is configured with an action
       * attribute containing a specific "failureMessage" value.
       * 
       * @instance
       * @type {string}
       * @default "message.simple-workflow.failure"
       */
      approveFailureMessage: "message.simple-workflow.failure",

      /**
       * The notificatio message to display when a simple workflow is successfully rejected. This
       * will be displayed unless the reject request publication payload is configured with an action
       * attribute containing a specific "successMessage" value.
       * 
       * @instance
       * @type {string}
       * @default "message.simple-workflow.rejected"
       */
      rejectSuccessMessage: "message.simple-workflow.rejected",

      /**
       * The notificatio message to display when a simple workflow cannot be rejected. This
       * will be displayed unless the reject request publication payload is configured with an action
       * attribute containing a specific "failureMessage" value.
       * 
       * @instance
       * @type {string}
       * @default "message.simple-workflow.failure"
       */
      rejectFailureMessage: "message.simple-workflow.failure",

      /**
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_services_actions_SimpleWorkflowService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("ALF_APPROVE_SIMPLE_WORKFLOW", lang.hitch(this, this.onApproveSimpleWorkflow));
         this.alfSubscribe("ALF_REJECT_SIMPLE_WORKFLOW", lang.hitch(this, this.onRejectSimpleWorkflow));
      },

      /**
       * 
       * @instance
       * @param {object} payload The payload containing the details of the workflow to approve
       */
      onApproveSimpleWorkflow: function alfresco_services_actions_SimpleWorkflowService__onApproveSimpleWorkflow(payload) {
         if (payload && payload.items)
         {
            array.forEach(payload.items, lang.hitch(this, this.performAction, "accept-simpleworkflow", this.onApproveSuccess, this.onApproveFailure, payload.action));
         }
      },

      /**
       * 
       * @instance
       * @param {object} payload The payload containing the details of the workflow to reject
       */
      onRejectSimpleWorkflow: function alfresco_services_actions_SimpleWorkflowService__onRejectSimpleWorkflow(payload) {
         if (payload && payload.items)
         {
            array.forEach(payload.items, lang.hitch(this, this.performAction, "reject-simpleworkflow", this.onRejectSuccess, this.onRejectFailure, payload.action));
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
      performAction: function alfresco_services_actions_SimpleWorkflowService__performAction(actionName, successCallback, failureCallback, action, item) {
         this.serviceXhr({
            url: AlfConstants.PROXY_URI + "api/actionQueue",
            method: "POST",
            action: action,
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
       * @param {object} payload
       */
      onApproveSuccess: function alfresco_services_actions_SimpleWorkflowService__onApproveSuccess(payload) {
         var message = lang.getObject("requestConfig.action.successMessage", false, payload);
         this.alfPublish("ALF_DISPLAY_NOTIFICATION", {
            message: this.message(message || this.approveSuccessMessage)
         });
         this.alfPublish("ALF_DOCLIST_RELOAD_DATA", {});
      },

      /**
       * Called when an approval could not be completed.
       * 
       * @instance
       * @param {object} payload
       */
      onApproveFailure: function alfresco_services_actions_SimpleWorkflowService__onApproveFailure(payload) {
         var message = lang.getObject("requestConfig.action.failureMessage", false, payload);
         this.alfPublish("ALF_DISPLAY_NOTIFICATION", {
            message: this.message(message || this.approveFailureMessage)
         });
      },

      /**
       * Called when a rejection was completed successfully.
       * 
       * @instance
       * @param {object} payload
       */
      onRejectSuccess: function alfresco_services_actions_SimpleWorkflowService__onRejectSuccess(payload) {
         var message = lang.getObject("requestConfig.action.successMessage", false, payload);
         this.alfPublish("ALF_DISPLAY_NOTIFICATION", {
            message: this.message(message || this.rejectSuccessMessage)
         });
         this.alfPublish("ALF_DOCLIST_RELOAD_DATA", {});
      },

      /**
       * Called when a rejection could not be completed.
       * 
       * @instance
       * @param {object} payload
       */
      onRejectFailure: function alfresco_services_actions_SimpleWorkflowService__onRejectFailure(payload) {
         var message = lang.getObject("requestConfig.action.failureMessage", false, payload);
         this.alfPublish("ALF_DISPLAY_NOTIFICATION", {
            message: this.message(message || this.rejectFailureMessage)
         });
      }
   });
});