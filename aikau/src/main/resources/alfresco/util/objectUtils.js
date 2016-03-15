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
 * Utility object for object-related utilities. Note that this is not a Class, and so does
 * not need to be instantiated before use.
 *
 * @module alfresco/util/objectUtils
 * @author Martin Doyle
 * @since 1.0.44
 */
define([
      "dojo/_base/array",
      "dojo/_base/lang"
   ],
   function(array, lang) {
      /*jshint maxlen:false*/

      // The private container for the functionality and properties of the util
      var util = {

         // See API below
         evaluateRules: function alfresco_util_objectUtils__evaluateRules(rules, successHandler, failureHandler) {
            /*jshint devel:true*/

            // Setup variables
            var testValue = lang.getObject(rules.attribute, false, rules.testObject),
               hasIsRules = rules.is && rules.is.constructor === Array && rules.is.length,
               hasIsNotRules = rules.isNot && rules.isNot.constructor === Array && rules.isNot.length;

            // Log a warning if rules are not valid
            if (rules.is !== null && typeof rules.is !== "undefined" && rules.is.constructor !== Array) {
               console.warn("alfresco_util_objectUtils__evaluateRules() - \"is\" rules provided but not an array: " + JSON.stringify(rules.is));
            }
            if (rules.isNot !== null && typeof rules.isNot !== "undefined" && rules.isNot.constructor !== Array) {
               console.warn("alfresco_util_objectUtils__evaluateRules() - \"isNot\" rules provided but not an array: " + JSON.stringify(rules.isNot));
            }

            // Test the validity
            var comparatorFunc = rules.useLegacyProcessing === false ? this._ruleComparator : this._legacyRuleComparator,
               ruleEvaluator = lang.partial(comparatorFunc, testValue, rules.lookupObject),
               isInvalid = hasIsNotRules && array.some(rules.isNot, ruleEvaluator),
               isValid = !isInvalid && (!hasIsRules || array.some(rules.is, ruleEvaluator));

            // Deal with the results
            if (isValid && !isInvalid) {
               if (rules.negate) {
                  failureHandler && failureHandler();
               } else {
                  successHandler();
               }
            } else if (rules.strict) {
               if (rules.negate) {
                  successHandler();
               } else {
                  failureHandler && failureHandler();
               }
            }
         },

         // The legacy rule comparator
         _legacyRuleComparator: function alfresco_util_objectUtils___legacyRuleComparator(actualValue, lookupObject, expectedValue) {
            /*jshint eqnull:true*/
            if (actualValue == null && expectedValue == null) {
               return true;
            } else if (actualValue != null && typeof actualValue.toString === "function" && expectedValue != null && typeof expectedValue.toString === "function") {
               if (lookupObject) {
                  expectedValue = lang.getObject(expectedValue.toString(), false, lookupObject);
                  return expectedValue === actualValue.toString();
               } else {
                  return expectedValue.toString() === actualValue.toString();
               }
            } else {
               return false;
            }
         },

         // The updated rule comparator
         _ruleComparator: function alfresco_util_objectUtils___ruleComparator(actualValue, lookupObject, expectedValue) {
            var expected = lookupObject ? lang.getObject(expectedValue, false, lookupObject) : expectedValue;
            return (actualValue === expected);
         }

      };

      /**
       * The public API for this utility class
       *
       * @alias module:alfresco/util/objectUtils
       */
      return {

         /**
          * <p>The Rules object (as used in [evaluateRules]{@link module:alfresco/util/objectUtils#evaluateRules}).</p>
          *
          * <p>The value under test (test-value) is retrieved from the "testObject" property using the path defined in "attribute". The rules are then evaluated as follows:</p>
          *
          * <ul>
          *    <li>If neither "is" nor "isNot" are specified then the test-value is valid and the success callback will be executed</li>
          *    <li>If only "is" is provided then the success callback will be executed if the test-value is within the "is" values</li>
          *    <li>If only "isNot" is provided then the success callback will be executed if the test-value is not within the "isNot" values</li>
          *    <li>If both "is" and "isNot" are provided then the test-value must NOT be in the "isNot" values. If that test passes then it will then be checked to ensure it is present in the "is" values. If both these tests pass then the success callback will be executed</li>
          *    <li>The failure callback is NOT normally executed. In order for it to execute, the test-value must be invalid according to the above rules and the "strict" flag should be set to true<li>
          *    <li>If the "negate" flag is set to true then it will directly inverse the above logic. If a success callback would have been executed then a failure callback will now be, and vice versa</li>
          * </ul>
          *
          * @instance
          * @typedef {object} Rules
          * @property {string} attribute The dot-notation path to the value retrieve from the object under test
          * @property {object} testObject The object under test
          * @property {object} [lookupObject] If this is supplied then treat the values contained in the rules as paths
          *                                   to the true comparison value within this lookupObject
          * @property {*} [is] The tested value MUST be equal to at least one of these values if provided (must be array)
          * @property {*} [isNot] The tested value must NOT be equal to any of these values if provided (must be array)
          * @property {boolean} [negate] Invert the final result
          * @property {boolean} [strict] See description above
          * @property {boolean} [useLegacyProcessing=true] Use the legacy algorithms for evaluating matches
          */

         /**
          * Evaluate the supplied [rules object]{@link module:alfresco/util/objectUtils#Rules}, and then
          * apply the success or failure callback as appropriate.
          *
          * @instance
          * @param {string} topic The topic on which to subscribe
          * @param {module:alfresco/util/objectUtils#Rules} rules The rules object to apply to the published payload
          * @param {function} successHandler The function to run if the rules match the payload
          * @param {function} [failureHandler] The function to run if the rules do not match the payload (or )
          * @param {boolean} [global] Indicates that the pub/sub scope should not be applied
          * @param {boolean} [parentScope] Indicates that the pub/sub scope inherited from the parent should be applied
          * @returns {object} A handle to the subscription
          */
         evaluateRules: lang.hitch(util, util.evaluateRules)
      };
   });