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
 * Utility object for URL-related utilities. Note that this is not a Class, and so does
 * not need to be instantiated before use.
 *
 * @module alfresco/util/urlUtils
 * @author Martin Doyle
 */
define(["dojo/_base/lang"],
   function(lang) {

      // The private container for the functionality and properties of the util
      var util = {

         // See API below
         addQueryParameter: function alfresco_util_urlUtils__addQueryParameter(url, param, value, encodeValue) {
            var paramPrefix = url.indexOf("?") === -1 ? "?" : "&",
               paramToUse = paramPrefix + param,
               valueToUse = encodeValue ? encodeURIComponent(value) : value;
            return url + paramToUse + "=" + valueToUse;
         }
      };

      /**
       * The public API for this utility class
       * 
       * @alias module:alfresco/util/urlUtils
       */
      return {

         /**
          * This function can be used to append the supplied query parameter name and value onto the
          * supplied URL string which is then returned.
          *
          * @instance
          * @function
          * @param {string} url The url to update
          * @param {string} param The name of the query parameter
          * @param {string} value The value of the query parameter
          * @param {bool} [encodeValue] Whether to URI-encode the value
          * @returns {string} The updated URL
          */
         addQueryParameter: lang.hitch(util, util.addQueryParameter)
      };
   });