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
       * @instance
       * @param {string} v The value to process.
       * @returns The processed value
       */
      processInstanceTokens: function alfresco_core_ObjectProcessingMixin__processInstanceTokens(v) {
         // Only replace a value if it actually exists, otherwise leave the token exactly as is.
         var u = lang.replace(v, lang.hitch(this, this.safeReplace, this));
         return u;
      },

      /**
       * This utility function will perform token substitution on the supplied string value using the
       * values from currentItem. If the token cannot be found in the currnentItem then it will be left 
       * as is (including the curly braces).
       *
       * @instance
       * @param {string} v The value to process.
       * @returns The processed value
       */
      processCurrentItemTokens: function alfresco_core_ObjectProcessingMixin__processCurrentItemTokens(v) {
         // Only replace a value if it actually exists, otherwise leave the token exactly as is.
         var u = lang.replace(v, lang.hitch(this, this.safeReplace, this.currentItem));
         return u;
      },

      /**
       * This utility function will convert any NodeRef token into a URL friendly version (e.g. the "://" will
       * be converted to "/")
       *
       * @instance
       * @param {string} v The value to process
       * @returns The processed value
       */
      convertNodeRefToUrl: function alfresco_core_ObjectProcessingMixin__convertNodeRefToUrl(v) {
         return v.replace(":/", "");
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
         if (existingValue == null)
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
       * @param {array} functions An array of functions to apply to values
       * @param {object} o The object to process
       * @return {object} The processed object
       */
      processObject: function alfresco_core_ObjectProcessingMixin__processObject(functions, o) {
         for (var key in o)
         {
            var v = o[key];
            if (ObjectTypeUtils.isString(v))
            {
               array.forEach(functions, lang.hitch(this, this.applyFunction, o, key));
            }
            else if (ObjectTypeUtils.isArray(v))
            {
               array.forEach(v, function(entry, index) {
                  // Needs special handling for arrays of strings...
                  if (ObjectTypeUtils.isString(entry))
                  {
                     array.forEach(functions, lang.hitch(this, this.applyFunction, v, index));
                  }
                  else
                  {
                     this.processObject(functions, entry);
                  }
               }, this);
            }
            else if (ObjectTypeUtils.isObject(v))
            {
               o[key] = this.processObject(functions, v);
            }
         }
         return o;
      },

      /**
       * Apply the supplied function to the value of the supplied key in the supplied object
       * 
       * @instance
       * @param {object} o The object to get the value from
       * @param {string} key The key of the object to use
       * @param {string} f The name of the function to apply
       */
      applyFunction: function alfresco_core_ObjectProcessingMixin__applyFunction(o, key, f) {
         var v = o[key];
         if (typeof f == "function")
         {
            v = f.apply(this, [v]);
         }
         else if (typeof this[f] == "function")
         {
           v = this[f].apply(this, [v]);
         }
         else
         {
            this.alfLog("warn", "The supplied function was not valid", f, this);
         }
         o[key] = v;
      }
   });
});