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
 * This is a generic service for handling CRUD requests between widgets and the repository.
 *
 * @module alfresco/services/CrudService
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "service/constants/Default",
        "alfresco/dialogs/AlfDialog",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/json"],
        function(declare, AlfCore, CoreXhr, AlfConstants, AlfDialog, lang, array) {

   return declare([AlfCore, CoreXhr], {

      /**
       * An array of the i18n files to use with this service.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/CrudService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/CrudService.properties"}],

      /**
       * Constructor
       * 
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_services_CrudService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("ALF_CRUD_GET_ALL", lang.hitch(this, this.onGetAll));
         this.alfSubscribe("ALF_CRUD_GET_ONE", lang.hitch(this, this.onGetOne));
         this.alfSubscribe("ALF_CRUD_CREATE", lang.hitch(this, this.onCreate));
         this.alfSubscribe("ALF_CRUD_UPDATE", lang.hitch(this, this.onUpdate));
         this.alfSubscribe("ALF_CRUD_DELETE", lang.hitch(this, this.onDelete));
      },

      /**
       * This is called whenever a create, update or delete operation is performed to ensure that
       * any associated list views are refreshed. It does this by publishing on the "ALF_DOCLIST_RELOAD_DATA"
       * topic (for historical reasons - a more generic topic should be used in the future).
       *
       * @instance
       * @param {object} response The response from the original XHR request.
       * @param {object} originalRequestConfig The configuration passed to the original XHR request.
       */
      refreshRequest: function alfresco_services_CrudService__refreshRequest(response, originalRequestConfig) {
         var responseTopic = lang.getObject("alfTopic", false, originalRequestConfig);
         if (responseTopic) {
            this.alfPublish(responseTopic + "_SUCCESS", response);
         } else {
            this.alfLog("warn", "It was not possible to publish requested CRUD data because the 'responseTopic' attribute was not set on the original request", response, originalRequestConfig);
         }

         var message = lang.getObject("successMessage", false, originalRequestConfig);
         if (!message) {
            message = "crudservice.generic.success.message";
         }

         this.alfPublish("ALF_DISPLAY_NOTIFICATION", {
            message: this.message(message)
         });

         var noRefresh = lang.getObject("data.noRefresh", false, originalRequestConfig);
         if (noRefresh === true) {
            // Don't make a refresh request...
         } else {
            // When refreshing, check to see if a pubSubScope was provided...
            var pubSubScope = lang.getObject("data.pubSubScope", false, originalRequestConfig) || "";
            this.alfPublish(pubSubScope + "ALF_DOCLIST_RELOAD_DATA");
         }
      },

      /**
       * This function is called to get the URL from the payload provided and will issue a warning if one
       * is not found. This is called from all the CRUD handling functions. The payload is expected to contain
       * a 'url' attribute that maps to a Repository WebScript. This function will automatically prefix it
       * with the appropriate proxy stem.
       *
       * @instance
       * @param {object} payload
       * @returns {string} The URL to use to make the CRUD request or null if no 'url' attribute was provided.
       */
      getUrlFromPayload: function alfresco_services_CrudService__getUrlFromPayload(payload) {
         var url = lang.getObject("url", false, payload);
         if (!url) {
            this.alfLog("warn", "A request was made to service a CRUD request but no 'url' attribute was provided on the payload", payload, this);
         } else {
            var urlType = payload.urlType;
            if (!urlType || urlType === "PROXY") {
               url = AlfConstants.PROXY_URI + url;
            } else if (urlType === "SHARE") {
               url = AlfConstants.URL_SERVICECONTEXT + url;
            } else {
               this.alfLog("warn", "An unknown URL type was requested, using provided URL", payload, this);
            }
         }
         return url;
      },

      /**
       * This is a utility function for cloning a payload and removing attributes that should not be
       * passed onto the [serviceXhr] {@link module:alfresco/core/CoreXhr#serviceXhr} function
       *
       * @param {object} payload The payload to clone
       * @returns {object} The cloned payload
       */
      clonePayload: function alfresco_services_CrudService__clonePayload(payload) {
         var data = lang.clone(payload);
         delete data.url;
         delete data.alfResponseTopic;
         delete data.alfTopic;
         delete data.alfPublishScope;
         return data;
      },

      /**
       * This function can be used to append the supplied query parameter name and value onto the 
       * supplied URL string which is then returned.
       * 
       * @param {string} url The url to update
       * @param {string} param The name of the query parameter
       * @param {string} value The value of the query parameter
       * @returns {string} The updated URL
       */
      addQueryParameter: function alfresco_services_CrudService__addQueryParameter(url, param, value) {
         if (url.indexOf("?") === -1)
         {
            url += "?";
         }
         else
         {
            url += "&";
         }
         return url += param + "=" + value;
      },

      /**
       * Makes a GET request to the Repository using the 'url' attribute provided in the payload passed
       * in the publication on the topic that this function subscribes to. The 'url' is expected to be a
       * Repository WebScript URL and should not include the Repository proxy stem.
       *
       * @instance
       * @param {object} payload
       */
      onGetAll: function alfresco_services_CrudService__onGetAll(payload) {
         var url = this.getUrlFromPayload(payload);

         if (payload.pageSize)
         {
            url = this.addQueryParameter(url, "pageSize", payload.pageSize);
         }
         if (payload.page)
         {
            url = this.addQueryParameter(url, "page", payload.page);
         }
         if (payload.dataFilters)
         {
            // TODO: iterate over filters and add each as a request parameter...
            array.forEach(payload.dataFilters, function(filter) {
               url = this.addQueryParameter(url, filter.name, filter.value);
            }, this);
         }
         
         if (url) {
            this.serviceXhr({
               url: url,
               data: this.clonePayload(payload),
               alfTopic: payload.alfResponseTopic || null,
               method: "GET"
            });
         }
      },

      /**
       * TODO: This needs to be completed.
       *
       * @instance
       * @param {object} payload
       */
      onGetOne: function alfresco_services_CrudService__onGetOne(payload) {
         // TODO: Need to append the identifier to specify the object to retrieve
         var url = this.getUrlFromPayload(payload);
         if (url) {
            this.serviceXhr({
               url: url,
               data: this.clonePayload(payload),
               method: "GET"
            });
         }
      },

      /**
       * Creates a new item via the supplied URL. The payload needs to contain both a 'url' attribute
       * (that indicates the REST API to call) and a 'data' attribute (that defines the object to be
       * created).
       *
       * @instance
       * @param {object} payload
       */
      onCreate: function alfresco_services_CrudService__onCreate(payload) {
         var url = this.getUrlFromPayload(payload);
         this.serviceXhr({
            url: url,
            data: this.clonePayload(payload),
            method: "POST",
            alfTopic: payload.alfResponseTopic,
            successMessage: this.message(payload.successMessage || "crudservice.generic.success.message"),
            successCallback: this.refreshRequest,
            failureMessage: this.message(payload.failureMessage || "crudservice.generic.failure.message"),
            failureCallback: this.failureCallback,
            callbackScope: this
         });
      },

      /**
       *
       * @instance
       * @param {object} payload
       */
      onUpdate: function alfresco_services_CrudService__onUpdate(payload) {
         var url = this.getUrlFromPayload(payload);
         this.serviceXhr({
            url: url,
            data: this.clonePayload(payload),
            method: "PUT",
            alfTopic: payload.alfResponseTopic,
            successMessage: this.message(payload.successMessage || "crudservice.generic.success.message"),
            successCallback: this.refreshRequest,
            failureMessage: this.message(payload.failureMessage || "crudservice.generic.failure.message"),
            failureCallback: this.failureCallback,
            callbackScope: this
         });
      },

      /**
       * Handles delete requests. If the supplied payload contains an attribute "requiresConfirmation"
       * that is set to true, then a dialog will be displayed prompting the user to confirm the delete
       * action. The payload can optionally contain localized messages for the dialog title, prompt
       * and button labels.
       *
       * @instance
       * @param {object} payload
       */
      onDelete: function alfresco_services_CrudService__onDelete(payload) {
         // TODO: Need to determine whether or not the ID should be provided in the payload or
         //       as part of the URL.
         var url = this.getUrlFromPayload(payload);
         if (url !== null) {
            if (payload.requiresConfirmation === true) {
               this.requestDeleteConfirmation(url, payload);
            } else {
               this.performDelete(url, payload);
            }
         }
      },

      /**
       * Called from [onDelete]{@link module:alfresco/services/CrudService#onDelete} when user confirmation
       * for the delete action is required. Displays a dialog prompting the user to confirm the action.
       * The dialog title, prompt and button labels can all be configured via the attributes on the
       * supplied payload.
       *
       * @instance
       * @param {string} url The URL to use to perform the delete
       * @param {object} payload The original request payload.
       */
      requestDeleteConfirmation: function alfresco_services_CrudService__requestDeleteConfirmation(url, payload) {

         var responseTopic = this.generateUuid();
         this._deleteHandle = this.alfSubscribe(responseTopic, lang.hitch(this, this.onDeleteConfirmation), true);

         var title = payload.confirmationTitle || "crudservice.generic.delete.title";
         var prompt = payload.confirmationPrompt || "crudservice.generic.delete.prompt";
         var confirmButtonLabel = payload.confirmationButtonLabel || "crudservice.generic.delete.confirmationButtonLabel";
         var cancelButtonLabel = payload.cancellationButtonLabel || "crudservice.generic.delete.cancellationButtonLabel";

         var dialog = new AlfDialog({
            generatePubSubScope: false,
            title: this.message(title),
            textContent: this.message(prompt),
            widgetsButtons: [
               {
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: this.message(confirmButtonLabel),
                     publishTopic: responseTopic,
                     publishPayload: {
                        url: url,
                        pubSubScope: payload.pubSubScope,
                        responseTopic: payload.responseTopic,
                        successMessage: this.message(payload.successMessage || "crudservice.generic.success.message"),
                        failureMessage: this.message(payload.failureMessage || "crudservice.generic.failure.message")
                     }
                  }
               },
               {
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: this.message(cancelButtonLabel),
                     publishTopic: "close"
                  }
               }
            ]
         });
         dialog.show();
      },

      /**
       * Handles the actual deletion, this is abstracted to a separate function so that it can be called from
       * both [onDelete]{@link module:alfresco/services/CrudService#onDelete} and
       * [onDeleteConfirmation]{@link module:alfresco/services/CrudService#onDeleteConfirmation} depending upon
       * whether or not the user needs to confirm the delete action.
       *
       * @instance
       * @param {string} url The URL to use to perform the delete
       * @param {object} payload The original payload
       */
      performDelete: function alfresco_services_CrudService__performDelete(url, payload) {
         this.serviceXhr({
            url: url,
            method: "DELETE",
            data: this.clonePayload(payload),
            alfTopic: payload.responseTopic,
            successMessage: this.message(payload.successMessage || "crudservice.generic.success.message"),
            successCallback: this.refreshRequest,
            failureMessage: this.message(payload.failureMessage || "crudservice.generic.failure.message"),
            failureCallback: this.failureCallback,
            callbackScope: this
         });
      },

      /**
       * This function is called when the user confirms that they wish to peform the delete action.
       *
       * @instance
       * @param {object} payload An object containing the the deletion details.
       */
      onDeleteConfirmation: function alfresco_services_CrudService__onDeleteConfirmation(payload) {
         this.alfUnsubscribeSaveHandles([this._deleteHandle]);
         this.performDelete(payload.url, payload);
      },

      /**
       * This is called whenever a create, update or delete operation fails. It will generate a notification
       * with a message (optionally supplied as failureMessage in the payload).
       *
       * @instance
       * @param {object} response The response from the original XHR request.
       * @param {object} originalRequestConfig The configuration passed to the original XHR request.
       */
      failureCallback: function alfresco_services_CrudService__failureCallback(response, originalRequestConfig) {

         // Publish failure topic as necessary
         if (originalRequestConfig.alfTopic) {
            this.alfPublish(originalRequestConfig.alfTopic + "_FAILURE", {
               requestConfig: originalRequestConfig,
               response: response
            });
         }

         // Get the failure message and display a notification
         var message = originalRequestConfig.failureMessage || this.message("crudservice.generic.failure.message");
         this.alfPublish("ALF_DISPLAY_PROMPT", {
            message: this.message(message)
         });
      }
   });
});