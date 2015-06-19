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
 * Provides Core event handlers for other widgets to use.
 *
 * Scroll and Resize events are rate limited: handlers listening to those emitted events
 * will not be triggered every time the browser triggers the corresponding event. This is to
 * provide optimised handlers that don't run too frequently.
 *
 * Usage (remember to mixin alfresco/core/EventsTopicMixin):
 * this.alfSubscribe(this.eventsScrollTopic, lang.hitch(this, "onEventsScroll"));
 *
 * If your handler needs EVERY browser event, then you're best off subscribing to those
 * events directly, e.g.:
 * on(window, "scroll", lang.hitch(this, "onScroll"));
 *
 * @module alfresco/core/Events
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/EventsTopicMixin
 * @author David.Webster@alfresco.com
 * @author Martin Doyle
 */
define(["alfresco/core/Core",
      "alfresco/core/EventsTopicMixin",
      "dojo/_base/declare",
      "dojo/_base/lang",
      "dojo/on"
   ],
   function(AlfCore, EventsTopicMixin, declare, lang, on) {

      return declare([AlfCore, EventsTopicMixin], {

         /**
          * The default timeout for debounce calls
          *
          * @instance
          * @type {number}
          * @default 250
          */
         defaultDebounceMs: 250,

         /**
          * The default timeout for throttle calls
          *
          * @instance
          * @type {number}
          * @default 100
          */
         defaultThrottleMs: 100,

         /**
          * A holder for the global pointers/variables, where the keys are the names provided to the
          * limiting functions.<br />
          * NOTE: This is a "static" object, and so its values are shared across all instances,
          * allowing multiple sources to limit against a single name.
          *
          * @instance
          * @static
          * @type {Object}
          */
         _global: {
            debounce: {
               lastExecutions: {},
               timeouts: {}
            },
            throttle: {
               lastExecutions: {},
               timeouts: {}
            }
         },

         /**
          * A holder for the local-only pointers/variables, where the keys are the names provided to the
          * limiting functions.
          *
          * @instance
          * @type {Object}
          */
         _local: null,

         /**
          * Debounce the supplied function. This means that repeated calls to execute a function will be batched up,
          * with only the last submitted function call being executed, and then only after the
          * [debounce period]{@link module:alfresco/core/Events#defaultDebounceMs} has elapsed. A common usage for
          * this is for debouncing keypress events (in a text box) that will ultimately trigger an XHR request.
          *
          * @instance
          * @param {Object} args The arguments for this function
          * @param {string} args.name Debounce calls under different names will not be limited by each other,
          *                           so this specifies the name for the group of functions to debounce
          * @param {Function} args.func The function to be called after the debounce expires
          * @param {bool} [args.execFirst=false] By default, the last-provided function will execute after a period of inactivity.
          *                                      Setting this to true will execute the first-provided function immediately and
          *                                      then discard any others that occur during the timeout period, with each subsequent
          *                                      function received within that period extending it by the debounce timeout.
          * @param {bool} [args.isLocal=false] If true then this debounce is a local-only one, i.e. the name will not be
          *                                    shared with the global instances
          * @param {int} [args.timeoutMs] The length of the debounce, if different from the
          *                               [default]{@link module:alfresco/core/Events#defaultDebounceMs}
          */
         debounce: function alfresco_core_Events__debounce(args) {
            this._limit("debounce", args);
         },

         /**
          * Debounce a simple topic publish using the [debounce method]{@link module:alfresco/core/Events#debounce}
          *
          * @instance
          * @param    {string} topic The topic to be published
          * @param    {Object} [args] Can take any of the optional arguments from the [debounce method]{@link module:alfresco/core/Events#debounce}
          */
         debouncedPublish: function(topic, args) {
            var publishFunc = lang.hitch(this, this.alfPublish, topic),
               debounceArgs = lang.mixin({
                  name: topic,
                  func: publishFunc
               }, args || {});
            this.debounce(debounceArgs);
         },

         /**
          * <p>Throttle the supplied function. This means that repeated calls to execute a function will be controlled
          * such that the first call will execute and the last call before the next
          * [throttle period]{@link module:alfresco/core/Events#defaultThrottleMs} will execute, but all others will
          * be discarded.</p>
          * 
          * <p>Example: If the throttle period were 100ms and the function was called at 0ms, 50ms, 90ms, 110ms and 120ms
          * then the first, third and fifth functions would execute at 0ms, 100ms and 200ms respectively, and the second
          * and fourth function calls would be discarded.</p>
          *
          * @instance
          * @param {Object} args The arguments for this function
          * @param {string} args.name Throttle calls under different names will not be limited by each other,
          *                           so this specifies the name for the group of functions to throttle
          * @param {Function} args.func The function to be called after the throttle expires
          * @param {bool} [args.ignoreFirst=false] If set to true, then do not fire the first-received function call,
          *                                        so in the above example, only the third and fifth functions would
          *                                        be executed.
          * @param {bool} [args.isLocal=false] If true then this throttle is a local-only one, i.e. the name will not
          *                                    be shared with the global instances
          * @param {int} [args.timeoutMs] The length of the throttle, if different from the
          *                                [default]{@link module:alfresco/core/Events#defaultThrottleMs}
          */
         throttle: function alfresco_core_Events__throttle(args) {
            this._limit("throttle", args);
         },

         /**
          * Throttle a simple topic publish, using the [throttle method]{@link module:alfresco/core/Events#throttle}
          *
          * @instance
          * @param    {string} topic The topic to be published
          * @param    {Object} [args] Can take any of the optional arguments from the [throttle method]{@link module:alfresco/core/Events#throttle}
          */
         throttledPublish: function(topic, args) {
            var publishFunc = lang.hitch(this, this.alfPublish, topic),
               throttleArgs = lang.mixin({
                  name: topic,
                  func: publishFunc
               }, args || {});
            this.throttle(throttleArgs);
         },

         /**
          * Class constructor
          *
          * @instance
          */
         constructor: function() {

            // Initialise instance variables
            this._local = {
               debounce: {
                  lastExecutions: {},
                  timeouts: {}
               },
               throttle: {
                  lastExecutions: {},
                  timeouts: {}
               }
            };
         },

         /**
          * Implements the functionality of the [debounce]{@link module:alfresco/core/Events#debounce}
          * and [throttle]{@link module:alfresco/core/Events#throttle} methods.
          *
          * @instance
          * @param {string} type Either "throttle" or "debounce"
          * @param {Object} args See the [debounce]{@link module:alfresco/core/Events#debounce} and
          *                      [throttle]{@link module:alfresco/core/Events#throttle} methods
          */
         _limit: function alfresco_core_Events___limit(type, args) {

            // Setup variables
            var pointers = args.isLocal ? this._local[type] : this._global[type],
               timeouts = pointers.timeouts,
               lastExecutions = pointers.lastExecutions,
               name = args.name,
               currentTimeout = timeouts[name],
               lastExecutionTime = lastExecutions[name] || 0,
               execFirst = (args.execFirst === true),
               ignoreFirst = (args.ignoreFirst === true),
               timeoutMs = args.timeoutMs || (type === "throttle" ? this.defaultThrottleMs : this.defaultDebounceMs),
               timeSinceLastExec = Date.now() - lastExecutionTime,
               lastExecWithinTimePeriod = timeSinceLastExec < timeoutMs;

            // Clear any existing timeout
            clearTimeout(currentTimeout);

            // Execute or defer
            if (type === "debounce") {

               // Debounce logic
               if (execFirst) { // Should we run at start of debounce
                  !lastExecWithinTimePeriod && args.func(); // If first run then exec now
                  lastExecutions[name] = Date.now(); // Whether first run or within run-period, update last-exec time
               } else {
                  timeouts[name] = setTimeout(function() { // Not in run-at-start mode, so setTimeout
                     args.func(); // Execute the function
                     lastExecutions[name] = 0; // Reset last-exec time
                  }, timeoutMs); // Defer by defined timeout period
               }

            } else {

               // Throttle logic
               if (lastExecWithinTimePeriod) { // Within a throttle "period"?
                  timeouts[name] = setTimeout(function() { // Defer execution
                     args.func(); // Execute the function
                     lastExecutions[name] = Date.now(); // Update the last-run time
                  }, (timeoutMs - timeSinceLastExec)); // Defer until this period ends
               } else { // Not been run recently
                  if (ignoreFirst) { // Should we ignore the first execution call?
                     timeouts[name] = setTimeout(function() { // Ignore, so defer execution
                        args.func(); // Execute the function
                        lastExecutions[name] = Date.now(); // Update the last-run time
                     }, (timeoutMs - timeSinceLastExec)); // Defer until period ends
                  } else { // Do not ignore first calling
                     args.func(); // Execute the function
                  }
                  lastExecutions[name] = Date.now(); // Update the last execution (request) time
               }
            }
         },


         /******************************************************/
         /******************************************************/
         /******************************************************/


         /**
          * How frequently do we want rate limited events to trigger?
          *
          * @instance
          * @type {int}
          * @default 300
          */
         triggerInterval: 300,

         /**
          * A specific element whose scroll events to monitor
          *
          * @instance
          * @type {element}
          * @default window
          */
         scrollElement: null,

         /**
          * Used to store a handle to cancel the scroll timeout.
          *
          * @instance
          * @type {int}
          * @default: null
          */
         scrollTimeout: null,

         /**
          * Used to store a handle to cancel the resize timeout.
          *
          * @instance
          * @type {int}
          * @default: null
          */
         resizeTimeout: null,

         /**
          * The scroll event triggers once when the page had loaded. Generally we don't need this.
          * Should we ignore it?
          *
          * @instance
          * @type Boolean
          * @default true
          */
         ignoreInitialScroll: true,

         /**
          *  Has the initial scroll event as specified in ignoreInitialScroll happened yet?
          */
         hasInitialScrollHappened: false,

         /**
          * Registers the event listeners.
          *
          * @instance
          */
         registerEventListeners: function alfresco_core_Events__registerEventListeners() {
            this.alfLog("log", "Registering listeners...");

            var targetElement = this.scrollElement || window;
            on(targetElement, "scroll", lang.hitch(this, this.onScroll));

            // TODO: Sweep through modules and replace individual resize listeners with this?
            on(targetElement, "resize", lang.hitch(this, this.onResize));
         },

         /**
          * The limit function. Prevents multiple events triggering in very quick succession.
          *
          * In Throttle mode:
          * Triggers once per triggerInterval for as long as the event keeps being fired.
          * TODO: In throttle mode should event trigger before or after delay? (currently after)
          *
          * In debounce mode:
          * Triggers only once there is a gap of triggerInterval in the event being fired.
          *
          * @instance
          * @param {string} timeout variable name containing timeout.
          * @param {string} topic event to trigger
          * @param {int} triggerInterval Optional override for this.triggerInterval
          * @param {bool} throttle switches to throttle mode.
          */
         _limit2: function alfresco_core_Events___limit(timeout, topic, triggerInterval, throttle) {
            // If we've already got a timeout, we need to rate limit
            if (this[timeout]) {
               if (throttle) {
                  // In throttle mode, ignore subsequent events while timeout exists
                  return;
               }
               // In debounce mode, clear timeout and let a new one get set.
               clearTimeout(this[timeout]);
            }

            var timer = triggerInterval || this.triggerInterval;

            // set a timeout, storing a reference to allow us to check status/cancel later.
            this[timeout] = setTimeout(lang.hitch(this, "onTimeout", topic, timeout), timer);
         },

         /**
          * Calls [_limit]{@link module:alfresco/core/Events#_limit} in debounce mode.
          * @instance
          * @param {int} timeout
          * @param {string} topic
          * @param {int} triggerInterval
          */
         _debounce: function alfresco_core_Events___debounce(timeout, topic, triggerInterval) {
            this._limit(timeout, topic, triggerInterval, false);
         },

         /**
          * Calls [_limit]{@link module:alfresco/core/Events#_limit} in throttle mode.
          * @instance
          * @param {int} timeout
          * @param {string} topic
          * @param {int} triggerInterval
          */
         _throttle: function alfresco_core_Events___throttle(timeout, topic, triggerInterval) {
            this._limit(timeout, topic, triggerInterval, true);
         },

         /**
          * Called by _limit once the event triggers.
          * Publishes the requested topic & clears any timeout.
          *
          * @instance
          * @param {string} topic
          * @param {string} timeout variable name for var containing the timeout ref.
          */
         onTimeout: function alfresco_core_Events__onTimeout(topic, timeout) {
            this.alfPublish(topic);
            // clear the timeout so events can trigger again.
            this[timeout] = false;
         },

         /**
          * Throttles browser scroll events.
          * The event only triggers every [triggerInterval]{@link module:alfresco/core/Events#triggerInterval} ms.
          *
          * @instance
          * @fires eventsScrollTopic
          */
         onScroll: function alfresco_core_Events__onScroll() {
            // TODO: For performance, the throttle call probably shouldn't happen in an if statement.
            if (this.ignoreInitialScroll && !this.hasInitialScrollHappened) {
               this.hasInitialScrollHappened = true;
            } else {
               this._throttle("scrollTimeout", this.eventsScrollTopic);
            }
         },

         /**
          * Debounces browser resize events.
          * Event triggers once the user stops resizing for [triggerInterval]{@link module:alfresco/core/Events#triggerInterval} ms.
          *
          * @instance
          * @fires eventsResizeTopic
          */
         onResize: function alfresco_core_Events__onResize() {
            this._debounce("resizeTimeout", this.eventsResizeTopic);
         }
      });
   });