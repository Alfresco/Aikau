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
 * @author David Webster
 */
define(["dojo/_base/lang",
      "dojo/io-query"],
   function(lang, ioQuery) {

      // The private container for the functionality and properties of the util
      var util = {

         /**
          * Convert a URL string into a URL Object
          *
          * @param url {string}
          * @returns {object}
          */
         parseUrl: function alfresco_util_urlUtils__parseUrl(url) {
            if (!url.indexOf("://"))
            {
               this.alfLog("warn", "Attempting to parse a relative URL. This will return an absolute URL");
            }

            var a = document.createElement("a"),
               _sanitizedPathname = function (pathname) {
                  // pathname MUST include leading slash (IE<9: this code is for you).
                  var prepend = (pathname.substring(0, 1) === "/") ? "" : "/";
                  return prepend + pathname;
               };

            a.href = url;

            return {
               protocol: a.protocol, // includes trailing colon.
               hostname: a.hostname,
               port: a.port,
               host: a.host, // host = hostname:port
               pathname: _sanitizedPathname(a.pathname), // includes leading slash
               queryParams: ioQuery.queryToObject(a.search.slice(1)), // remove ? before parsing
               hashParams: ioQuery.queryToObject(a.hash.slice(1)), // remove # before parsing
               toString: function () {
                  var search = ioQuery.objectToQuery(this.queryParams),
                     hash = ioQuery.objectToQuery(this.hashParams);
                  search = (search) ? "?" + search : search;
                  hash = (hash) ? "#" + hash : hash;

                  return this.protocol + "//" + this.host + this.pathname + search + hash;
               }
            };
         },

         // See API below
         addQueryParameter: function alfresco_util_urlUtils__addQueryParameter(url, param, value, encodeValue) {
            var returnUrl,
               safeValue = (encodeValue) ? encodeURIComponent(value) : value;

            if (url.indexOf("#") !== -1) {
               var urlParts = url.split("#");

               if(url.indexOf("?") !== -1) {
                  returnUrl = urlParts[0] + "&" + param + "=" + safeValue + "#" + urlParts[1];
               }
               else {
                  returnUrl = urlParts[0] + "?" + param + "=" + safeValue + "#" + urlParts[1];
               }

            }
            else if (url.indexOf("?") !== -1) {
               returnUrl = url + "&" + param + "=" + safeValue;
            }
            else {
                  returnUrl = url + "?" + param + "=" + safeValue;
            }

            return returnUrl;
         },

         // See API below
         addHashParameter: function alfresco_util_urlUtils__addHashParameter(url, param, value, encodeValue) {
            var returnUrl,
               safeValue = (encodeValue) ? encodeURIComponent(value) : value;

            if (url.indexOf("#") !== -1) {
               returnUrl = url + "&" + param + "=" + safeValue;

            }
            else {
               returnUrl = url + "#" + param + "=" + safeValue;
            }

            return returnUrl;
         }
      };

      /**
       * The public API for this utility class
       *
       * @alias module:alfresco/util/urlUtils
       */
      return {

         /**
          * Convert the supplied URL string into a URL object
          *
          * @instance
          * @function
          * @param {string} url The URL to parse
          * @returns {object} The URL object
          */
         parseUrl: lang.hitch(util,  util.parseUrl),

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
         addQueryParameter: lang.hitch(util, util.addQueryParameter),


         /**
          * This function can be used to append the supplied parameter name and value onto the hash of the
          * supplied URL string which is then returned.
          *
          * @instance
          * @function
          * @param {string} url The url to update
          * @param {string} param The name of the hash parameter
          * @param {string} value The value of the hash parameter
          * @param {bool} [encodeValue] Whether to URI-encode the value
          * @returns {string} The updated URL
          */
         addHashParameter: lang.hitch(util, util.addHashParameter)
      };
   });