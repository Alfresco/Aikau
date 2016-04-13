/*globals Alfresco*/
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
 * This should be mixed into all Alfresco widgets and services as it provides the essential functions that they will
 * undoubtedly required, e.g. logging, publication/subscription handling, i18n message handling, etc.
 *
 * @module alfresco/core/Core
 * @mixinSafe
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/CoreData",
        "alfresco/core/PubSubLog",
        "alfresco/util/objectUtils",
        "service/constants/Default",
        "dojo/topic",
        "alfresco/core/PubQueue",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojox/uuid/generateRandomUuid", 
        "dojox/html/entities", 
        "dojo/Deferred"], 
        function(declare, CoreData, PubSubLog, objUtils, AlfConstants, pubSub, PubQueue, array, lang, uuid, htmlEntities, Deferred) {

   return declare(null, {

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Core.css"}]
       */
      cssRequirements: [{cssFile:"./css/Core.css"}],

      /**
       * This has been added purely to prevent any object that inherits from this mixin from being
       * iterated over in the pub/sub log. It aims to prevent infinite loops (although there is protection
       * for this in the [SubscriptionLog]{@link module:alfresco/logging/SubscriptionLog}) module). It should
       * also ensure that only useful information is displayed in the log.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      excludeFromPubSubLog: true,

      /**
       * Creates and returns a new UUID (universally unique identifier). The UUID is generated using the
       * dojox/uuid/generateRandomUuid module
       *
       * @instance
       * @returns {string} A new UUID
       */
      generateUuid: function alfresco_core_Core__generateUuid() {
         return uuid();
      },

      /**
       * This function is based on the version that can be found in alfresco.js. It searches through all of
       * the available scopes for the widget and for all of the widgets inherited from.
       *
       * @callable
       * @instance
       * @param {string} p_messageId The id of the message to be displayed.
       * @param {...Object} [messageArgs] A single object with integer keys or multiple objects, either of
       *                                  which can be used to mix into a message string
       * @returns {string} A localized form of the supplied message
       */
      message: function alfresco_core_Core__message(p_messageId) {
         /*jshint maxcomplexity:13*/

         var scopeMsg;
         if (typeof p_messageId !== "string")
         {
            throw new Error("Missing or invalid argument: messageId");
         }

         var msg = p_messageId;

         // Check the global message bundle for the message id (this will get overridden if a more specific
         // property is available)...
         if (typeof Alfresco.messages.global === "object")
         {
            var globalMsg = Alfresco.messages.global[p_messageId];
            if (typeof globalMsg === "string")
            {
               msg = globalMsg;
            }
         }

         // Overwrite with page scope...
         if (typeof Alfresco.messages.pageScope === "object")
         {
            var pageScopeMsg = Alfresco.messages.pageScope[p_messageId];
            if (typeof pageScopeMsg === "string")
            {
               msg = pageScopeMsg;
            }
         }

         // Overwrite page scope with default scope...
         if (typeof Alfresco.messages.scope[Alfresco.messages.defaultScope] === "object")
         {
            scopeMsg = Alfresco.messages.scope[Alfresco.messages.defaultScope][p_messageId];
            if (typeof scopeMsg === "string")
            {
               msg = scopeMsg;
            }
         }

         // Work through the base classes and use their i18nScope property (if available) as a scope to
         // check. This allows a widget to check its class hierarchy for message scopes.
         if (this.constructor && this.constructor._meta) {
            array.forEach(this.constructor._meta.parents, function(entry) {

               // PLEASE NOTE: Use of the constructor _meta property is used at risk. It is the recognised
               //              way of accessing parent classes (for example it is used in the .isInstanceOf()
               //              function but there is a warning that it is not part of an API that can be relied
               //              upon to never change. Should message handling fail, then this might be an area
               //              to investigate.
               if (entry._meta && entry._meta.hidden && entry._meta.hidden.i18nScope && Alfresco.messages.scope[entry._meta.hidden.i18nScope])
               {
                  var i18nScopeMsg = Alfresco.messages.scope[entry._meta.hidden.i18nScope][p_messageId];
                  if (typeof i18nScopeMsg === "string")
                  {
                     msg = i18nScopeMsg;
                  }
               }
            });
         }

         // Set the main scope for the calling class...
         // This will either be the i18nScope or the default message scope if i18nScope is not defined
         if (typeof this.i18nScope !== "undefined" && typeof Alfresco.messages.scope[this.i18nScope] === "object")
         {
            scopeMsg = Alfresco.messages.scope[this.i18nScope][p_messageId];
            if (typeof scopeMsg === "string")
            {
               msg = scopeMsg;
            }
         }

         // Search/replace tokens
         var tokens = [];
         if ((arguments.length === 2) && (typeof arguments[1] === "object"))
         {
            tokens = arguments[1];
         }
         else
         {
            tokens = Array.prototype.slice.call(arguments).slice(1);
         }

         // Emulate server-side I18NUtils implementation
         if (tokens instanceof Array && tokens.length > 0)
         {
            msg = msg.replace(/''/g, "'");
         }

         // TODO: Need to check this works with old Share strings...
         msg = lang.replace(msg, tokens);
         return msg;
      },

      /**
       * This function can be called to decode strings that have previously been encoded using 
       * [encodeHTML]{@link module:alfresco/core/Core#encodeHTML}.
       *
       * @callable
       * @instance
       * @returns The decoded input string
       * @since 1.0.50
       */
      decodeHTML: function alfresco_core_Core__encodeHTML(textIn) {
         return htmlEntities.decode(textIn);
      },

      /**
       * Use this function to ensure that all text added to the HTML page is encoded to prevent XSS style
       * attacks. This wraps the dojox/html/entities encode function. It is intentionally wrapped so that
       * if we need to make a change (e.g. change the encoding handling) we can make it in one place
       *
       * @callable
       * @instance
       * @returns The encoded input string
       */
      encodeHTML: function alfresco_core_Core__encodeHTML(textIn) {
         return htmlEntities.encode(textIn);
      },

      /**
       * This is the scope to use within the data model. If this is not initiated during instantiation then
       * it will be assigned to the root scope of the data model the first time any of the data API functions
       * are used.
       *
       * @instance
       * @type {object}
       * @default
       */
      dataScope: null,

      /**
       * This will be used to keep track of all the data event callbacks that are registered for the instance.
       * These will be iterated over and removed when the instance is destroyed.
       *
       * @instance
       * @type {function[]}
       * @default
       */
      dataBindingCallbacks: null,

      /**
       * This function converts notation into an internal notation style.
       * 
       * @instance
       * @param  {string} dotNotation A dot notation representation of the location within the data model to set.
       * @return {string} The processed notation
       */
      alfProcessDataDotNotation: function alfresco_core_Core__alfProcessDataDotNotation(dotNotation) {
         var re = /(\.|\[)/g;
         return dotNotation.replace(re, "._alfValue$1");
      },

      /**
       * This both sets data and registers the widget of as the owner of the data. This is done so that
       * when the widget is destroyed the data it owned will be removed from the data model
       *
       * @instance
       * @param {string} dotNotation A dot notation representation of the location within the data model to set.
       * @param {object} value The value to set
       * @param {object} scope The scope to set the data at. If null the instance scope will be used.
       * @returns {object} An object that the widget can use to remove the data when it is destroyed.
       */
      alfSetData: function alfresco_core_Core__alfSetData(dotNotation, value, scope) {
         this.alfLog("log", "Setting data", dotNotation, value, scope, this);
         var dataOwnerBinding = {};
         if (!this.dataScope)
         {
            this.dataScope = CoreData.getSingleton().root;
         }
         if (!scope)
         {
            scope = this.dataScope;
         }

         // Process the dotNotation...
         // Adds in the additional "_alfValue" objects...
         dotNotation = this.alfProcessDataDotNotation(dotNotation);

         var data = lang.getObject(dotNotation, false, scope);
         if (!data)
         {
            // The data item doesn't exist yet, create it now and register the caller
            // as the owner. Not sure if this is necessary, we can't tell if the widget is destroyed
         }
         // Set the new data...
         // Variable reuse here is correct.
         data = lang.getObject(dotNotation, true, scope);
         var oldValue = data._alfValue;
         lang.setObject(dotNotation + "._alfValue", value, scope);

         if (data._alfCallbacks)
         {
            // Move all the pending callbacks into the callback property
            for (var callbackId in data._alfCallbacks)
            {
               if (typeof data._alfCallbacks[callbackId] === "function")
               {
                  data._alfCallbacks[callbackId](dotNotation, oldValue, value);
               }
            }
         }
         return dataOwnerBinding;
      },

      /**
       * This gets the data from the location in the model defined by the scope. If no explicit scope
       * is provided then the instance scope will be used.
       *
       * @instance
       * @param {string} dotNotation A dot notation representation of the location within the data model to get
       * @param {object} scope The scope to get the data from. If null then then instance scope will be used.
       * @returns {object} The data at the supplied location
       */
      alfGetData: function alfresco_core_Core__alfGetData(dotNotation, scope) {
         // If a data scope has not been set then get the root data model
         if (!this.dataScope)
         {
            this.dataScope = CoreData.getSingleton().root;
         }
         if (!scope)
         {
            scope = this.dataScope;
         }
         dotNotation = this.alfProcessDataDotNotation(dotNotation);
         var data = lang.getObject(dotNotation + "._alfValue", false, scope);
         this.alfLog("log", "Getting data", dotNotation, scope, data, this);
         return data;
      },

      /**
       * Binds a callback function to an entry in the data model so that when the data is changed the callback
       * will be executed. This allows widgets to respond to data changes dynamically. A reference to the
       * call back will be returned and it is important that these callbacks are deleted when the widget
       * is destroyed to prevent memory leaks.
       *
       * @instance
       * @param {string} dotNotation A dot notation representation of the location with the data model to bind to
       * @param {object} scope The scope to look for the dot notated data at
       * @param {function} callback The function to call when the data is changed
       * @returns {object} A reference to the callback so that it can be removed when the caller is destroyed
       */
      alfBindDataListener: function alfresco_core_Core__alfBindDataListener(dotNotation, scope, callback) {
         if (dotNotation)
         {
            this.alfLog("log", "Binding data listener", dotNotation, scope, callback, this);
            if (!this.dataScope)
            {
               this.dataScope = CoreData.getSingleton().root;
            }
            if (!scope)
            {
               scope = this.dataScope;
            }
            // TODO: Validate the dotNotation??
            dotNotation = this.alfProcessDataDotNotation(dotNotation);

            var callbacks = lang.getObject(dotNotation + "._alfCallbacks", true, scope);
            var callbackId = this.generateUuid(); // Create a uuid for the callback
            callbacks[callbackId] = callback;     // Set the callback

            // Create and return the binding (this should provide enough information to delete the callback
            // from the data model when the owning widget is destroyed)
            var binding = {
               scope: this.dataScope,
               dotNotation: dotNotation,
               callbackId: callbackId
            };
            if (!this.dataBindingCallbacks)
            {
               this.dataBindingCallbacks = [];
            }
            this.dataBindingCallbacks.push(binding);
            return binding;
         }
      },

      /**
       * @instance
       * @param {object} binding The binding object
       */
      alfRemoveDataListener: function alfresco_core_Core__alfRemoveDataListener(binding) {
         // Need to check my logic here (!?)
         this.alfLog("log", "Removing data binding", binding);
         try
         {
            var data = lang.getObject(binding.dotNotation, false, binding.scope);
            if (!data)
            {
               delete data._alfCallbacks[binding.callbackId];
            }
         }
         catch(e)
         {
            this.alfLog("error", "Could not delete data listener binding", binding);
         }
      },

      /**
       * A String that is used to prefix all pub/sub communications to ensure that only relevant
       * publications are handled and issued.
       *
       * @instance
       * @type {string}
       * @default
       */
      pubSubScope: "",

      /**
       * Used to track of any subscriptions that are made. They will be all be unsubscribed when the
       * [destroy]{@link module:alfresco/core/Core#destroy} function is called.
       *
       * @instance
       * @type {Array}
       * @default
       */
      alfSubscriptions: null,

      /**
       * Deletes any automatically added publish attributes from the supplied object. These are attributes that
       * will have been added to the object by the [alfPublish]{@link module:alfresco/core/Core#alfPublish} function.
       * 
       * @instance
       * @param {object} object The object to remove the attributes from.
       * @deprecated Since 1.0.45 - Use [alfCleanFrameworkAttributes]{@link module:alfreso/core/Core#alfCleanFrameworkAttributes} instead.
       */
      alfDeleteFrameworkAttributes: function alfresco_core_Core__alfDeleteFrameworkAttributes(object) {
         delete object.alfResponseTopic;
         delete object.alfResponseScope;
         delete object.alfTopic;
         delete object.alfPublishScope;
         delete object.alfCallerName;
      },

      /**
       * By default, clones the passed-in object and then deletes any automatically added attributes from the clone. These attributes
       * are added automatically by [alfPublish]{@link module:alfresco/core/Core#alfPublish} or are used only by the pub/sub framework
       * (e.g. "responseScope"). The cleaned object is then returned. By passing in the "modifyOriginal" flag this will behave
       * identically to the [deprecated method it replaces]{@link module:alfresco/core/Core#alfDeleteFrameworkAttributes}, by removing
       * the framework attributes directly from the passed-in object.
       * 
       * @instance
       * @param {object} original The object to clean the attributes from.
       * @param {boolean} [modifyOriginal=false] If true, will modify the original object, not a clone.
       * @param {string[]} [alsoDelete] An optional array of strings denoting additional properties to remove from the object
       *                                being cleaned. It's also possible to pass in properties prefixed with an exclamation
       *                                mark, to denote that that property should NOT be removed by the default cleaning
       *                                algorithm (e.g. ["url", "!alfTopic"]).
       * @returns {object} The cloned, cleaned object, or if "modifyOriginal" is true then the original, cleaned object.
       * @since 1.0.45
       */
      alfCleanFrameworkAttributes: function alfresco_core_Core__alfCleanFrameworkAttributes(original, modifyOriginal, alsoDelete) {

         // If we have a falsy object, it cannot be an object we are able to clean
         if (!original) {
            this.alfLog("warn", "Requested to clean 'falsy' object: ", original);
            return original;
         }

         // Setup variables
         var objToClean = modifyOriginal ? original : lang.clone(original),
            propsToClean = ["alfResponseTopic", "alfResponseScope", "responseScope", "alfTopic", "alfPublishScope", "alfCallerName"],
            additionalProps = (alsoDelete && alsoDelete.length) ? alsoDelete : [];

         // Calculate the properties to clean
         array.forEach(additionalProps, function(propName) {
            if (propName.charAt(0) === "!") {
               propsToClean = array.filter(propsToClean, function(propToClean) {
                  return propToClean !== propName.substr(1);
               });
            } else {
               propsToClean.push(propName);
            }
         });

         // Clean and return the properties from the object
         array.forEach(propsToClean, function(propName) {
            delete objToClean[propName];
         });
         return objToClean;
      },

      /**
       * Publishes to a service. This method calls [alfPublish()]{@link module:alfresco/core/Core#alfPublish}
       * behind the scenes. Will automatically scope the call to global to that the service will pick it up
       * successfully (most services subscribe to topics with a global scope).
       *
       * @instance
       * @param {string | string[]} topics The topic(s) on which to publish
       * @param {Object} payload The payload to publish on the supplied topic
       * @param {string} [payload.responseScope] The scope to use when any response is published
       * @param {String} [scope] Use this to scope the publish (only use with scoped services)
       */
      alfServicePublish: function alfresco_core_Core__alfServicePublish(topics, payload, scope) {
         this.alfPublish(topics, payload, !scope, false, scope);
      },

      /**
       * This function wraps the standard Dojo publish function. It should always be used rather than
       * calling the Dojo implementation directly to allow us to make changes to the implementation or
       * to introduce additional features (such as scoping) or updates to the payload.
       *
       * @callable
       * @instance
       * @param {String | Array} topics The topic(s) on which to publish
       * @param {object} payload The payload to publish on the supplied topic
       * @param {string} [payload.responseScope] The scope to use when any response is published
       * @param {boolean} [global] Indicates that the pub/sub scope should not be applied
       * @param {boolean} [parentScope] Indicates that the pub/sub scope inherited from the parent should be applied
       * @param {String} [customScope] A custom scope to use for this publish (will only be used if both global
       *                               and parentScope are falsy)
       */
      alfPublish: function alfresco_core_Core__alfPublish(topics, payload, global, parentScope, customScope) {
         // Allow an array of topics so we can publish multiple ones.
         if (!lang.isArray(topics))
         {
            topics = [topics];
         }

         /*jshint -W059 */
         var callerName = arguments.callee.caller.name;
         array.forEach(topics, function(topic) {
            if (!payload)
            {
               payload = {};
            }
            payload.alfCallerName = callerName;

            // Calculate the scope to be used and thus the scoped topic
            var publishScope = "",
               scopedTopic;
            if (global === true) 
            {
               // No action required
            } 
            else if (parentScope === true) 
            {
               publishScope = this.parentPubSubScope;
            } 
            else if (typeof customScope !== "undefined") 
            {
               publishScope = customScope;
            } 
            else 
            {
               publishScope = this.pubSubScope;
            }
            scopedTopic = publishScope + topic;

            // Update the payload
            payload.alfPublishScope = publishScope;
            payload.alfTopic = scopedTopic;

            // Note that we need to take special attention to falsy behaviour of the global scope
            // as the empty string is a valid scope. If defined as either the reponseScope or the
            // alfResponseScope then it should be used...
            var alfResponseScope  = this.pubSubScope;
            if (payload.responseScope || payload.responseScope === "")
            {
               alfResponseScope = payload.responseScope;
            }
            else if (payload.alfResponseScope || payload.alfResponseScope === "")
            {
               alfResponseScope = payload.alfResponseScope;
            }
            payload.alfResponseScope = alfResponseScope;

            // Publish...
            PubQueue.getSingleton().publish(scopedTopic, payload, this);
         }, this);
      },

      /**
       * Publish an event after waiting for the specified delay.
       *
       * @instance
       * @param topic {String} topic to publish
       * @param payload {Object} the payload to be pushed to the publish event
       * @param delay {Number} ms delay in how long to wait before publishing the event
       */
      alfPublishDelayed: function alfresco_core_Core__alfPublishDelayed(topic, payload, delay) {
         this._delayedPublishPayload = payload;
         window.setTimeout(lang.hitch(this, function(){
            // due to lang.hitch, usage of 'this' below is correct.
            this.alfPublish(topic, this._delayedPublishPayload);
         }), delay);
      },

      // TODO: Create alfSubscribeOnce that removes the event listener after it fires once.

      /**
       * This function wraps the standard Dojo subscribe function. It should always be used rather than
       * calling the Dojo implementation directly to allow us to make changes to the implementation or
       * to introduce additional features (such as scoping) or updates to the callback. The subscription
       * handle that gets created is add to [alfSubscriptions]{@link module:alfresco/core/Core#alfSubscriptions}
       *
       * @callable
       * @instance
       * @param {string} topic The topic on which to subscribe
       * @param {function} callback The callback function to call when the topic is published on.
       * @param {boolean} [global] Indicates that the pub/sub scope should not be applied
       * @param {boolean} [parentScope] Indicates that the pub/sub scope inherited from the parent should be applied
       * @returns {object} A handle to the subscription
       */
      alfSubscribe: function alfresco_core_Core__alfSubscribe(topic, callback, global, parentScope) {
         var scopedTopic = topic;
         if (global === true)
         {
            // No action required - use global scope
         }
         else if (parentScope === true)
         {
            scopedTopic = this.parentPubSubScope + topic;
         }
         else
         {
            scopedTopic = this.pubSubScope + topic;
         }

         if (AlfConstants.DEBUG)
         {
            PubSubLog.getSingleton().sub(scopedTopic, callback, this);
            this.alfPublish("ALF_LOG_SUBSCRIPTION_ACTIVITY", {
               subscribedTopic: scopedTopic,
               callback: callback,
               subscriber: this
            }, true);
         }

         var handle = pubSub.subscribe(scopedTopic, callback);
         if (!this.alfSubscriptions)
         {
            this.alfSubscriptions = [];
         }
         handle.scopedTopic = scopedTopic;
         this.alfSubscriptions.push(handle);
         return handle;
      },

      /**
       * Subscribe to a publication and then analyse the payload. Depending on whether it
       * matches the provided [rules object]{@link module:alfresco/util/objectUtils#Rules},
       * apply the success or failure callback as appropriate. Please see the
       * [underlying method]{@link module:alfresco/util/objectUtils#evaluateRules} for more
       * information.
       *
       * @instance
       * @param {string} topic The topic on which to subscribe
       * @param {module:alfresco/util/objectUtils#Rules} rules The rules object to apply
       * @param {function} success The function to run if successful
       * @param {function} [failure] The function to run if unsuccessful
       * @param {boolean} [global] Indicates that the pub/sub scope should not be applied
       * @param {boolean} [parentScope] Indicates that the pub/sub scope inherited from the parent should be applied
       * @returns {object} A handle to the subscription
       * @since 1.0.44
       */
      alfConditionalSubscribe: function alfresco_core_CoreWidgetProcessing__alfConditionalSubscribe(topic, rules, success, failure, global, parentScope) {
         return this.alfSubscribe(topic, lang.hitch(this, function(payload) {
            var rulesObj = lang.mixin({
                  testObject: payload
               }, rules),
               successHandler = success && lang.partial(success, payload),
               failureHandler = failure && lang.partial(failure, payload);
            objUtils.evaluateRules(rulesObj, successHandler, failureHandler);
         }), global, parentScope);
      },

      /**
       * This function wraps the standard unsubscribe function. It should always be used rather than call
       * the Dojo implementation directly.
       *
       * @callable
       * @instance
       * @param {object|array} handle The subscription handle to unsubscribe
       */
      alfUnsubscribe: function alfresco_core_Core__alfUnsubscribe(handle) {
         if (!handle)
         {
            this.alfLog("warn", "No subscription handles to unsubscribe from");
         }
         else
         {
            if (!lang.isArray(handle))
            {
               handle = [handle];
            }
            array.forEach(handle, function(individualHandle){
               if (AlfConstants.DEBUG === true)
               {
                  PubSubLog.getSingleton().unsub(individualHandle, this);
                  this.alfPublish("ALF_LOG_UNSUBSCRIPTION_ACTIVITY", {
                     unsubscribedTopic: individualHandle.scopedTopic,
                     subscriber: this
                  }, true);
               }

               individualHandle.remove();
            }, this);
         }
      },

      /**
       * This is a helper function for unsubscribing from subscription handles that are set-up with unique
       * topics to guarantee recipients.
       *
       * @callable
       * @instance
       * @param {array} handles The handles to unsubscribe
       */
      alfUnsubscribeSaveHandles: function alfresco_core_Core__alfUnsubscribeSaveHandles(handles) {
         array.forEach(handles, function(handle) {
            if (handle)
            {
               this.alfUnsubscribe(handle);
            }
            else
            {
               this.alfLog("warn", "A subscription handle was not found - this could be a potential memory leak", this);
            }
         }, this);
      },

      /**
       * This function will override a destroy method if available (e.g. if this has been mixed into a
       * widget instance) so that any subscriptions that have been made can be removed. This is necessary
       * because subscriptions are not automatically cleaned up when the widget is destroyed.
       *
       * This also removes any data binding listeners that have been registered.
       *
       * @callable
       * @instance
       * @param {boolean} preserveDom
       */
      destroy: function alfresco_core_Core__destroy(preserveDom) {
         /*jshint unused:false*/
         if (this.alfSubscriptions)
         {
            array.forEach(this.alfSubscriptions, function(handle) {
               if (typeof handle.remove === "function")
               {
                  handle.remove();
               }
            });
         }
         if (this.dataBindingCallbacks)
         {
            array.forEach(this.dataBindingCallbacks, function(binding) {
               this.alfRemoveDataListener(binding);
            }, this);
         }

         if (this.servicesToDestroy)
         {
            array.forEach(this.servicesToDestroy, function(service) {
               if (service && typeof service.destroy === "function")
               {
                  service.destroy();
               }
            }, this);
         }

         if (typeof this.inherited === "function")
         {
            this.inherited(arguments);
         }
      },

      /**
       * This will be used to keep track of all services that are created so that they can be destroyed
       * when the current instance is destroyed.
       *
       * @instance
       * @type {object[]}
       * @default
       */
      servicesToDestroy: null,

      /**
       * This will be used to keep track of all widgets that are created so that they can be destroyed
       * when the current instance is destroyed.
       *
       * @instance
       * @type {object[]}
       * @default
       */
      widgetsToDestroy: null,

      /**
       * @instance
       * @event alfLoggingTopic
       * @type {string}
       * @default
       */
      alfLoggingTopic: "ALF_LOG_REQUEST",

      /**
       * This function is intended to provide the entry point to all client-side logging from the application. By
       * default it simply delegates to the standard browser console object but could optionally be overridden or
       * extended to provide advanced capabilities like posting client-side logs back to the server, etc.
       *
       * @callable
       * @instance
       * @param {string} severity The severity of the message to be logged
       * @param {string} message The message to be logged
       */
      alfLog: function alfresco_core_Core__alfLog(severity, message) {
         // arguments.callee is deprecated, but there's no alternative to it, so ignore errors.
         /*jshint unused:false, noarg:false*/
         this.alfPublish(this.alfLoggingTopic, {
            callerName: arguments.callee.caller.name,
            severity: severity,
            messageArgs: Array.prototype.slice.call(arguments, 1)
         }, true);
      },

      /**
       * Submit a pub-sub request (i.e. do a publish) and return a promise that will resolve to the
       * returned subscription. This is specifically for occasions when doing a publish with a UUID,
       * where the response (i.e. subsequent subscription) is only relevant for this one instance. The
       * response topic is generated automatically, and does not need to be supplied in the payload.
       *
       * @instance
       * @param {String} topic The topic on which to publish
       * @param {object} payload The payload to publish on the supplied topic
       * @param {boolean} [global] Indicates that the pub/sub scope should not be applied
       * @param {boolean} [parentScope] Indicates that the pub/sub scope inherited from the parent should be applied
       * @returns {object} A dojo/promise/Promise
       */
      alfPublishToPromise: function alfresco_core_Core__alfPubSubToPromise(topic, payload, global, parentScope) {
         // Setup the publish variables and handlers
         var deferred = new Deferred(),
            responseTopic = uuid(),
            subscriptionHandles = [],
            publishPayload = lang.mixin({
               alfResponseTopic: responseTopic
            }, payload || {}),
            resultsProperty = payload.resultsProperty || "response";

         // Define the subscription handlers
         var successHandler = lang.hitch(this, function(response) {
               this.alfUnsubscribeSaveHandles(subscriptionHandles);
               deferred.resolve(response[resultsProperty]);
            }),
            failureHandler = lang.hitch(this, function(response) {
               this.alfUnsubscribeSaveHandles(subscriptionHandles);
               deferred.reject(response);
            });

         // Do subscriptions and publish
         subscriptionHandles.push(this.alfSubscribe(responseTopic, successHandler));
         subscriptionHandles.push(this.alfSubscribe(responseTopic + "_SUCCESS", successHandler));
         subscriptionHandles.push(this.alfSubscribe(responseTopic + "_FAILURE", failureHandler));
         this.alfPublish(topic, publishPayload, global, parentScope);

         // Pass back the promise
         return deferred.promise;
      }
   });
});
