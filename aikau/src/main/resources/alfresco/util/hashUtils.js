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
 * Utility object for hash-related utilities. Note that this is not a Class, and so does
 * not need to be instantiated before use.
 *
 * @module alfresco/util/hashUtils
 * @author Martin Doyle
 */
define(["dojo/_base/lang",
        "dojo/hash",
        "dojo/io-query"],
        function(lang, hash, ioQuery) {

   // The private container for the functionality and properties of the util
   var util = {

      // See API below
      getHash: function alfresco_util_hashUtils__getHash() {
         var currHash = hash(),
            hashObj = ioQuery.queryToObject(currHash);
         return hashObj;
      },

      // See API below
      setHash: function alfresco_util_hashUtils__getHash(hashObj, replace) {
         var newHash = ioQuery.objectToQuery(hashObj);
         hash(newHash, replace);
      },

      // See API below
      updateHash: function alfresco_util_hashUtils__getHash(newValues, replace, force) {
         var hashObj = this.getHash(),
            hashName,
            newHashValue,
            oldHashValue,
            hashChanged;
         for (hashName in newValues) {
            if (newValues.hasOwnProperty(hashName)) {
               newHashValue = newValues[hashName];
               oldHashValue = hashObj[hashName];
               if ((typeof newHashValue === "undefined" || newHashValue === null) && hashObj.hasOwnProperty(hashName)) {
                  delete hashObj[hashName];
                  hashChanged = true;
               } else {
                  newHashValue = "" + newHashValue;
                  if (newHashValue !== oldHashValue) {
                     hashObj[hashName] = encodeURIComponent(newHashValue);
                     hashChanged = true;
                  }
               }
            }
         }
         if (hashChanged || force) {
            this.setHash(hashObj, replace);
         }
      }
   };

   /**
    * The public API for this utility class
    *
    * @alias module:alfresco/util/hashUtils
    */
   return {

      /**
       * Get the current hash value as an object
       *
       * @instance
       * @returns {Object} The hash value as an object
       */
      getHash: lang.hitch(util, util.getHash),

      /**
       * Set the current hash value from an object
       *
       * @instance
       * @param {Object} hashObj The new hash object
       * @param {boolean} [replace] Replace the current hash, rather than changing
       *                            (i.e. do not add to the history)
       */
      setHash: lang.hitch(util, util.setHash),

      /**
       * Update the current hash (by default, this will not do the update if the
       * values are unchanged). To remove a value from the hash, pass through null
       * or undefined.
       *
       * @instance
       * @param {Object} newValues The new hash values with hash names as keys and
       *                           hash values as their values (will only change
       *                           values for hash names with keys in this object)
       * @param {boolean} [replace] Replace the current hash, rather than changing
       *                            (i.e. do not add to the history)
       * @param {boolean} [force] Force an update, even if the values are unchanged
       *                          (i.e. will trigger hash-change listeners)
       */
      updateHash: lang.hitch(util, util.updateHash)
   };
});