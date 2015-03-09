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
 * This shims class adds extra functionality to the core browser objects. It's used for
 * things like adding ES5 functionality where it makes sense to do so rather than using
 * Dojo to provide the cross-browser functionality.
 *
 * @module alfresco/core/shims
 * @author Martin Doyle
 */
define([], function() {

   // Only apply the shims once!
   var _applied = false;

   // Pass back the shims object (not a class!)
   return {

      /**
       * Apply the current shims.
       *
       * @instance
       */
      apply: function alfresco_core_shim__apply() {
         if (_applied) {
            return;
         }
         this._addObjectKeys();
         this._addDateNow();
         _applied = true;
      },

      /**
       * Add a now() function to the global Date object.
       * From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
       *
       * @protected
       * @instance
       */
      _addDateNow: function alfresco_core_shim___addDateNow() {
         if (!Date.now) {
            Date.now = function now() {
               return new Date().getTime();
            };
         }
      },

      /**
       * Add a keys() function to the global Object object.
       * From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
       *
       * @protected
       * @instance
       */
      _addObjectKeys: function alfresco_core_shim___addObjectKeys() {
         if (!Object.keys) {
            Object.keys = (function() {
               "use strict";
               var hasOwnProperty = Object.prototype.hasOwnProperty,
                  hasDontEnumBug = !({
                     toString: null
                  }).propertyIsEnumerable("toString"),
                  dontEnums = [
                     "toString",
                     "toLocaleString",
                     "valueOf",
                     "hasOwnProperty",
                     "isPrototypeOf",
                     "propertyIsEnumerable",
                     "constructor"
                  ],
                  dontEnumsLength = dontEnums.length;

               return function(obj) {
                  if (typeof obj !== "object" && (typeof obj !== "function" || obj === null)) {
                     throw new TypeError("Object.keys called on non-object");
                  }

                  var result = [],
                     prop, i;

                  for (prop in obj) {
                     if (hasOwnProperty.call(obj, prop)) {
                        result.push(prop);
                     }
                  }

                  if (hasDontEnumBug) {
                     for (i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) {
                           result.push(dontEnums[i]);
                        }
                     }
                  }
                  return result;
               };
            }());
         }
      }
   };
});