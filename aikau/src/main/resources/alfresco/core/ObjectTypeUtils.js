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
 * A mixin that provides the ability to test object types simply. Currently this just aliases the
 * Dojo lang calls which have been deprecated. This allows us to handle the deprecation of those
 * utility functions just from this module. 
 * 
 * @module alfresco/core/ObjectTypeUtils
 * @author Dave Draper
 */
define(["dojo/_base/lang"], 
        function(lang) {
   
   return {
      
      /**
       * Checks to see if the supplied argument is a string.
       * 
       * @instance
       * @param {unknown} The value to test
       * @returns {boolean} Returns true if the supplied value is a string
       */
      isString: function alfresco_core_ObjectTypeUtils__isString(value) {
         return lang.isString(value);
      },

      /**
       * Checks to see if the supplied argument is a boolean.
       *
       * @instance
       * @param {unknown}
       * @returns {boolean} Returns true if the supplied value is a boolean
       */
      isBoolean: function(value) {
        return typeof value === 'boolean';
      },

      /**
       * Checks to see if the supplied argument is a number.
       *
       * @instance
       * @param {unknown}
       * @returns {boolean} Returns true if the supplied value is a number
       */
      isNumber: function(value) {
        return typeof value === 'number' && isFinite(value);
      },
      
      /**
       * Checks to see if the supplied argument is an object.
       * 
       * @instance
       * @param {unknown} The value to test
       * @returns {boolean} Returns true if the supplied value is an object
       */
      isObject: function alfresco_core_ObjectTypeUtils__isObject(value) {
         return lang.isObject(value);
      },
      
      /**
       * Checks to see if the supplied argument is an array.
       * 
       * @instance
       * @param {unknown} The value to test
       * @returns {boolean} Returns true if the supplied value is an array
       */
      isArray: function alfresco_core_ObjectTypeUtils__isArray(value) {
         return lang.isArray(value);
      },

      /**
       * Checks to see if the supplied argument is undefined
       *
       * @instance
       * @param {unknown} The value to test
       * @returns {boolean} Returns true if the supplied value is undefined
       */
      isUndefined: function alfresco_core_ObjectTypeUtils__isUndefined(value) {
        return typeof value === 'undefined';
      },

      /**
       * Check a value is neither undefined nor null (returns false).
       * An empty string also returns false unless the allowEmptyString flag is set.
       * @instance
       * @param {object} value Parameter to check
       * @param {boolean} allowEmptyString Optional flag to indicate that empty strings are valid inputs.
       * @return {boolean} Flag indicating whether the value is set or not.
       */
      isValueSet: function alfresco_core_ObjectTypeUtils__isValueSet(value, allowEmptyString) {
         if (this.isUndefined(value) || value == null)
         {
            return false;
         }
         if (this.isString(value) && value.length === 0 && allowEmptyString === false)
         {
            return false;
         }
         return true;
      }
   };
});