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
 * Utility class for function-related utilities. Note that this is not a Class, and so does
 * not need to be instantiated before use.
 *
 * @module alfresco/util/functionUtils
 * @author Martin Doyle
 */
define(["dojo/_base/lang"],
   function(lang) {

      // The private container for the functionality and properties of the util
      var util = {

         /**
          * The default timeout for debounce calls
          *
          * @instance
          * @private
          * @type {number}
          * @default
          */
         defaultDebounceMs: 250,

         /**
          * The default timeout for throttle calls
          *
          * @instance
          * @private
          * @type {number}
          * @default
          */
         defaultThrottleMs: 100,

         /**
          * A holder for the debounce-functionality pointers/variables, where the keys are the names provided to the
          * limiting function
          *
          * @instance
          * @private
          * @type {Object}
          */
         debounceVars: {
            lastExecutions: {},
            timeouts: {}
         },

         /**
          * A holder for the debounce-functionality pointers/variables, where the keys are the names provided to the
          * limiting function
          *
          * @instance
          * @private
          * @type {Object}
          */
         throttleVars: {
            lastExecutions: {},
            timeouts: {}
         },

         // See JSDoc in API below
         debounce: function alfresco_core_Events__debounce(args) {
            this._limit("debounce", args);
         },

         // See JSDoc in API below
         throttle: function alfresco_core_Events__throttle(args) {
            this._limit("throttle", args);
         },

         /**
          * Implements the functionality of the [debounce]{@link module:alfresco/util/functionUtils#debounce}
          * and [throttle]{@link module:alfresco/util/functionUtils#throttle} methods.
          *
          * @instance
          * @param {string} type Either "throttle" or "debounce"
          * @param {Object} args See the [debounce]{@link module:alfresco/util/functionUtils#debounce} and
          *                      [throttle]{@link module:alfresco/util/functionUtils#throttle} methods
          */
         _limit: function alfresco_core_Events___limit(type, args) {

            // Setup variables
            var pointers = this[type + "Vars"],
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
                     }, timeoutMs); // Defer until period ends
                  } else { // Do not ignore first calling
                     args.func(); // Execute the function
                  }
                  lastExecutions[name] = Date.now(); // Update the last execution (request) time
               }
            }
         }
      };

      /**
       * The public API for this utility class
       * 
       * @alias module:alfresco/util/func
       */
      return {

         /**
          * <p>Debounce the supplied function.</p>
          * 
          * <p>This means that repeated calls to execute a function will be batched up,
          * with only the last submitted function call being executed, and then only after the
          * [debounce period]{@link module:alfresco/util/functionUtils#defaultDebounceMs} has elapsed. A common usage for
          * this is for debouncing keypress events (in a text box) that will ultimately trigger an XHR request.</p>
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
          * @param {int} [args.timeoutMs] The length of the debounce, if different from the
          *                               [default]{@link module:alfresco/util/functionUtils#defaultDebounceMs}
          */
         debounce: lang.hitch(util, util.debounce),

         /**
          * <p>Throttle the supplied function.</p>
          * 
          * <p>This means that repeated calls to execute a function will be controlled
          * such that the first call will execute and the last call before the next
          * [throttle period]{@link module:alfresco/util/functionUtils#defaultThrottleMs} will execute, but all others will
          * be discarded.</p>
          * 
          * <p>Example: If the throttle period were 100ms and the function was called at 0ms, 30ms, 60ms, 120ms and 170ms
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
          * @param {int} [args.timeoutMs] The length of the throttle, if different from the
          *                               [default]{@link module:alfresco/util/functionUtils#defaultThrottleMs}
          */
         throttle: lang.hitch(util, util.throttle)
      };
   });