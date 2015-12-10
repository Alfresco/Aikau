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
 * This mixin module is primarily provided for allowing publication payloads to be be processed
 * using a set of utility functions. It was written to be used by the
 * [_PublishPayloadMixin]{@link module:alfresco/renderers/_PublishPayloadMixin} but can be mixed into
 * any module that needs to take advantage of the object processing capabilities that it provides.
 *
 * @module alfresco/core/ObjectProcessingMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "alfresco/core/ObjectTypeUtils"],
        function(declare, lang, array, ObjectTypeUtils) {

   return declare(null, {

      /**
       * This utility function will convert the value "___AlfCurrentItem" into the actual
       * currentItem object. It will return the supplied value if it is anything else.
       *
       * @instance
       * @param {string} v The value to process.
       * @returns The processed value
       */
      setCurrentItem: function alfresco_core_ObjectProcessingMixin__setCurrentItem(v) {
         if (v === "___AlfCurrentItem")
         {
            return this.currentItem;
         }
         else
         {
            return v;
         }
      },

      /**
       * This utility function will perform token substitution on the supplied string value using the
       * values from the calling object. If the token cannot be found in the calling object then it will be left
       * as is (including the curly braces).
       *
       * @param value {String} - the token to replace
       * @param object {Object} - the object containing the token
       * @return {*}
       */
      processTokens: function alfresco_core_ObjectProcessingMixin__processTokens(value, object) {
         // Default to returning the input value if it doesn't match.
         var processedValue = value;

         // Regular expression to match token in curly braces
         var re = /^{[a-zA-Z_$][0-9a-zA-Z_$]*}$/g;

         // If the whole string is the token, replace it if it matches
         if (re.test(value)) {
            // Strip off curly braces
            var tokenWithoutBraces = value.slice(1, -1);

            // If taken exists in object, replace it.
            if (typeof object[tokenWithoutBraces] !== "undefined") {
               processedValue = object[tokenWithoutBraces];
            }
         }
         else {
            // Deal with multiple tokens in the string.
            processedValue = lang.replace(value, lang.hitch(this, this.safeReplace, object));
         }
         return processedValue;
      },

      /**
       * Wrapper for processTokens, searching within this
       *
       * @instance
       * @param {string} valueToProcess The value to process.
       * @returns {*} The processed value
       */
      processInstanceTokens: function alfresco_core_ObjectProcessingMixin__processInstanceTokens(valueToProcess) {
         // Search for tokens in the current scope
         return this.processTokens(valueToProcess, this);
      },

      /**
       * Wrapper for processTokens, searching within currentItem
       *
       * @instance
       * @param {string} valueToProcess The value to process.
       * @returns {*} The processed value
       */
      processCurrentItemTokens: function alfresco_core_ObjectProcessingMixin__processCurrentItemTokens(valueToProcess) {
         // Search for tokens in the current item
         return this.processTokens(valueToProcess, this.currentItem);
      },

      /**
       * Wrapper for processTokens, searching within currentMetadata
       *
       * @instance
       * @param {string} valueToProcess The value to process.
       * @returns {*} The processed value
       * @since 1.0.43
       */
      processCurrentMetadataTokens: function alfresco_core_ObjectProcessingMixin__processCurrentMetadataTokens(valueToProcess) {
         // Search for tokens in the current metadata
         return this.processTokens(valueToProcess, this.currentMetadata);
      },

      /**
       * This utility function will convert any NodeRef token into a URL friendly version (e.g. the "://" will
       * be converted to "/")
       *
       * @instance
       * @param {string} nodeRef The value to process
       * @returns The processed value
       */
      convertNodeRefToUrl: function alfresco_core_ObjectProcessingMixin__convertNodeRefToUrl(nodeRef) {
         return nodeRef.replace(":/", "");
      },

      /**
       * This replace function updates the default Dojo replace function to only replace tokens if the token is a key in the supplied object.
       *
       * @param {object} sourceObject The object to retrieve values from.
       * @param {string} tokenIncudingBraces The token including braces (e.g. "{token}")
       * @param {string} tokenWithoutBraces The token without braces (e.g. "token")
       * @return {string} The replacement value
       */
      safeReplace: function alfresco_code_ObjectProcessingMixin__safeReplace(sourceObject, tokenIncudingBraces, tokenWithoutBraces) {
         var existingValue = lang.getObject(tokenWithoutBraces, false, sourceObject);
         if (existingValue === null || typeof existingValue === "undefined")
         {
            return tokenIncudingBraces;
         }
         else
         {
            return existingValue;
         }
      },

      /**
       * This utility function will replaced all colons in a string with underscores. This has been provided
       * for assisting with processing qnames into values that can be included in a URL.
       *
       * @instance
       * @param {string} v The value to process.
       * @returns {string} The processed value.
       */
      replaceColons: function alfresco_core_ObjectProcessingMixin__replaceColons(v) {
         var u = v.replace(/:/g, "_");
         return u;
      },

      /**
       * This utility function can be used to work through the supplied object and process string
       * values with all the supplied functions.
       *
       * @intance
       * @param {function[]|string[]} functions An array of functions or function names (within "this" scope) to apply to values
       * @param {object} obj The object to process
       * @param {object[]} [ancestors=[]] An ancestors stack, used to check for recursion
       * @return {object} The processed object
       */
      processObject: function alfresco_core_ObjectProcessingMixin__processObject(functions, obj, ancestors) {
         /*jshint loopfunc:true*/
         ancestors = ancestors || [];
         for (var key in obj)
         {
            if (obj.hasOwnProperty(key))
            {
               var value = obj[key];
               if (ObjectTypeUtils.isString(value))
               {
                  array.forEach(functions, lang.hitch(this, this.applyFunction, obj, key));
               }
               else if (ObjectTypeUtils.isArray(value))
               {
                  array.forEach(value, function(entry, index) {
                     // Needs special handling for arrays of strings...
                     if (ObjectTypeUtils.isString(entry))
                     {
                        array.forEach(functions, lang.hitch(this, this.applyFunction, value, index));
                     }
                     else if (array.indexOf(ancestors, value) === -1)
                     {
                        this.processObject(functions, entry, ancestors.concat(obj));
                     }
                  }, this);
               }
               else if (ObjectTypeUtils.isObject(value) && array.indexOf(ancestors, value) === -1)
               {
                  obj[key] = this.processObject(functions, value, ancestors.concat(obj));
               }
            }
         }
         return obj;
      },

      /**
       * Apply the supplied function to the value of the supplied key in the supplied object
       *
       * @instance
       * @param {object} obj The object to get the value from
       * @param {string} key The key of the object to use
       * @param {function|string} func A function or function name (within "this" scope) to apply to values
       */
      applyFunction: function alfresco_core_ObjectProcessingMixin__applyFunction(obj, key, func) {
         var value = obj[key];
         if (typeof func === "function")
         {
            value = func.apply(this, [value]);
         }
         else if (typeof this[func] === "function")
         {
           value = this[func].apply(this, [value]);
         }
         else
         {
            this.alfLog("warn", "The supplied function was not valid", func, this);
         }
         obj[key] = value;
      }
   });
});