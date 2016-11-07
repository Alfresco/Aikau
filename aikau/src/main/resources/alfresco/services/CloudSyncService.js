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
 * 
 * @module alfresco/services/CloudSyncService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 * @since 1.0.39
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/core/topics",
        "alfresco/core/NodeUtils",
        "dojo/_base/lang",
        "dojo/_base/array",
        "service/constants/Default"],
        function(declare, BaseService, CoreXhr, topics, NodeUtils, lang, array, AlfConstants) {
   
   return declare([BaseService, CoreXhr], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/CloudSyncService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/CloudSyncService.properties"}],
      
      /**
       * Sets up the subscriptions for the CommentService
       * 
       * @instance
       * @listens module:alfresco/core/topics#CLOUD_AUTHENTICATION_REQUEST
       * @listens module:alfresco/core/topics#GET_CLOUD_PATH
       * @listens module:alfresco/core/topics#GET_CLOUD_SITES
       * @listens module:alfresco/core/topics#GET_CLOUD_TENANTS
       * @listens module:alfresco/core/topics#INIT_CLOUD_SYNC
       * @listens module:alfresco/core/topics#SYNC_TO_CLOUD
       */
      registerSubscriptions: function alfresco_services_CloudSyncService__registerSubscriptions() {
         this.alfSubscribe(topics.CLOUD_AUTHENTICATION_REQUEST, lang.hitch(this, this.onCloudAuthentication));
         this.alfSubscribe(topics.GET_CLOUD_PATH, lang.hitch(this, this.getTenantSitePath));
         this.alfSubscribe(topics.GET_CLOUD_SITES, lang.hitch(this, this.getTenantSiteOptions));
         this.alfSubscribe(topics.GET_CLOUD_TENANTS, lang.hitch(this, this.getTenantOptions));
         this.alfSubscribe(topics.INIT_CLOUD_SYNC, lang.hitch(this, this.onCloudSyncRequest));
         this.alfSubscribe(topics.SYNC_TO_CLOUD, lang.hitch(this, this.onCloudSyncConfirmation));
      },

      /**
       * This is provided for the purpose of generating a list of the tenants that the user has 
       * access to.
       *
       * @instance
       * @param  {object} payload The options request payload
       */
      getTenantOptions: function alfresco_services_CloudSyncService__getTenantOptions(payload) {
         this.serviceXhr({
            url : AlfConstants.PROXY_URI + "cloud/tenant/information",
            method: "GET",
            data: payload,
            successCallback: this.processTenantOptions,
            progressCallback: this.optionsProgress,
            callbackScope: this
         });
      },

      /**
       * Handles progress updates by doing nothing.
       * 
       * @instance
       * @param {object} response
       * @param {object} originalRequestConfig
       * @since 1.0.94
       */
      optionsProgress: function alfresco_services_CloudSyncService__optionsProgress(/*jshint unused:false*/ response, originalRequestConfig) {
         // No action intentionally
      },

      /**
       * This is the success call back for [getTenantOptions]{@link module:alfresco/services/CloudSyncService#getTenantOptions}.
       * It processes the raw data to create an array of the tenants that the user has permission to 
       * sync content to.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      processTenantOptions: function alfresco_services_CloudSyncService__processTenantOptions(response, originalRequestConfig) {
         var options = [];

         // Put the home tenant as the first option...
         var homeTenant = lang.getObject("homeTenant.name", false, response);
         options.push({
            label: homeTenant,
            value: homeTenant
         });

         // Add any secondary tenants that have sync-enabled...
         var secondaryTenants = lang.getObject("secondaryTenants", false, response);
         array.forEach(secondaryTenants, function(secondaryTenant) {
            if (secondaryTenant.isSyncEnabled)
            {
               options.push({
                  value: secondaryTenant.name
               });
            }
         });

         // Publish the options back to the originating request...
         this.alfPublish(originalRequestConfig.data.alfResponseTopic, {
            requestConfig: originalRequestConfig,
            response: options
         }, false, false, originalRequestConfig.data.alfResponseScope);
      },

      /**
       * This is provided for the purpose of generating a list of the sites on a particular tenant
       * that the user has access to.
       *
       * @instance
       * @param  {object} payload The options request payload
       */
      getTenantSiteOptions: function alfresco_services_CloudSyncService__getTenantOptions(payload) {
         if (payload.username && payload.remoteTenantId)
         {
            this.serviceXhr({
               url : AlfConstants.PROXY_URI + "cloud/people/" + payload.username + "/sites?network=" + payload.remoteTenantId,
               method: "GET",
               alfTopic: payload.alfResponseTopic,
               alfResponseScope: payload.alfResponseScope,
               data: payload
            });
         }
         else
         {
            this.alfLog("warn", "A request was made to retrieve Cloud sites, but either a 'userid' or a 'network' were missing", payload, this);
         }
      },

      /**
       * This is provided for the purpose of retrieving path tree data for a particular site on a particular
       * tenant.
       *
       * @instance
       * @param  {object} payload The options request payload
       */
      getTenantSitePath: function alfresco_services_CloudSyncService__getTenantSitePath(payload) {
         if (payload.remoteSiteId && payload.remoteTenantId)
         {
            this.serviceXhr({
               url : AlfConstants.PROXY_URI + "cloud/doclib/treenode/site/" + payload.remoteSiteId + "/documentLibrary" + payload.path + "?children=true&max=-1&network=" + payload.remoteTenantId,
               method: "GET",
               alfTopic: payload.alfResponseTopic,
               alfResponseScope: payload.alfResponseScope,
               data: payload
            });
         }
         else
         {
            this.alfLog("warn", "A request was made to retrieve Cloud sites, but either a 'userid' or a 'network' were missing", payload, this);
         }
      },

      /**
       * This processes requests to authenticate a user against the cloud. The payload provided
       * is expected to contain "username" and "password" attributes to perform the authentication with.
       *
       * @instance
       * @param  {object} payload The authentication payload object
       */
      onCloudAuthentication: function alfresco_services_CloudSyncService__onCloudAuthentication(payload) {
         this.serviceXhr({
            url: AlfConstants.PROXY_URI + "cloud/person/credentials",
            method: "POST",
            data: payload,
            successCallback: this.onCloudAuthenticationSuccess,
            failureCallback: this.onCloudAuthenticationFailure,
            callbackScope: this
         });
      },

      /**
       * This is the success call back for [onCloudAuthentication]{@link module:alfresco/services/CloudSyncService#onCloudAuthentication}. 
       * It processes the result to get the authenticated user name and the requested nodes to sync and
       * then calls [showCloudLocationPicker]{@link module:alfresco/services/CloudSyncService#showCloudLocationPicker}.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       * @fires module:alfresco/core/topics#CLOUD_AUTHENTICATION_SUCCESS
       */
      onCloudAuthenticationSuccess: function alfresco_services_CloudSyncService__onCloudAuthenticationSuccess(response, originalRequestConfig) {
         this.alfLog("log", "Authentication success", response, originalRequestConfig);
         this.alfServicePublish(topics.CLOUD_AUTHENTICATION_SUCCESS);

         // Get the nodes to sync (these should have been passed through right from the original request)...
         var nodes = lang.getObject("data.nodes", false, originalRequestConfig);
         var username = lang.getObject("data.username", false, originalRequestConfig);
         var password = lang.getObject("data.password", false, originalRequestConfig);
         if (nodes && username && password)
         {
            // Display picker...
            this.showCloudLocationPicker({
               nodes: nodes,
               username: username,
               password: password 
            });
         }
         else
         {
            this.alfLog("warn", "One or more of 'nodes', 'username' or 'password' was not provided in the authenticated sync request", response, originalRequestConfig, this);
         }
      },

      /**
       * This is the failure call back for [onCloudAuthentication]{@link module:alfresco/services/CloudSyncService#onCloudAuthentication}. 
       * It publishes a request to display a prompt to indicate to the user that authentication was not successful.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       * @fires module:alfresco/core/topics#DISPLAY_PROMPT
       */
      onCloudAuthenticationFailure: function alfresco_services_CloudSyncService__onCloudAuthenticationFailure(response, originalRequestConfig) {
         this.alfLog("error", "Authentication failure", response, originalRequestConfig);
         this.alfServicePublish(topics.DISPLAY_PROMPT, {
            title: this.message("cloud-auth.dialog.auth.error.title"),
            message: this.message("cloud-auth.dialog.auth.error.message")
         });
      },

      /**
       * This is the function that is called to actually put the sync in place.
       * 
       * @instance
       * @param  {object} payload The payload containing the details of the sync to create.
       */
      onCloudSyncConfirmation: function alfresco_services_CloudSyncService__onCloudSyncConfirmation(payload) {
         this.serviceXhr({
            url: AlfConstants.PROXY_URI + "enterprise/sync/syncsetdefinitions",
            method: "POST",
            data: payload,
            successCallback: this.onCloudSyncSuccess,
            failureCallback: this.onCloudSyncFailure,
            callbackScope: this
         });
      },

      /**
       * This is the success call back for [onCloudSyncConfirmation]{@link module:alfresco/services/CloudSyncService#onCloudSyncConfirmation}. 
       * It publishes a topic indicating success so that the sync dialog can be closed.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       * @fires module:alfresco/core/topics#SYNC_TO_CLOUD_SUCCESS
       */
      onCloudSyncSuccess: function alfresco_services_CloudSyncService__onCloudSyncSuccess(response, originalRequestConfig) {
         // jshint unused:false
         this.alfServicePublish(topics.SYNC_TO_CLOUD_SUCCESS);
      },

      /**
       * Handles Cloud sync failures by publishing a request to display a failure notification prompt.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       * @fires module:alfresco/core/topics#DISPLAY_PROMPT
       */
      onCloudSyncFailure: function alfresco_services_CloudSyncService__onCloudSyncFailure(response, originalRequestConfig) {
         this.alfLog("error", "Could not create cloud sync", response, originalRequestConfig, this);
         this.alfServicePublish(topics.DISPLAY_PROMPT, {
            message: this.message("cloud-sync-failure.message")
         });
      },

      /**
       * This makes a request to the Alfresco Repository to see if the current user is authenticated against
       * the Alfresco Cloud. Assuming that the Alfresco Repository is available then the 
       * [onCloudAuthenticationReponse]{@link module:alfresco/services/CloudSyncService#onCloudAuthenticationReponse}
       * function will always be called as the result (this will then determine whether or not the user needs
       * to provide Alfresco Cloud credentials or just select a location to sync with).
       * 
       * @instance
       * @param {object} payload The payload for the sync request
       */
      onCloudSyncRequest: function alfresco_services_CloudSyncService__onCloudSyncRequest(/*jshint unused:false*/ payload) {
         this.serviceXhr({
            url: AlfConstants.PROXY_URI + "cloud/person/credentials",
            method: "GET",
            data: payload,
            successCallback: this.onCloudAuthenticationReponse,
            failureCallback: this.onCloudAuthenticationResponseFailure,
            callbackScope: this
         });
      },

      /**
       * This is the callback for the XHR request made from the 
       * [onCloudSyncRequest]{@link module:alfresco/services/CloudSyncService#onCloudSyncRequest} function.
       * This will be called regardless of whether or not the current user is authenticated (as even if the
       * user is not authenticated then an HTTP status code of 200 will be returned). If the response indicates
       * that the user is not authenticated then a dialog will be shown to allow the user to authenticate.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       * @fires module:alfresco/services/DialogService#ALF_CREATE_FORM_DIALOG_REQUEST
       */
      onCloudAuthenticationReponse: function alfresco_services_CloudSyncService__onCloudAuthenticationReponse(response, originalRequestConfig) {
         var known = lang.getObject("known", false, response);
         if (known === false) 
         {
            // Publish authentication dialog
            this.alfServicePublish(topics.CREATE_FORM_DIALOG, {
               dialogId: "ALF_CLOUD_AUTHENTICATION_DIALOG",
               dialogTitle: "cloud-auth.dialog.title",
               dialogCloseTopic: topics.CLOUD_AUTHENTICATION_SUCCESS,
               formSubmissionTopic: topics.CLOUD_AUTHENTICATION_REQUEST,
               formSubmissionGlobal: true,
               formSubmissionPayloadMixin: originalRequestConfig.data,
               showValidationErrorsImmediately: false,
               widgets: this.widgetsForAuthenticationDialog
            });
         }
         else
         {
            // Show a dialog to select the location to sync to
            originalRequestConfig.data.username = response.username;
            this.showCloudLocationPicker(originalRequestConfig.data);
         }
      },

      /**
       * This is the failure callback for the XHR request made from the 
       * [onCloudSyncRequest]{@link module:alfresco/services/CloudSyncService#onCloudSyncRequest} function.
       * It will only be called when the request fails (e.g. because the server cannot be reached) rather than
       * the user not being authenticated.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       * @fires module:alfresco/core/topics#DISPLAY_PROMPT
       */
      onCloudAuthenticationReponseFailure: function alfresco_services_CloudSyncService__onCloudAuthenticationReponseFailure(/*jshint unused:false*/ response, originalRequestConfig) {
         this.alfServicePublish(topics.DISPLAY_PROMPT, {
            message: this.message("cloud-auth.connection.message")
         });
      },

      /**
       * Publishes a request to show a form [dialog]{@link module:alfresco/dialogs/AlfDialog} containing the 
       * the [widgetsForSyncDialog]{@link module:alfresco/services/CloudSyncService#widgetsForSyncDialog}
       * model.
       * 
       * @instance
       * @param {object} data The data about the nodes requested to be sync'd
       * @fires module:alfresco/services/DialogService#ALF_CREATE_FORM_DIALOG_REQUEST
       */
      showCloudLocationPicker: function alfresco_services_CloudSyncService__showCloudLocationPicker(data) {
         if (data && data.nodes)
         {
            // Get the nodeRefs from the selected nodes...
            var memberNodeRefs = NodeUtils.nodeRefArray(data.nodes);
         
            // Set an appropriate dialog title - if we're sync'ing just a single node then
            // we can include its displayName in the dialog title otherwise just use a generic title...
            var dialogTitle = this.message("cloud-sync.dialog.multiple.title");
            if (data.nodes.length === 1)
            {
               var displayName = data.nodes[0].displayName;
               dialogTitle = this.message("cloud-sync.dialog.single.title", {
                  0: displayName
               });
            }

            this.alfServicePublish(topics.CREATE_FORM_DIALOG, {
               dialogId: "ALF_CLOUD_SYNC_DIALOG",
               dialogTitle: dialogTitle,
               dialogCloseTopic: topics.SYNC_TO_CLOUD_SUCCESS,
               formSubmissionTopic: topics.SYNC_TO_CLOUD,
               formSubmissionGlobal: true,
               formSubmissionPayloadMixin: {
                  memberNodeRefs: memberNodeRefs
               },
               formValue: {
                  username: data.username
               },
               showValidationErrorsImmediately: false,
               widgets: this.widgetsForSyncDialog
            });
         }
         else
         {
            this.alfLog("warn", "No nodes provided to sync to the cloud", data, this);
         }
      },

      /**
       * This is the widget model that will be use for the authentication dialog.
       * 
       * @instance
       */
      widgetsForAuthenticationDialog: [
         {
            id: "CLOUD_AUTH_USERNAME",
            name: "alfresco/forms/controls/TextBox",
            config: {
               fieldId: "CLOUD_AUTH_USERNAME",
               name: "username",
               label: "cloud-auth.dialog.cloud-email.label",
               requirementConfig: {
                  initialValue: true
               }
            }
         },
         {
            id: "CLOUD_AUTH_PASSWORD",
            name: "alfresco/forms/controls/Password",
            config: {
               fieldId: "CLOUD_AUTH_PASSWORD",
               name: "password",
               label: "cloud-auth.dialog.cloud-password.label",
               requirementConfig: {
                  initialValue: true
               }
            }
         }
      ],

      /**
       * This is the widget model that will be use for the creating the sync.
       * 
       * @instance
       */
      widgetsForSyncDialog: [
         {
            id: "CLOUD_SYNC_USERNAME",
            name: "alfresco/forms/controls/TextBox",
            config: {
               fieldId: "CLOUD_SYNC_USERNAME",
               name: "username",
               label: "User name",
               visibilityConfig: {
                  initialValue: false
               }
            }
         },
         {
            id: "CLOUD_SYNC_TENANT",
            name: "alfresco/forms/controls/FilteringSelect",
            config: {
               fieldId: "CLOUD_SYNC_TENANT",
               name: "remoteTenantId",
               label: "cloud-sync.dialog.network.label",
               optionsConfig: {
                  queryAttribute: "value",
                  labelAttribute: "value",
                  valueAttribute: "value",
                  publishTopic: topics.GET_CLOUD_TENANTS,
                  publishPayload: {
                     resultsProperty: "response"
                  }
               }
            }
         },
         {
            id: "CLOUD_SYNC_SITE",
            name: "alfresco/forms/controls/FilteringSelect",
            config: {
               fieldId: "CLOUD_SYNC_SITE",
               name: "remoteSiteId",
               label: "cloud-sync.dialog.site.label",
               optionsConfig: {
                  changesTo: [
                     {
                        targetId: "CLOUD_SYNC_USERNAME"
                     },
                     {
                        targetId: "CLOUD_SYNC_TENANT"
                     }
                  ],
                  queryAttribute: "title",
                  labelAttribute: "title",
                  valueAttribute: "shortName",
                  publishTopic: topics.GET_FORM_VALUE_DEPENDENT_OPTIONS,
                  publishPayload: {
                     publishTopic: topics.GET_CLOUD_SITES,
                     resultsProperty: "response"
                  },
                  publishGlobal: false
               }
            }
         },
         {
            id: "CLOUD_SYNC_CONTAINER",
            name: "alfresco/forms/controls/Tree",
            config: {
               fieldId: "CLOUD_SYNC_CONTAINER",
               name: "targetFolderNodeRef",
               label: "cloud-sync.dialog.path.label",
               valueProperty: "nodeRef",
               optionsConfig: {
                  changesTo: [
                     {
                        targetId: "CLOUD_SYNC_SITE"
                     }
                  ],
                  publishTopic: topics.GET_FORM_VALUE_DEPENDENT_OPTIONS,
                  publishPayload: {
                     publishTopic: topics.GET_CLOUD_PATH
                  },
                  publishGlobal: false
               },
               validateWhenHidden: true,
               visibilityConfig: {
                  initialValue: false,
                  rules: [
                     {
                        targetId: "CLOUD_SYNC_SITE",
                        isNot: ["",null]
                     }
                  ]
               },
               requirementConfig: {
                  initialValue: true
               },
               treeNodeDisablementConfig: {
                  rules: [
                     {
                        property: "item.aspects",
                        contains: ["sync:synced"]
                     }
                  ]
               }
            }
         },
         {
            id: "CLOUD_SYNC_LOCK_ON_PREMISE",
            name: "alfresco/forms/controls/CheckBox",
            config: {
               fieldId: "CLOUD_SYNC_LOCK_ON_PREMISE",
               name: "sourceCopyLocked",
               value: false,
               label: "cloud-sync.dialog.lock-source-copy.label"
            }
         },
         {
            id: "CLOUD_SYNC_DELETE_ON_CLOUD",
            name: "alfresco/forms/controls/CheckBox",
            config: {
               fieldId: "CLOUD_SYNC_DELETE_ON_PREMISE",
               name: "isDeleteOnCloud",
               value: true,
               label: "cloud-sync.dialog.is-delete-on-cloud.label"
            }
         },
         {
            id: "CLOUD_SYNC_DELETE_ON_PREMISE",
            name: "alfresco/forms/controls/CheckBox",
            config: {
               fieldId: "CLOUD_SYNC_DELETE_ON_PREMISE",
               name: "isDeleteOnPrem",
               value: false,
               label: "cloud-sync.dialog.is-delete-on-prem.label"
            }
         },
         {
            id: "CLOUD_SYNC_INCLUDE_SUBFOLDERS",
            name: "alfresco/forms/controls/CheckBox",
            config: {
               fieldId: "CLOUD_SYNC_INCLUDE_SUBFOLDERS",
               name: "includeSubFolders",
               value: true,
               label: "cloud-sync.dialog.includeSubFolders.label"
            }
         }
      ]
   });
});
