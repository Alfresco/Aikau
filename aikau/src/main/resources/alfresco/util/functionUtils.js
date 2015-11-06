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
 * Utility object for function-related utilities. Note that this is not a Class, and so does
 * not need to be instantiated before use.
 *
 * @module alfresco/util/functionUtils
 * @author Martin Doyle
 */
define([
      "dojo/_base/array",
      "dojo/_base/lang"
   ],
   function(array, lang) {

      // Define the repeating periods variables.
      var REPEATING_PERIODS = {
         "SHORT": {
            delay: 100,
            funcs: {}
         },
         "MEDIUM": {
            delay: 1000,
            funcs: {}
         },
         "LONG": {
            delay: 10000,
            funcs: {}
         }
      };

      // The private container for the functionality and properties of the util
      var util = {

         // See API below
         defaultDebounceMs: 250,

         // See API below
         defaultThrottleMs: 250,

         // A holder for the debounce-functionality pointers/variables, where the keys are the names provided to the limiting function
         debounceVars: {
            lastExecutions: {},
            timeouts: {}
         },

         // A holder for the debounce-functionality pointers/variables, where the keys are the names provided to the limiting function
         throttleVars: {
            lastExecutions: {},
            timeouts: {}
         },

         // See API below
         addRepeatingFunction: function alfresco_util_functionUtils__addRepeatingFunction(newFunc, periodType) {

            // Put the new function into the appropriate collection
            var period = REPEATING_PERIODS[periodType],
               currentFuncs = period.funcs,
               newFuncKey = Date.now();
            if (currentFuncs) {
               while (currentFuncs.hasOwnProperty(newFuncKey)) {
                  newFuncKey = Date.now();
               }
               currentFuncs[newFuncKey] = newFunc;
            }

            // Make sure the period's functions are running
            if (!period.running) {
               this._startRepeatingTimeout(period);
            }

            // Pass back the removal object
            return {
               remove: function() {
                  delete currentFuncs[newFuncKey];
               }
            };
         },

         // See API below
         debounce: function alfresco_util_functionUtils__debounce(args) {
            return this._limit("debounce", args);
         },

         // See API below
         throttle: function alfresco_util_functionUtils__throttle(args) {
            return this._limit("throttle", args);
         },

         // Implements the functionality of the debounce and throttle methods
         _limit: function alfresco_util_functionUtils___limit(type, args) {

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

            // Pass back a remove-object for cancelling the queued function
            return {
               remove: function() {
                  clearTimeout(currentTimeout);
               }
            };
         },

         // Start calling a repeating function
         _startRepeatingTimeout: function alfresco_util_functionUtils___startRepeatingTimeout(period) {
            setTimeout(function alfresco_util_functionUtils___timeoutFunc() {
               var funcKeys = Object.keys(period.funcs);
               if (funcKeys.length) {
                  array.forEach(funcKeys, function(funcKey) {
                     /*jshint devel:true*/
                     try {
                        period.funcs[funcKey]();
                     } catch (e) {
                        console.error("Removing erroring periodic function: " + period.funcs[funcKey]);
                        delete period.funcs[funcKey];
                     }
                  });
                  setTimeout(alfresco_util_functionUtils___timeoutFunc, period.delay);
               } else {
                  delete period.running;
               }
            }, period.delay);
         }
      };

      /**
       * The public API for this utility class
       * 
       * @alias module:alfresco/util/functionUtils
       */
      return {

         /**
          * The default timeout for debounce calls
          *
          * @instance
          * @type {number}
          * @default 250
          */
         defaultDebounceMs: util.defaultDebounceMs,

         /**
          * The default timeout for throttle calls
          *
          * @instance
          * @type {number}
          * @default 250
          */
         defaultThrottleMs: util.defaultThrottleMs,

         /**
          * Register a new repeating function.
          *
          * @instance
          * @function
          * @param {function} func The function to be added
          * @param {string} period One of "SHORT" (100ms), "MEDIUM" (1000ms) or "LONG" (10000ms), to determine how often the function is called
          * @returns {object} An object with a remove method on it, which will de-register this function
          */
         addRepeatingFunction: lang.hitch(util, util.addRepeatingFunction),

         /**
          * <p>Debounce the supplied function.</p>
          * 
          * <p>This means that repeated calls to execute a function will be batched up,
          * with only the last submitted function call being executed, and then only after the
          * [debounce period]{@link module:alfresco/util/functionUtils#defaultDebounceMs} has elapsed. A common usage for
          * this is for debouncing keypress events (in a text box) that will ultimately trigger an XHR request.</p>
          *
          * @instance
          * @function
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
          * @return {Object} An object containing a remove() function which will clear any outstanding timeout
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
          * <p>Example: If the throttle period were 250ms and the function was called at 0ms, 60ms, 120ms, 280ms and 400ms
          * then the first, third and fifth functions would execute at 0ms, 250ms and 500ms respectively, and the second
          * and fourth function calls would be discarded.</p>
          *
          * @instance
          * @function
          * @param {Object} args The arguments for this function
          * @param {string} args.name Throttle calls under different names will not be limited by each other,
          *                           so this specifies the name for the group of functions to throttle
          * @param {Function} args.func The function to be called after the throttle expires
          * @param {bool} [args.ignoreFirst=false] If set to true, then do not fire the first-received function call,
          *                                        so in the above example, only the third and fifth functions would
          *                                        be executed.
          * @param {int} [args.timeoutMs] The length of the throttle, if different from the
          *                               [default]{@link module:alfresco/util/functionUtils#defaultThrottleMs}
          * @return {Object} An object containing a remove() function which will clear any outstanding timeout
          */
         throttle: lang.hitch(util, util.throttle)
      };
   });