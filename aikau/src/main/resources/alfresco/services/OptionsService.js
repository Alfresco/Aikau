/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * This service provides a way of requesting options data for form controls, providing
 * normalization of the data so that it adheres to the structure expected by form controls
 *
 * @module alfresco/services/OptionsService
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "dojo/_base/lang",
        "dojo/_base/array",
        "service/constants/Default",
        "alfresco/core/NotificationUtils",],
        function(declare, AlfCore, AlfXhr, lang, array, AlfConstants, NotificationUtils) {
   
   return declare([AlfCore, AlfXhr, NotificationUtils], {
      
      /**
       * Sets up the subscriptions for the OptionsService
       * 
       * @instance 
       * @param {array} args The constructor arguments.
       */
      constructor: function alfresco_services_OptionsService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("ALF_GET_FORM_CONTROL_OPTIONS", lang.hitch(this, this.onOptionsRequest));
      },
      
      /**
       * <p>Handles request to retrieve and normalize options data, the following attributes must be 
       * provided on the payload:</p>
       * <ul>url (e.g. AlfConstants.PROXY_URI + "api/groups")<li></li>
       * <li>itemsAttribute - dot-notation address of items array (e.g. "data")(</li>
       * <li>labelAttribute - dot-notation for label within each item (e.g. "displayName")</li>
       * <li>valueAttribute - dot-notation for value within each item (e.g. "fullName")</li>
       * <li>responseTopic - this is automatically provided by Aikau form controls</li></ul>
       *
       * @instance
       * @param {object} payload
       */
      onOptionsRequest: function alfresco_services_OptionsService__onOptionsRequest(payload) {
         if (payload.url != null &&
             payload.itemsAttribute != null &&
             payload.labelAttribute != null &&
             payload.valueAttribute != null &&
             payload.responseTopic != null)
         {
            this.serviceXhr({
               url : payload.url,
               data: payload,
               method: "GET",
               successCallback: this.optionsSuccess,
               failureCallback: this.optionsFailure,
               callbackScope: this
            });
         }
         else
         {
            this.alfLog("warn", "A request was made to retrieve form control options, but required payload attributes are missing", payload, this);
         }
      },
      
      /**
       * This function is called whenever the raw options data is successfully retrieved. It locates
       * the attribute within the reponse that contains the options (via the "itemsAttribute") and
       * then calls the [processOptions function]{@link module:alfresco/services/OptionsService#processOptions}
       * to convert the raw data into the expected structure (e.g. an array of objects containing
       * "label" and "value" attributes).
       *
       * @instance
       * @param {object} response
       * @param {object} originalRequestConfig
       */
      optionsSuccess: function alfresco_services_OptionsService__optionsSuccess(response, originalRequestConfig) {
         this.alfLog("log", "Successfully retrieved form control options", response, originalRequestConfig);
         var options = [];
         var items = null;
         if (originalRequestConfig.data.itemsAttribute === "")
         {
            items = response;
         }
         else
         {
            items = lang.getObject(originalRequestConfig.data.itemsAttribute, false, response);
         }
         if (items !== null)
         {
            array.forEach(items, lang.hitch(this, this.processOptions, options, originalRequestConfig.data));
         }
         this.alfPublish(originalRequestConfig.data.responseTopic, {
            options: options
         });
      },

      /**
       * Uses the dot-notation addresses for the label and value to add a new option to the supplied
       * option array.
       * 
       * @instance
       * @param {array} options The array to add the processed item to
       * @param {object} config The configuration to use for processing the option
       * @param {object} item The current item to process as an option
       * @param {number} index The index of the item in the items list
       */
      processOptions: function alfresco_services_OptionsService__processOptions(options, config, item, index) {
         var label = lang.getObject(config.labelAttribute, false, item);
         var value = lang.getObject(config.valueAttribute, false, item);
         if (label == null && value == null)
         {
            this.alfLog("warn", "Neither the label or value could be found in the item", item);
         }
         else
         {
            options.push({
               label: (label != null) ? label : value,
               value: value
            });
         }
      },

      /**
       * @instance
       * @param {object} response
       * @param {object} originalRequestConfig
       */
      optionsFailure: function alfresco_services_OptionsService__optionsFailure(response, originalRequestConfig) {
         this.alfLog("error", "Failed to retrieve form control options", response, originalRequestConfig);
         // TODO: Handle error better (e.g. localization)...
         this.displayMessage(this.message("Could not retrieve options", [originalRequestConfig.data.name]));
      }
   });
});
