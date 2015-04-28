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
 * This service is intended to be used for performing searches. It was written specifically to
 * service requests that can be rendered by the [AlfSearchList]{@link module:alfresco/search/AlfSearchList}
 * widget.
 * 
 * @module alfresco/services/SearchService
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "service/constants/Default",
        "alfresco/core/PathUtils",
        "alfresco/core/NodeUtils",
        "dojo/_base/lang",
        "dojo/json",
        "dojo/hash"],
        function(declare, AlfCore, CoreXhr, AlfConstants, PathUtils, NodeUtils, lang, dojoJson, hash) {
   
   return declare([AlfCore, CoreXhr, PathUtils], {
      
      /**
       * 
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_services_SearchService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("ALF_SEARCH_REQUEST", lang.hitch(this, this.onSearchRequest));
         this.alfSubscribe("ALF_STOP_SEARCH_REQUEST", lang.hitch(this, this.onStopRequest));
         this.alfSubscribe("ALF_AUTO_SUGGEST_SEARCH", lang.hitch(this, this.onAutoSuggest));
      },

      /**
       * This is the default number of items to return as a single page of result data. This value will be used if
       * a specific value isn't supplied in a search request.
       * 
       * @instance
       * @type {number}
       * @default 25
       */
      pageSize: 25,

      /**
       * This is the default query to use if one isn't supplied in a search request. 
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      query: "",

      /**
       * This boolean indicates whether the entire repository should be searched. This value will be used if a specific
       * value isn't supplied in a search request.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      repo: true,

      /**
       * This is the default node to use as the root of the search. This value will be used if a specific value isn't
       * supplied in the search request.
       *
       * @instance
       * @type {string}
       * @default "alfresco://company/home"
       */
      rootNode: "alfresco://company/home",

      /**
       * This is the default site to use. This value will be used if a specific value isn't supplied in the search request.
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      site: "",

      /**
       * This is the default sort to use. This value will be used if a specific value isn't supplied in the search request.
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      sort: "",

      /**
       * This is the default sort direction to use. This value will be used if a specific value isn't supplied in the search request.
       * 
       * @instance
       * @type {boolean}
       * @default true
       */
      sortAscending: true,

      /**
       * This is the default page index to use for multiple pages of search results. This value will be used if
       * a specific value isn't supplied in a search request.
       * 
       * @instance
       * @type {number}
       * @default 0
       */
      startIndex: 0,

      /**
       * This is the default tag to use. This value will be used if a specific value isn't supplied in the search request.
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      tag: "",

      /**
       *
       * @instance
       * @param {object} payload The payload defining the document to retrieve the details for.
       */
      onSearchRequest: function alfresco_services_SearchService__onSearchRequest(payload) {
         if (payload == null || payload.term == null)
         {
            this.alfLog("warn", "A request was made to perform a search but no 'term' attribute was provided", payload, this);
         }
         else
         {
            // Check to see whether or not a success topic has been provided...
            var alfTopic = (payload.alfResponseTopic != null) ? payload.alfResponseTopic : "ALF_SEARCH_REQUEST";
            var url = AlfConstants.PROXY_URI + "slingshot/search/";

            // Use any unexpected attributes as a query attribute...
            var query = this.query;
            if (payload.query == null)
            {
               var queryAttributes = {};
               for (var key in payload)
               {
                  switch(key) {
                     case "alfTopic":
                     case "alfResponseTopic":
                     case "alfPublishScope":
                     case "term":
                     case "tag":
                     case "startIndex":
                     case "sort":
                     case "site":
                     case "rootNode":
                     case "repo":
                     case "pageSize":
                     case "maxResults":
                     case "facetFields":
                     case "filters":
                     case "sortAscending":
                     case "sortField":
                     case "requestId":
                     case "spellcheck":
                        break;
                     default:
                        queryAttributes[key] = payload[key];
                  }
               }
               query = dojoJson.stringify(queryAttributes);
               if (query == "{}")
               {
                  query = "";
               }
            }
            else
            {
               query = payload.query;
            }

            var sort = "";
            if (payload.sortField != null && (payload.sortField === "null" || payload.sortField === ""))
            {
               // No action required - leave as the empty string which is relevance - no direction can be applied
            }
            else if (payload.sortField === "Relevance")
            {
               sort = "";
            }
            else
            {
               sort = ((payload.sortField != null) ? payload.sortField : this.sort) + "|" + 
                      ((payload.sortAscending != null) ? payload.sortAscending : this.sortAscending);
            }

            var data = {
               facetFields: (payload.facetFields != null) ? payload.facetFields : "{http://www.alfresco.org/model/content/1.0}content.mimetype,{http://www.alfresco.org/model/content/1.0}modifier.__,{http://www.alfresco.org/model/content/1.0}creator.__,{http://www.alfresco.org/model/content/1.0}description.__",
               filters: (payload.filters != null) ? payload.filters : "",
               term: payload.term,
               tag: (payload.tag != null) ? payload.tag : this.tag,
               startIndex: (payload.startIndex != null) ? payload.startIndex : this.startIndex,
               sort: sort,
               site: (payload.site != null) ? payload.site : this.site,
               rootNode: (payload.rootNode != null) ? payload.rootNode : this.rootNode,
               repo: (payload.repo != null) ? payload.repo : this.repo,
               query: query,
               pageSize: (payload.pageSize != null) ? payload.pageSize : this.pageSize,
               maxResults: (payload.maxResults != null) ? payload.maxResults : 0,
               noCache: new Date().getTime(),
               spellcheck: (payload.spellcheck != null) ? payload.spellcheck: false
            };
            var config = {
               requestId: payload.requestId,
               alfTopic: alfTopic,
               url: url,
               query: data,
               method: "GET",
               callbackScope: this
            };
            this.serviceXhr(config);
         }
      },

      /**
       * Retrieves a list of suggested search terms based on the supplied search term.
       *
       * @instance
       * @param {object} payload The auto-suggest payload. Should contain the current search term
       */
      onAutoSuggest: function alfresco_services_SearchService__onAutoSuggest(payload) {
         // Create the root URL...
         var url = AlfConstants.PROXY_URI + "slingshot/auto-suggest";
         var options = {
            t: ""
         };
         if (payload.query != null)
         {
            options.t = payload.query;
         }
         if (url !== null)
         {
            this.serviceXhr({url: url,
                             query: options,
                             alfTopic: (payload.alfResponseTopic ? payload.alfResponseTopic : null),
                             method: "GET"});
         }
      }
   });
});