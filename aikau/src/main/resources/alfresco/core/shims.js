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
         this._addArrayIsArray();
         this._addArrayReduce();
         this._addDateNow();
         this._addObjectKeys();
         this._addTextContent();
         _applied = true;
      },

      /**
       * Add an isArray() function to the global Array object.
       * From https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Polyfill
       *
       * @protected
       * @instance
       * @since 1.0.56
       */
      _addArrayIsArray: function alfresco_core_shim___addArrayIsArray() {
         if (!Array.isArray) {
           Array.isArray = function(arg) {
             return Object.prototype.toString.call(arg) === "[object Array]";
           };
         }
      },

      /**
       * Add a reduce() function to the global Array object, because dojo/_base/array does not support it.
       * From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Polyfill
       *
       * @protected
       * @instance
       * @since 1.0.52
       */
      _addArrayReduce: function alfresco_core_shim___addArrayReduce() {
         /*jshint bitwise:false,freeze:false,eqnull:true*/

         // Production steps of ECMA-262, Edition 5, 15.4.4.21
         // Reference: http://es5.github.io/#x15.4.4.21
         if (!Array.prototype.reduce) {
            Array.prototype.reduce = function(callback /*, initialValue*/ ) {
               "use strict";
               if (this == null) {
                  throw new TypeError("Array.prototype.reduce called on null or undefined");
               }
               if (typeof callback !== "function") {
                  throw new TypeError(callback + " is not a function");
               }
               var t = Object(this),
                  len = t.length >>> 0,
                  k = 0,
                  value;
               if (arguments.length === 2) {
                  value = arguments[1];
               } else {
                  while (k < len && !(k in t)) {
                     k++;
                  }
                  if (k >= len) {
                     throw new TypeError("Reduce of empty array with no initial value");
                  }
                  value = t[k++];
               }
               for (; k < len; k++) {
                  if (k in t) {
                     value = callback(value, t[k], k, t);
                  }
               }
               return value;
            };
         }
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
      },

      /**
       * Allow setting of textContent on elements in IE8
       * From https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
       *
       * @protected
       * @instance
       * @since 1.0.49
       */
      _addTextContent: function alfresco_core_shim___addTextContent() {
         if (Object.defineProperty && Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(Element.prototype, "textContent") && !Object.getOwnPropertyDescriptor(Element.prototype, "textContent").get) {
            (function() {
               var innerText = Object.getOwnPropertyDescriptor(Element.prototype, "innerText");
               Object.defineProperty(Element.prototype, "textContent", {
                  get: function() {
                     return innerText.get.call(this);
                  },
                  set: function(s) {
                     return innerText.set.call(this, s);
                  }
               });
            })();
         }
      }
   };
});