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
 * Utility object for URL-related utilities. Note that this is not a Class, and so does
 * not need to be instantiated before use.
 *
 * @module alfresco/util/urlUtils
 * @author Martin Doyle
 * @author David Webster
 */
define(["alfresco/enums/urlTypes",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/io-query",
        "service/constants/Default"],
        function(urlTypes, array, lang, ioQuery, AlfConstants) {

   // The private container for the functionality and properties of the util
   var util = {

      /**
       * Convert a URL string into a URL Object
       *
       * @param url {string}
       * @returns {object}
       */
      parseUrl: function alfresco_util_urlUtils__parseUrl(url) {
         if (!url.indexOf("://")) {
            this.alfLog("warn", "Attempting to parse a relative URL. This will return an absolute URL");
         }

         var a = document.createElement("a"),
            _sanitizedPathname = function(pathname) {
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
            toString: function() {
               var search = ioQuery.objectToQuery(this.queryParams),
                  hash = ioQuery.objectToQuery(this.hashParams);
               search = (search) ? "?" + search : search;
               hash = (hash) ? "#" + hash : hash;

               return this.protocol + "//" + this.host + this.pathname + search + hash;
            }
         };
      },

      // See API below
      addFilterQueryParameters: function alfresco_util_urlUtils__addFilterQueryParameters(url, payload) {
         if (payload && payload.dataFilters)
         {
            array.forEach(payload.dataFilters, function(filter) {
               url = this.addQueryParameter(url, filter.name, filter.value);
            }, this);
         }
         return url;
      },

      // See API below
      addQueryParameter: function alfresco_util_urlUtils__addQueryParameter(url, param, value, encodeValue) {
         var returnUrl,
            safeValue = (encodeValue) ? encodeURIComponent(value) : value;

         if (url.indexOf("#") !== -1) {
            var urlParts = url.split("#");

            if (url.indexOf("?") !== -1) {
               returnUrl = urlParts[0] + "&" + param + "=" + safeValue + "#" + urlParts[1];
            } else {
               returnUrl = urlParts[0] + "?" + param + "=" + safeValue + "#" + urlParts[1];
            }

         } else if (url.indexOf("?") !== -1) {
            returnUrl = url + "&" + param + "=" + safeValue;
         } else {
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

         } else {
            returnUrl = url + "#" + param + "=" + safeValue;
         }

         return returnUrl;
      },

      // See API below
      // NOTE: Using existing logic from NavigationService, falsy values default to
      //       PAGE_RELATIVE and specified, invalid values do not modify the URL but
      //       do log an error.
      convertUrl: function alfresco_util_urlUtils__convertUrl(url, urlType) {
         /*jshint maxcomplexity:false*/
         var convertedUrl = url,
            falsyUrlTypeFallback = "FALSY_URL_TYPE_SUPPLIED";
         if (url || urlType === urlTypes.HASH) {
            switch (urlType || falsyUrlTypeFallback) {

               case urlTypes.SHARE_PAGE_RELATIVE:
                  // This is deprecated and shouldn't be used, but keeping in for the moment
                  // for backwards-compatibility reasons
                  /* falls through */

               case falsyUrlTypeFallback:
                  // Default according to NavigationService, for falsy types, is to use
                  // PAGE_RELATIVE, so fall through
                  /* falls through */

               case urlTypes.PAGE_RELATIVE:
                  // Relative to the application Page context (e.g. /[application-context]/page)
                  // Ensure no leading slashes (as the constant already has a trailing one)
                  convertedUrl = AlfConstants.URL_PAGECONTEXT + url.replace(/^\/+/, "");
                  break;

               case urlTypes.CONTEXT_RELATIVE:
                  // Relative to the application context (e.g. /share)
                  // Ensure no leading slashes (as the constant already has a trailing one)
                  convertedUrl = AlfConstants.URL_CONTEXT + url.replace(/^\/+/, "");
                  break;

               case urlTypes.REQUIRE_PATH:
                  // URL is resolved by doing require.toUrl(...) on it
                  convertedUrl = require.toUrl(url);
                  break;

               case urlTypes.FULL_PATH:
                  // Absolute URL
                  // Don't change the passed-in URL
                  break;

               case urlTypes.HASH:
                  // A hash path
                  // Ensure there is no leading hash
                  convertedUrl = (url || "").replace(/^#+/, "");
                  break;

               default:
                  // On invalid types, just leave the URL unchanged
                  // TODO We want to log an error here, but can't easily access the pub/sub
                  //      mechanism yet, so don't do anything yet!
                  break;

            }
         }
         return convertedUrl;
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
      parseUrl: lang.hitch(util, util.parseUrl),

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
       * This function can be used to append the supplied query parameter name and value onto the
       * supplied URL string which is then returned.
       *
       * @instance
       * @function
       * @param {string} url The url to update
       * @param {object} payload The name payload containing the filters
       * @returns {string} The updated URL
       * @since 1.0.74
       */
      addFilterQueryParameters: lang.hitch(util, util.addFilterQueryParameters),

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
      addHashParameter: lang.hitch(util, util.addHashParameter),

      /**
       * This function is used to resolve a url string and a
       * [urlType]{@link module:alfresco/enums/urlType} string
       *
       * @instance
       * @function
       * @param {string} url The URL to convert
       * @param {string} urlType The URL type which must be a value in
       *                         [the urlTypes enum]{@link module:alfresco/enums/urlTypes}
       * @returns {string} The converted URL
       * @since 1.0.41
       */
      convertUrl: lang.hitch(util, util.convertUrl)
   };
});