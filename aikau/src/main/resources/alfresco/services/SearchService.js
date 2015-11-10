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
 * @extends module:alfresco/services/BaseService
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "service/constants/Default",
        "alfresco/core/PathUtils",
        "alfresco/core/NodeUtils",
        "alfresco/core/topics",
        "dojo/_base/lang",
        "dojo/json"],
        function(declare, BaseService, CoreXhr, AlfConstants, PathUtils, NodeUtils, topics, lang, dojoJson) {

   return declare([BaseService, CoreXhr, PathUtils], {

      /**
       * Sets up the subscriptions for the SearchService.
       * 
       * @instance
       * @since 1.0.32
       */
      registerSubscriptions: function alfresco_services_SearchService__registerSubscriptions() {
         this.alfSubscribe("ALF_SEARCH_REQUEST", lang.hitch(this, this.onSearchRequest));
         this.alfSubscribe("ALF_STOP_SEARCH_REQUEST", lang.hitch(this, this.onStopRequest));
         this.alfSubscribe("ALF_AUTO_SUGGEST_SEARCH", lang.hitch(this, this.onAutoSuggest));
      },

      /**
       * The URL to call to fetch auto suggest results
       *
       * @instance
       * @type {string}
       * @default
       */
      autoSuggestAPI: AlfConstants.PROXY_URI + "slingshot/auto-suggest",

      /**
       * This is the default number of items to return as a single page of result data. This value will be used if
       * a specific value isn't supplied in a search request.
       *
       * @instance
       * @type {number}
       * @default
       */
      pageSize: 25,

      /**
       * This is the default query to use if one isn't supplied in a search request.
       *
       * @instance
       * @type {string}
       * @default
       */
      query: "",

      /**
       * This boolean indicates whether the entire repository should be searched. This value will be used if a specific
       * value isn't supplied in a search request.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      repo: true,

      /**
       * This is the default node to use as the root of the search. This value will be used if a specific value isn't
       * supplied in the search request.
       *
       * @instance
       * @type {string}
       * @default
       */
      rootNode: "alfresco://company/home",

      /**
       * The URL to send a search request to
       *
       * @instance
       * @type {string}
       * @default
       */
      searchAPI: AlfConstants.PROXY_URI + "slingshot/search/",

      /**
       * The URL to send the
       */

      /**
       * This is the default site to use. This value will be used if a specific value isn't supplied in the search request.
       *
       * @instance
       * @type {string}
       * @default
       */
      site: "",

      /**
       * This is the default sort to use. This value will be used if a specific value isn't supplied in the search request.
       *
       * @instance
       * @type {string}
       * @default
       */
      sort: "",

      /**
       * This is the default sort direction to use. This value will be used if a specific value isn't supplied in the search request.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      sortAscending: true,

      /**
       * This is the default page index to use for multiple pages of search results. This value will be used if
       * a specific value isn't supplied in a search request.
       *
       * @instance
       * @type {number}
       * @default
       */
      startIndex: 0,

      /**
       * This is the default tag to use. This value will be used if a specific value isn't supplied in the search request.
       *
       * @instance
       * @type {string}
       * @default
       */
      tag: "",

      /**
       *
       * @instance
       * @param {object} payload The payload defining the document to retrieve the details for.
       */
      onSearchRequest: function alfresco_services_SearchService__onSearchRequest(payload) {
         // jshint maxlen:300, maxcomplexity:false
         if (!payload)
         {
            this.alfLog("warn", "A request was made to perform a search but no payload was provided", payload, this);
            this.alfPublish(payload.alfResponseTopic + "_FAILURE", {}, false, false, payload.alfResponseScope);
         }
         else
         {
            // Check to see whether or not a success topic has been provided...
            var alfTopic = (payload.alfResponseTopic) ? payload.alfResponseTopic : "ALF_SEARCH_REQUEST";
            var url = this.searchAPI;

            // Use any unexpected attributes as a query attribute...
            var query = this.query;
            if (!payload.query)
            {
               var queryAttributes = {};
               for (var key in payload)
               {
                  if (payload.hasOwnProperty(key)) {
                     switch(key) {
                        case "alfTopic":
                        case "alfResponseScope":
                        case "alfResponseTopic":
                        case "alfPublishScope":
                        case "alfCallerName":
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
               }
               query = dojoJson.stringify(queryAttributes);
               if (query === "{}")
               {
                  query = "";
               }
            }
            else
            {
               query = payload.query;
            }

            var sort = "";
            if (payload.sortField === "null" || payload.sortField === "Relevance" || payload.sortField === "")
            {
               // No action required - leave as the empty string which is relevance - no direction can be applied
            }
            else
            {
               var sortAscending = (payload.sortAscending !== null && typeof payload.sortAscending !== "undefined") ? payload.sortAscending : this.sortAscending;
               sort = (payload.sortField || this.sort) + "|" + sortAscending;
            }

            var data = {
               facetFields: payload.facetFields || "",
               filters: decodeURIComponent(payload.filters) || "",
               encodedFilters: payload.filters || "",term: payload.term,
               tag: payload.tag || this.tag,
               startIndex: (payload.startIndex || payload.startIndex === 0) ? payload.startIndex : this.startIndex,
               sort: sort,
               site: payload.site || this.site,
               rootNode: payload.rootNode || this.rootNode,
               repo: (payload.repo || payload.repo === false) ? payload.repo : this.repo,
               query: query,
               pageSize: payload.pageSize || this.pageSize, // It makes no sense for page size to ever be 0
               maxResults: payload.maxResults || 0,
               noCache: new Date().getTime(),
               spellcheck: payload.spellcheck || false
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
         var url = this.autoSuggestAPI;
         var options = {
            t: ""
         };
         if (payload.query)
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