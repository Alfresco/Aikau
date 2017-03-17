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
 * @module alfresco/services/TagService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/core/topics",
        "dojo/_base/lang",
        "service/constants/Default"],
        function(declare, BaseService, AlfXhr, topics, lang, AlfConstants) {
   
   return declare([BaseService, AlfXhr], {
      
      /**
       * This should be set when the current context is a site.
       * 
       * @instance
       * @type {string}
       * @default
       */
      siteId: null,
      
      /**
       * This should be set when the current context is a site, typically this will be set to "documentlibrary"
       * 
       * @instance
       * @type {string}
       * @default
       */
      containerId: null,
      
      /**
       * This should be set if "siteId" is not set.
       * 
       * @instance
       * @type {string}
       * @default
       */
      rootNode: null,
      
      /**
       * Sets up the subscriptions for the TagService
       * 
       * @instance 
       * @since 1.0.32
       * @listens module:alfresco/core/topics#RETRIEVE_CURRENT_TAGS
       * @listens module:alfresco/core/topics#TAG_QUERY
       * @listens module:alfresco/core/topics#CREATE_TAG
       */
      registerSubscriptions: function alfresco_services_TagService__registerSubscriptions() {
         this.alfSubscribe(topics.RETRIEVE_CURRENT_TAGS, lang.hitch(this, this.onTagListRequest));
         this.alfSubscribe(topics.TAG_QUERY, lang.hitch(this, this.onTagQuery));
         this.alfSubscribe(topics.CREATE_TAG, lang.hitch(this, this.createTag));
      },
      
      /**
       * Handles requests to retrieve the list of tags, optionally filtered by a search term.
       *
       * @instance
       * @param {object} payload The payload containing the details of the tags to search for
       */
      onTagListRequest: function alfresco_services_TagService__onTagListRequest(payload) {

         // Create the root URL...
         var url = AlfConstants.PROXY_URI + "api/forms/picker/category/workspace/SpacesStore/tag:tag-root/children";

         // Generate some default options...
         // TODO: Consider making this configurable on the service?
         var options = {
            selectableType: "cm:category",
            size: "100",
            aspect: "cm:taggable"
         };

         // Update the options with a query if provided...
         if (payload.query)
         {
            options.searchTerm = payload.query;
         }

         if (url !== null)
         {
            this.serviceXhr({url: url,
                             query: options,
                             alfTopic: payload.alfResponseTopic || null,
                             alfResponseScope: payload.alfResponseScope,
                             method: "GET"});
         }
      },


      /**
       * @instance
       * @param {object} payload
       */
      onTagQuery: function alfresco_services_TagService__onTagQuery(payload) {
         if (!payload || typeof payload.callback !== "function" || !payload.callbackScope)
        {
           this.alfLog("error", "A request was made for site tag data, but one or more of the following attributes was not provided: 'callback', 'callbackScope':", payload);
        }
        else
        {
           var maxTags = payload.maxTags || 100;
           var d = new Date().getTime();
           var url = null;
           if (payload.siteId && payload.containerId)
           {
              url = AlfConstants.PROXY_URI + "api/tagscopes/site/" + payload.siteId + "/" + payload.containerId + "/tags?d=" + d + "&topN=" + maxTags;
           }
           else if (payload.rootNode)
           {
              url = AlfConstants.PROXY_URI + "collaboration/tagQuery?d=" + d + "&m=" + maxTags + "&s=count&n=" + encodeURIComponent(payload.rootNode);
           }
           else
           {
              this.alfLog("error", "It is not possible to retrieve tags without a 'siteId' and 'containerId' or a 'rootNode' attribute provided in payload", this);
           }
           
           if (url)
           {
              var config = {
                 url: url,
                 method: "GET",
                 successCallback: payload.callback,
                 callbackScope: payload.callbackScope
              };
              this.serviceXhr(config);
           }
        }
      },

      /**
       * Creates a tag at the remote store (the same location from which available tags are retrieved). 
       * 
       * @instance
       * @param {string} tagName The name of the tag to create.
       * @return {object} The created tag details
       */
      createTag: function alfresco_services_TagService__createTag(payload) {
         var tagName = lang.getObject("tagName", false, payload);
         if (tagName && lang.trim(tagName))
         {
            var config = {
               url: AlfConstants.PROXY_URI + "api/tag/workspace/SpacesStore",
               method: "POST",
               alfTopic: payload.alfResponseTopic,
               responseScope: payload.alfResponseScope,
               data: {
                  name: tagName
               }
            };
            this.serviceXhr(config);
         }
         else
         {
            this.alfLog("warn", "A request was made to create a tag but no 'tagName' attribute was provided", this, payload);
         }
      }
   });
});
