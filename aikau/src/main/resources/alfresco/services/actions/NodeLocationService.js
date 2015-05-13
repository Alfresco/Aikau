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
 * This service provides an easy way in which users can be navigated to a specific view containing the
 * node they are interested in. This has been added to support the "document-locate" action that is
 * configured as standard in Alfresco Share but to make the capability available for use in other contexts.
 * Without any additional configuration this service can be used in Aikau pages contained within Alfresco Share,
 * however if you wish to use this in an alternative client (e.g. a standalone client created from the 
 * Aikau Maven Archetype) then it is likely that you will need to set some configuration, e.g. setting
 * [useAikauPages]{@link module:alfresco/core/UrlUtils#useAikauPages} to be true and
 * setting the [nonSiteUrl]{@link module:alfresco/services/actions/NodeLocationService#nonSiteUrl} and
 * [siteUrl]{@link module:alfresco/services/actions/NodeLocationService#siteUrl} locations to take the 
 * user to.
 *
 * @example <caption>Standard configuration in Share:</caption>
 * {
 *    name: "alfresco/services/actions/NodeLocationService"
 * }
 *
 * @example <caption>Show all nodes in custom Repository view in Share:</caption>
 * {
 *    name: "alfresco/services/actions/NodeLocationService",
 *    config: {
 *       nonSiteUrl: "custom-repository",
 *       siteUrl: null
 *    }
 * }
 *
 * @example <caption>Configuration for standalone Aikau client:</caption>
 * {
 *    name: "alfresco/services/actions/NodeLocationService",
 *    config: {
 *       useAikauPages: true,
 *       siteUrl: "doclib",
 *       nonSiteUrl: "repo"
 *    }
 * }
 *
 * @module alfresco/services/actions/NodeLocationService
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/core/UrlUtils
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/UrlUtils",
        "dojo/_base/lang"],
        function(declare, AlfCore, UrlUtils, lang) {

   return declare([AlfCore, UrlUtils], {

      /**
       * The should be configured to be the URL fragment to be used when linking to nodes that are not located
       * within a site. It defaults to "repository" as this is the standard non-site URL expected to be used within
       * Alfresco Share.
       * 
       * @instance
       * @type {string}
       * @default "repository"
       */
      nonSiteUrl: "repository",

      /**
       * The should be configured to be the URL fragment to be used when linking to nodes that located
       * within a site. It defaults to "documentlibrary" as this is the standard site URL expected to be used within
       * Alfresco Share. If this is configured as being null then the 
       * nonSiteUrl]{@link module:alfresco/services/actions/NodeLocationService#nonSiteUrl} will be used
       * to as the location of all items.
       * 
       * @instance
       * @type {string}
       * @default "documentlibrary"
       */
      siteUrl: "documentlibrary",

      /**
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_services_actions_NodeLocationService__constructor(args) {
         declare.safeMixin(this, args);
         this.alfSubscribe("ALF_LOCATE_DOCUMENT", lang.hitch(this, this.onLocateDocumentRequest));
      },

      /**
       * Handles requests to navigate to the configured view for the node defined in the supplied payload
       * (if available).
       * 
       * @instance
       * @param {object} payload
       */
      onLocateDocumentRequest: function alfresco_services_actions_NodeLocationService__onLocateDocumentRequest(payload) {
         if (payload && payload.item)
         {
            var path = lang.getObject("item.location.path", false, payload);
            var recordSiteName = lang.getObject("item.location.site.name", false, payload);
            var useSiteUrl = (recordSiteName && this.siteUrl);

            var page = useSiteUrl ? this.siteUrl : this.nonSiteUrl;
            var site = useSiteUrl ? recordSiteName : null;
            var url = this.buildUrl(page, site) + "#path=" + encodeURIComponent(path);
            this.alfPublish("ALF_NAVIGATE_TO_PAGE", {
               url: url,
               target: "CURRENT",
               type: "FULL_PAGE"
            });
         }
         else
         {
            this.alfLog("warn", "A request was made to locate a document but no document was provided to find", payload, this);
         }
      }
   });
});