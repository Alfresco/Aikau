/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
define(["dojo/_base/array",
        "dojo/_base/lang",
        "dojo/hash",
        "dojo/io-query"],
        function(array, lang, hash, ioQuery) {

   // The private container for the functionality and properties of the util
   var util = {

      // See API below
      getHash: function alfresco_util_hashUtils__getHash() {
         var hashString = this.getHashString(),
            hashObj = ioQuery.queryToObject(hashString);
         return hashObj;
      },

      // See API below
      getHashString: function alfresco_util_hashUtils__getHashString() {
         return hash();
      },

      // See API below
      setHash: function alfresco_util_hashUtils__setHash(newHash, replace) {
         var hashString = (typeof newHash === "string") ? newHash : ioQuery.objectToQuery(newHash);
         hash(hashString, replace);
      },

      // See API below
      updateHash: function alfresco_util_hashUtils__updateHash(newValues, replace, force) {
         var currHash = this.getHash(),
            newHash = lang.mixin({}, currHash),
            valuesToUse = typeof newValues === "string" ? ioQuery.queryToObject(newValues) : newValues,
            hashName,
            newHashValue,
            currHashValue,
            hashChanged;
         for (hashName in valuesToUse) {
            if (valuesToUse.hasOwnProperty(hashName)) {
               newHashValue = valuesToUse[hashName];
               currHashValue = currHash[hashName];
               if (typeof newHashValue === "undefined" || newHashValue === null) {
                  delete newHash[hashName];
                  if (currHash.hasOwnProperty(hashName)) {
                  hashChanged = true;
                  }
               } else {
                  newHashValue = "" + newHashValue;
                  if (newHashValue !== currHashValue) {
                     newHash[hashName] = newHashValue;
                     hashChanged = true;
                  }
               }
            }
         }
         if (hashChanged || force) {
            this.setHash(newHash, replace);
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
       * Get the current hash value as an object. All values will be URI decoded unless
       * a suppresssDecoding argument of true is provided.
       *
       * @instance
       * @function
       * @returns {Object} The hash value as an object
       */
      getHash: lang.hitch(util, util.getHash),

      /**
       * Get the current hash value as a string. All values will be URI decoded.
       *
       * @instance
       * @function
       * @returns {string} The hash value as a string
       */
      getHashString: lang.hitch(util, util.getHashString),

      /**
       * Set the current hash value from an object. All values will be URI encoded unless
       * a suppressEncoding argument of true is provided.
       *
       * @instance
       * @function
       * @param {object|string} hash The new hash
       * @param {boolean} [replace] Replace the current hash, rather than changing
       *                            (i.e. do not add to the history)
       */
      setHash: lang.hitch(util, util.setHash),

      /**
       * Set the current hash value from a string. All values will be URI encoded.
       *
       * @instance
       * @function
       * @param {string} hashString The new hash string
       * @param {boolean} [replace] Replace the current hash, rather than changing
       *                            (i.e. do not add to the history)
       * @deprecated Since 1.0.48 - Use [hashUtils.setHash()]@{link module:alfresco/util/hashUtils#setHash} instead
       */
      setHashString: lang.hitch(util, util.setHash),

      /**
       * Update the current hash (by default, this will not do the update if the
       * values are unchanged). To remove a value from the hash, pass through null
       * or undefined. All values will be URI encoded.
       *
       * @instance
       * @function
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
