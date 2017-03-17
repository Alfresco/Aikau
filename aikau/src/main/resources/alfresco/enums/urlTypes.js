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
 * <p>This enum contains all possible values of URL type.</p>
 * 
 * @module alfresco/enums/urlTypes
 * @author Martin Doyle
 * @since 1.0.41
 */
define([], function() {

   return {

      /**
       * This value is used to indicate that the supplied URL is relative to the
       * Alfresco Page context (e.g. /share/page)
       *
       * @instance
       * @type {string}
       * @default
       * @deprecated Since 1.0.17 - Use [PAGE_RELATIVE]{@link module:alfresco/enums/urlTypes#PAGE_RELATIVE} instead.
       */
      SHARE_PAGE_RELATIVE: "SHARE_PAGE_RELATIVE",

      /**
       * This value is used to indicate that the accompanying URL is relative
       * to the application Page context (e.g. /[application-context]/page).
       *
       * @instance
       * @type {string}
       * @default
       */
      PAGE_RELATIVE: "PAGE_RELATIVE",

      /**
       * This value is used to indicate that the accompanying URL is relative
       * to the application context (e.g. /share).
       *
       * @instance
       * @type {string}
       * @default
       */
      CONTEXT_RELATIVE: "CONTEXT_RELATIVE",

      /**
       * This value is used to indicate that the accompanying URL is a path
       * that can be resolve by doing require.toUrl(...)
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.41
       */
      REQUIRE_PATH: "REQUIRE_PATH",

      /**
       * This value is used to indicate that the accompanying URL is a full
       * path (i.e. it should contain "//").
       *
       * @instance
       * @type {string}
       * @default
       */
      FULL_PATH: "FULL_PATH",

      /**
       * This value is used to indicate that the accompanying URL is a hash
       * (i.e. it just applies a new hash value to the current URL).
       *
       * @instance
       * @type {string}
       * @default
       */
      HASH: "HASH"
   };
});