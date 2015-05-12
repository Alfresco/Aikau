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
 * This should be mixed into any widgets or services that need to redirect the browser to display
 * different pages in either current or the new tab. It defines attributes that should be referenced
 * rather than copying and pasted hard-coded string topics. This ensures consistency between publish
 * and subscribe handling.
 *
 * @module alfresco/services/_NavigationServiceTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare"],
        function(declare) {

   return declare(null, {

      /**
       * This topic is used to request that the browser displays a new page.
       *
       * @instance
       * @event navigateToPageTopic
       * @type {string}
       * @default "ALF_NAVIGATE_TO_PAGE"
       */
      navigateToPageTopic: "ALF_NAVIGATE_TO_PAGE",

      /**
       * This topic is used to request that the current page be reloaded
       *
       * @instance
       * @event reloadPageTopic
       * @type {string}
       * @default "ALF_RELOAD_PAGE"
       */
      reloadPageTopic: "ALF_RELOAD_PAGE",

      /**
       * This topic is used to request a post to the page
       *
       * @instance
       * @event postToPageTopic
       * @type {string}
       * @default "ALF_POST_TO_PAGE"
       */
      postToPageTopic: "ALF_POST_TO_PAGE",

      /**
       * This value is used to indicate that the supplied URL is relative to the Alfresco Page context (e.g. /share/page)
       *
       * @instance
       * @type {string}
       * @default "SHARE_PAGE_RELATIVE"
       * @deprecated Since 1.0.17 - Use [pageRelativePath]{@link module:alfresco/services/_NavigationServiceTopicMixin#pageRelativePath} instead.
       */
      sharePageRelativePath: "SHARE_PAGE_RELATIVE",

      /**
       * This value is used to indicate that the supplied URL is relative to the application Page context (e.g. /<application-context>/page)
       *
       * @instance
       * @type {string}
       * @default "PAGE_RELATIVE"
       * @deprecated Since 1.0.17 - Use 
       */
      pageRelativePath: "PAGE_RELATIVE",

      /**
       * This value is used to indicate that the supplied URL is relative to the application context (e.g. /share)
       *
       * @instance
       * @type {string}
       * @default "CONTEXT_RELATIVE"
       */
      contextRelativePath: "CONTEXT_RELATIVE",

      /**
       * This value is used to indicate that the supplied URL is a full path (e.g. it will begin "http")
       *
       * @instance
       * @type {string}
       * @default "FULL_PATH"
       */
      fullPath: "FULL_PATH",

      /**
       * This value is used to indicate that the supplied URL is a hash path (e.g. it just applies a new hash value to the current URL)
       *
       * @instance
       * @type {string}
       * @default "HASH"
       */
      hashPath: "HASH",

      /**
       * This value is used to indicate that the URL should be displayed in the current browser window.
       *
       * @instance
       * @type {string}
       * @default "CURRENT"
       */
      currentTarget: "CURRENT",

      /**
       * This value is used to indicate that the URL should be displayed in a new browser window.
       *
       * @instance
       * @type {string}
       * @default "NEW"
       */
      newTarget: "NEW"
   });
});