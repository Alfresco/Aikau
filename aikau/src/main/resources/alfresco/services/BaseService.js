/*jshint maxlen:false*/
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
 * This module should be extended by all Aikau services as it provides a clean way of ensuring that
 * if a duplicate of the same service is created (configured to use the same pubSubScope) that it's 
 * subscriptions will not be created. This is achieved by the extending service module defining all
 * it's subscription creation code in the 
 * [registerSubscriptions]{@link module:alfresco/services/BaseService#registerSubscriptions} that is
 * only called if an instance of that service does not already exist. Descendant services should override
 * the [registerSubscriptions]{@link module:alfresco/services/BaseService#registerSubscriptions} and 
 * avoid definining their own constructor function.
 * 
 * @module alfresco/services/BaseService
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 * @since 1.0.32
 */
define(["dojo/_base/declare",
        "alfresco/services/serviceRegistry",
        "alfresco/core/Core",
        "alfresco/core/topics",
        "dojo/_base/lang"],
        function(declare, serviceRegistry, AlfCore, topics, lang) {
   
   return declare([AlfCore], {
      
      /**
       * Creates the service and checks to see whether or not another instance configured on the
       * same pubSubScope has already been registered and if not calls the 
       * [registerSubscriptions]{@link module:alfresco/services/BaseService#registerSubscriptions}
       * function (which should be overridden by the extending service).
       * 
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_services_BaseService__constructor(args) {
         declare.safeMixin(this, args);
         if (serviceRegistry.register(this.alfServiceName, this.pubSubScope))
         {
            this.initService();
            this.registerSubscriptions();
         }
         else
         {
            // jshint maxlen:false
            var message = lang.replace("A service with the Module ID: '{alfServiceName}' configured to use the pubSubScope '{pubSubScope}' has already been registered so this instance will NOT call 'registerSubscriptions'. This is typically nothing to be concerned about", this);
            this.alfLog("info", message);
         }
      },

      /**
       * If a service needs to act upon its post-mixed-in state before registering subscriptions then
       * this is where it should be done. It is comparable to postMixInProperties in a widget in the
       * class lifecycle.
       *
       * @instance
       * @since 1.0.52
       */
      initService: function alfresco_services_BaseService__initService() {
         // No action required
      },

      /**
       * This function can be called before making an XHR call in order to ensure publication relevant topics
       * such as 
       * 
       * @instance
       * @param {object} requestPayload The payload published making the request on the service
       * @param {object} xhrPayload The payload to be published to make the XHR request
       * @since 1.0.85
       */
      mergeTopicsIntoXhrPayload: function alfresco_services_BaseService__mergeTopicsIntoXhrPayload(requestPayload, xhrPayload) {
         if (requestPayload && xhrPayload)
         {
            xhrPayload.alfResponseTopic = requestPayload.alfResponseTopic;
            xhrPayload.alfResponseScope = requestPayload.alfResponseScope;
            xhrPayload.alfSuccessTopic = requestPayload.alfSuccessTopic;
            xhrPayload.alfFailureTopic = requestPayload.alfFailureTopic;
         }
      },
      
      /**
       * This function should be overridden by extending services to register their subscriptions.
       *
       * @instance
       * @overridable
       */
      registerSubscriptions: function alfresco_services_BaseService__registerSubscriptions() {
         // No action required
      }
   });
});