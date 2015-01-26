/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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
 * A utility class for working with arrays. The functions in this module are based on those
 * originally found in the YUI based alfresco.js file.
 * 
 * @module alfresco/core/ArrayUtils
 * @author Dave Draper
 */
define(["dojo/_base/lang"], 
        function(lang) {
   
   return {
      
      /**
       * Returns the index of an object in an array
       *
       * @instance
       * @param {array} arr Array to search through
       * @param {object} el The element to be searched for in the array
       * @returns {int|null} element index within array (or null if not found).
       */
      findInArray: function alfresco_core_ArrayUtils__findInArray(arr, value, attr) {
         var index = this.arrayIndex(arr, value, attr);
         return index !== -1 ? arr[index] : null;
      },

      /**
       * Check if an array contains an object
       *
       * @instance
       * @param {array} arr Array to convert to object
       * @param {object} el The element to be searched for in the array
       * @returns {boolean} True if arr contains el
       */
      arrayContains: function alfresco_core_ArrayUtils__arrayContains(arr, el) {
         return this.arrayIndex(arr, el) !== -1;
      },

      /**
       * Removes element el from array arr
       *
       * @instance
       * @param {array} arr Array to remove el from
       * @param {object} el The element to be removed
       * @returns {boolean} The array now without the element
       */
      arrayRemove: function alfresco_core_ArrayUtils__arrayRemove(arr, el) {
         var i = this.arrayIndex(arr, el);
         while (i !== -1)
         {
            arr.splice(i, 1);
            i = this.arrayIndex(arr, el);
         }
         return arr;
      },

      /**
       * Finds the index of an object in an array
       *
       * @instance
       * @param {array} arr Array to search in
       * @param {object} value The element to find the index for in the array
       * @param {string} attr (Optional) If provided, valu ewill be compared to an attribute inside the object, instead of compared to the object itself.
       * @returns {integer} -1 if not found, other wise the index
       */
      arrayIndex: function alfresco_core_ArrayUtils__arrayIndex(arr, value, attr) {
         if (arr)
         {
            for (var i = 0, ii = arr.length; i < ii; i++)
            {
               if (attr)
               {
                  if (arr[i] && arr[i][attr] == value)
                  {
                     return i;
                  }
               }
               else if (arr[i] == value)
               {
                  return i;
               }
            }
         }
         return -1;
      }
   };
});