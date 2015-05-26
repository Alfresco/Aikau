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
 * Extends the [sortable paginated list]{@link module:alfresco/lists/AlfSortablePaginatedList} to
 * handle search specific data.
 *
 * @module alfresco/search/AlfSearchList
 * @extends alfresco/lists/AlfSortablePaginatedList
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/lists/AlfSortablePaginatedList",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/hash",
        "dojo/io-query",
        "alfresco/core/ArrayUtils",
        "alfresco/search/AlfSearchListView"],
        function(declare, AlfSortablePaginatedList, array, lang, hash, ioQuery, arrayUtils) {

   return declare([AlfSortablePaginatedList], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfSearchList.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfSearchList.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AlfSearchList.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfSearchList.css"}],

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/AlfSortablePaginatedList#setupSubscriptions}
       * to subscribe to search specific topics.
       *
       * @instance
       */
      setupSubscriptions: function alfresco_search_AlfSearchList__setupSubscriptions() {
         this.inherited(arguments);
         this.alfSubscribe("ALF_SET_SEARCH_TERM", lang.hitch(this, this.onSearchTermRequest));
         this.alfSubscribe("ALF_INCLUDE_FACET", lang.hitch(this, this.onIncludeFacetRequest));
         this.alfSubscribe("ALF_APPLY_FACET_FILTER", lang.hitch(this, this.onApplyFacetFilter));
         this.alfSubscribe("ALF_REMOVE_FACET_FILTER", lang.hitch(this, this.onRemoveFacetFilter));
         this.alfSubscribe("ALF_SEARCHLIST_SCOPE_SELECTION", lang.hitch(this, this.onScopeSelection));
         this.alfSubscribe("ALF_ADVANCED_SEARCH", lang.hitch(this, this.onAdvancedSearch));
         this.alfSubscribe(this.reloadDataTopic, lang.hitch(this, this.reloadData));
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/lists/AlfList#setDisplayMessages}
       * to set search specific messages.
       *
       * @instance
       */
      setDisplayMessages: function alfresco_search_AlfSearchList__setDisplayMessages() {
         this.noViewSelectedMessage = this.message("searchlist.no.view.message");
         this.noDataMessage = this.message("searchlist.no.data.message");
         this.fetchingDataMessage = this.message("searchlist.loading.data.message");
         this.renderingViewMessage = this.message("searchlist.rendering.data.message");
         this.fetchingMoreDataMessage = this.message("searchlist.loading.data.message");
         this.dataFailureMessage = this.message("searchlist.data.failure.message");
      },

      /**
       * Include spell checking in search requests.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      spellcheck: true,

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/AlfSortablePaginatedList#postMixInProperties}
       * @instance
       */
      postMixInProperties: function alfresco_search_AlfSearchList__postMixInProperties() {
         this.inherited(arguments);
         this._suspendSpellCheck = false;
         this._cleanResettableVars();

         if (this.useHash === true)
         {
            // Push the core hash update variables into the array configured by the extended AlfSortablePaginatedList
            this._coreHashVars.push("searchTerm","scope","facetFilters");
         }

         // NOTE: This is required to ensure that no search is performed when no search hash variables are
         //       initially provided. Added for backwards compatibility.
         this.currentFilter = {};
      },

      /**
       * Reloads the data by making a search using the currently set search attributes. Typically
       * called following actions
       *
       * @instance
       * @param {object} payload The payload of the publication requesting the reload
       */
      reloadData: function alfresco_search_AlfSearchList__reloadData() {
         this.resetResultsList();
         this.loadData();
      },

      /**
       * The current term to search on
       *
       * @instance
       * @type {string}
       * @default ""
       */
      searchTerm: "",

      /**
       * Updates the current search term. Note that this is not currently sufficient for setting complete
       * search data (such as facets, filters, sort order, etc) so this will need to be iterated on as
       * needed.
       *
       * @instance
       * @param {object} payload The details of the search term to set
       */
      onSearchTermRequest: function alfresco_search_AlfSearchList__onSearchTermRequest(payload) {
         this.alfLog("log", "Setting search term", payload, this);
         var searchTerm = lang.getObject("searchTerm", false, payload);
         if (searchTerm === null || searchTerm === undefined)
         {
            this.alfLog("warn", "No searchTerm provided on request", payload, this);
         }
         else if (searchTerm === this.searchTerm)
         {
            // The requested search term is the same as the previous one...
            // We want to allow duplicate searches to be made (to address eventual consistency issues)
            // but we want to prevent concurrent requests using the same data...
            if (this.requestInProgress === true)
            {
               // If a request is currently in progress, then we can just ignore this request.
            }
            else
            {
               if (payload.spellcheck === false)
               {
                  this._suspendSpellCheck = true;
               }

               // If a request is NOT in progress then we need to manually request a new search, because re-setting
               // the hash will not trigger the changeFilter function....
               // If the current hash includes a term from the resetHashTerms array, we need to clear those terms before
               // setting a search term (even if it is the same), in this case updating the hash will trigger the search...
               var currHash = ioQuery.queryToObject(hash());
               if (this._cleanResettableHashTerms(currHash))
               {
                  currHash.searchTerm = this.searchTerm;
                  this.alfPublish("ALF_NAVIGATE_TO_PAGE", {
                     url: ioQuery.objectToQuery(currHash),
                     type: "HASH"
                  }, true);
               }
               else
               {
                  // The current hash has no resettable terms so we need to trigger a manual search...
                  this.resetResultsList();
                  this.loadData();
               }
            }
         }
         else
         {
            // The requested search term is new, so updating the hash will result in a new search...
            this.searchTerm = searchTerm;
            var currHash = ioQuery.queryToObject(hash());
            this._cleanResettableHashTerms(currHash);
            currHash.searchTerm = this.searchTerm;
            this.alfPublish("ALF_NAVIGATE_TO_PAGE", {
               url: ioQuery.objectToQuery(currHash),
               type: "HASH"
            }, true);
         }
      },

      /**
       * Handle advanced search requests.
       *
       * @instance
       * @param {object} payload The details of what to search for.
       */
      onAdvancedSearch: function alfresco_search_AlfSearchList__onAdvancedSearch(payload) {
         this.resetResultsList();
         this.searchTerm = payload.searchTerm;
         delete payload.searchTerm;
         this.query = payload;
         this.loadData();
      },

      /**
       * The initially selected scope. This should either be "repo", "all_sites" or the shortname of a
       * specific site.
       *
       * @instance
       * @type {string}
       * @default "repo"
       */
      selectedScope: "repo",

      /**
       *
       *
       * @instance
       * @param {object} payload The details of the scope selected.
       */
      onScopeSelection: function alfresco_search_AlfSearchList__onScopeSelection(payload) {
         this.alfLog("log", "Scope selection received", payload, this);
         var scope = lang.getObject("value", false, payload);
         if (scope === null || scope === undefined)
         {
            this.alfLog("warn", "No 'value' attribute provided in scope selection payload", payload, this);
         }
         else if (scope === this.selectedScope)
         {
            this.alfLog("log", "Scope requested is currently set", scope, this);
         }
         else
         {
            var currHash = ioQuery.queryToObject(hash());
            this.selectedScope = scope;
            currHash.scope = scope;
            if (scope === "repo" || scope === "all_sites")
            {
               this.siteId = "";
            }
            else
            {
               this.siteId = scope;
            }

            // Update the hash to trigger a search...
            this.alfPublish("ALF_NAVIGATE_TO_PAGE", {
               url: ioQuery.objectToQuery(currHash),
               type: "HASH"
            }, true);
         }
      },

      /**
       * The facet fields to include in searches. This is updated by the onIncludeFacetRequest function.
       *
       * @instance
       * @type {string}
       * @default ""
       */
      facetFields: "",

      /**
       * This indicates whether or not to hide or display the included facets details when
       * results are loaded. This is initialised to true, but will be changed to false if
       * any facets are requested to be included in the page.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      hideFacets: true,

      /**
       *
       * @instance
       * @param {object} payload The details of the facet to include
       */
      onIncludeFacetRequest: function alfresco_search_AlfSearchList__onIncludeFacetRequest(payload) {
         this.alfLog("log", "Adding facet filter", payload, this);
         var qname = lang.getObject("qname", false, payload);
         var blockIncludeFacetRequest = lang.getObject("blockIncludeFacetRequest", false, payload);
         if (qname === null || qname === undefined)
         {
            this.alfLog("warn", "No qname provided when adding facet field", payload, this);
         }
         else if (blockIncludeFacetRequest !== null && blockIncludeFacetRequest === true)
         {
            // Don't include the facet in the facet fields, however indicate that facet
            this.hideFacets = false;
         }
         else
         {
            // Make sure each facet is only included once (the search API is not tolerant of duplicates)...
            // Even if multiple widgets want to include the same facet, they will all receive the same
            // publication on search results...
            this.hideFacets = false;
            var f = this.facetFields.split(",");
            var alreadyAdded = array.some(f, function(currQName) {
               return currQName === qname;
            });
            if (alreadyAdded)
            {
               // No action required - the request QName has already been included
            }
            else
            {
               this.facetFields = (this.facetFields !== "") ? this.facetFields + "," + qname : qname;
            }
         }
      },

      /**
       * The filters of facets that should be applied to search queries. This can either be configured
       * when the widget is created or can be set via the browser hash fragment.
       *
       * @instance
       * @type {object}
       * @default null
       */
      facetFilters: null,

      /**
       * This function is called as a result of publishing on the "ALF_APPLY_FACET_FILTER" topic. It will
       * update the current [filters]{@link module:alfresco/search/AlfSearchList#facetFilters}
       * object with a new entry for the request filter.
       *
       * @instance
       * @param {object} payload The details of the facet filter to apply
       */
      onApplyFacetFilter: function alfresco_search_AlfSearchList__onApplyFacetFilter(payload) {
         this.alfLog("log", "Filtering on facet", payload, this);
         var filter = lang.getObject("filter", false, payload);
         if (filter === null || filter === undefined)
         {
            this.alfLog("warn", "No filter provided when filtering by facet", payload, this);
         }
         else
         {
            this.facetFilters[filter] = true;
            this.updateFilterHash(filter, "add");
         }
      },

      /**
       * This function is called as a result of publishing on the "ALF_REMOVE_FACET_FILTER" topic. It will
       * update the current [filters]{@link module:alfresco/search/AlfSearchList#facetFilters}
       * object to delete the supplied filter
       *
       * @instance
       * @param {object} payload The details of the facet filter to apply
       */
      onRemoveFacetFilter: function alfresco_search_AlfSearchList__onRemoveFacetFilter(payload) {
         this.alfLog("log", "Removing facet filter", payload, this);
         delete this.facetFilters[payload.filter];
         this.updateFilterHash(payload.filter, "remove");
      },

      /**
       * Performs updates to the url hash as facets are selected and de-selected
       *
       * @instance
       *
       * @fires ALF_NAVIGATE_TO_PAGE
       */
      updateFilterHash: function alfresco_search_AlfSearchList__updateFilterHash(fullFilter, mode) {

         // Get the existing hash and extract the individual facetFilters into an array
         var aHash = ioQuery.queryToObject(hash()),
             facetFilters = aHash.facetFilters ? aHash.facetFilters : "",
             facetFiltersArr = facetFilters === "" ? [] : facetFilters.split(",");

         // Add or remove the filter from the hash object
         if(mode === "add" && !arrayUtils.arrayContains(facetFiltersArr, fullFilter))
         {
            facetFiltersArr.push(fullFilter);
         }
         else if (mode === "remove" && arrayUtils.arrayContains(facetFiltersArr, fullFilter))
         {
            facetFiltersArr.splice(facetFiltersArr.indexOf(fullFilter), 1);
         }

         // Put the manipulated filters back into the hash object or remove the property if empty
         if(facetFiltersArr.length < 1)
         {
            delete aHash.facetFilters;
         }
         else
         {
            aHash.facetFilters = facetFiltersArr.join();
         }

         // Send the hash value back to navigation
         this.alfPublish("ALF_NAVIGATE_TO_PAGE", {
            url: ioQuery.objectToQuery(aHash),
            type: "HASH"
         }, true);
      },

      /**
       * If [useHash]{@link module:alfresco/lists/AlfHashList#useHash} has been set to true
       * then this function will be called whenever the browser hash fragment is modified. It will update
       * the attributes of this instance with the values provided in the fragment.
       *
       * @instance
       * @param {object} payload
       */
      onHashChanged: function alfresco_search_AlfSearchList__onHashChanged(payload) {
         this.alfLog("log", "Hash change detected", payload, this);

         // Only update if the payload contains one of the variables we care about
         if(this.doHashVarUpdate(payload, this.updateInstanceValues))
         {
            // If the search term has changed then we want to delete the facet filters as
            // they might not be applicable to the new search results...
            var newSearchTerm = lang.getObject("searchTerm", false, payload);
            if (newSearchTerm !== this.searchTerm)
            {
               this._cleanResettableVars();
            }

            // The facet filters need to be handled directly because they are NOT just passed as
            // a simple string. Create a new object for the filters and then break up the filters
            // based on comma delimition and assign each element as a new key in the filters object
            var filters = lang.getObject("facetFilters", false, payload);
            if (filters !== null && filters !== undefined)
            {
               var ff = payload.facetFilters = {};
               var fArr = filters.split(",");
               array.forEach(fArr, function(filter) {
                  ff[filter] = true;
               }, this);
            }
            else
            {
               this._cleanResettableVars();
            }

            lang.mixin(this, payload);
            this.resetResultsList();
            this.loadData();
         }
      },

      /**
       * Processes all the current search arguments into a payload that is published to the [Search Service]{@link module:alfresco/services/SearchService}
       * to perform the actual search request
       *
       * @instance
       */
      loadData: function alfresco_search_AlfSearchList__loadData() {
         if (this.requestInProgress && this.blockConcurrentRequests)
         {
            // TODO: Inform user that request is in progress?
            this.alfLog("log", "Search request ignored because progress is already in progress");
         }
         else
         {
            if (this.currentRequestId)
            {
                this.alfPublish("ALF_STOP_SEARCH_REQUEST", {
                   requestId: this.currentRequestId
                }, true);
            }

            // InfiniteScroll uses pagination under the covers.
            var startIndex = 0;
            if (this.useInfiniteScroll)
            {
               // Search API wants startIndex rather than page, so we need to convert here.
               startIndex = (this.currentPage - 1) * this.currentPageSize;
            }

            if (!this.useInfiniteScroll ||
                !this.currentData ||
                this.currentData.numberFound >= startIndex)
            {
               this.alfPublish(this.requestInProgressTopic, {});
               this.showLoadingMessage();

               var filters = "";
               for (var key in this.facetFilters)
               {
                  if (this.facetFilters.hasOwnProperty(key))
                  {
                     filters = filters + key.replace(/\.__.u/g, "").replace(/\.__/g, "") + ",";
                  }
               }
               filters = filters.substring(0, filters.length - 1);

               // Make sure the repo param is set appropriately...
               // The repo instance variable trumps everything else...
               var siteId = (this.scope === "repo" || this.scope === "all_sites") ? "" : this.scope;

               this.currentRequestId = this.generateUuid();
               var searchPayload = {
                  term: this.searchTerm,
                  facetFields: this.facetFields,
                  filters: filters,
                  sortAscending: this.sortAscending,
                  sortField: this.sortField,
                  site: siteId,
                  rootNode: this.rootNode,
                  repo: this.scope === "repo",
                  requestId: this.currentRequestId,
                  pageSize: this.currentPageSize,
                  maxResults: 0,
                  startIndex: startIndex,
                  spellcheck: this.spellcheck && !this._suspendSpellCheck
               };

               if (this.query)
               {
                  delete this.query.alfTopic;
                  delete this.query.alfPublishScope;

                  if(typeof this.query === "string")
                  {
                     this.query = JSON.parse(this.query);
                  }

                  for (var key in this.query)
                  {
                     if (this.query.hasOwnProperty(key))
                     {
                        searchPayload[key] = this.query[key];
                     }
                  }
               }

               // Set a response topic that is scoped to this widget...
               searchPayload.alfResponseTopic = this.pubSubScope + "ALF_RETRIEVE_DOCUMENTS_REQUEST";
               this.alfPublish("ALF_SEARCH_REQUEST", searchPayload, true);
            }
            else
            {
               this.alfLog("log", "No more data to to retrieve, cancelling search request", this);
            }
         }
      },

      /**
       * Handles successful calls to get data from the repository.
       *
       * @instance
       * @param {object} response The response object
       * @param {object} originalRequestConfig The configuration that was passed to the the [serviceXhr]{@link module:alfresco/core/CoreXhr#serviceXhr} function
       */
      onDataLoadSuccess: function alfresco_search_AlfSearchList__onDataLoadSuccess(payload) {
         this.alfLog("log", "Search Results Loaded", payload, this);

         var newData = payload.response;
         this.currentData = newData; // Some code below expects this even if the view is null.

         // Reset suspending the spell check...
         this._suspendSpellCheck = false;

         // Re-render the current view with the new data...
         var view = this.viewMap[this._currentlySelectedView];
         if (view !== null)
         {
            this.showRenderingMessage();

            if (this.useInfiniteScroll)
            {
               view.augmentData(newData);
               this.currentData = view.getData();
            }
            else
            {
               view.setData(newData);
            }

            view.renderView(this.useInfiniteScroll);
            this.showView(view);
         }

         // TODO: This should probably be in the SearchService... but will leave here for now...
         var facets = lang.getObject("response.facets", false, payload);
         var filters = lang.getObject("requestConfig.query.filters", false, payload);
         if (facets !== null && facets !== undefined)
         {
            for (var key in facets)
            {
               if (facets.hasOwnProperty(key))
               {
                  var facet = key;
                  if (key[0] === "@")
                  {
                     facet = key.substring(1);
                  }
                  this.alfPublish("ALF_FACET_RESULTS_" + facet, {
                     facetResults: facets[key],
                     activeFilters: filters
                  });
               }
            }
         }

         // Handle any spell checking data included in the results...
         this.handleSpellCheck(payload);

         var resultsCount = this.currentData.numberFound !== -1 ? this.currentData.numberFound : 0;
         if (resultsCount !== null)
         {
            // Publish the number of search results found...
            this.alfPublish("ALF_SEARCH_RESULTS_COUNT", {
               count: resultsCount,
               label: this.message("faceted-search.results-menu.results-found", {
                  0: resultsCount
               })
            });
         }

         this.alfPublish("ALF_HIDE_FACETS", {
            hide: this.hideFacets === true || resultsCount === 0
         });

         // This request has finished, allow another one to be triggered.
         this.alfPublish(this.requestFinishedTopic, {});

         // Force a resize of the sidebar container to take the new height of the view into account...
         this.alfPublish("ALF_RESIZE_SIDEBAR", {});
      },

      /**
       * This function can be called to handle spell check results. If a search term did not match to any
       * results or similar search terms yield better results then the search API may either have carried out
       * the alternative search or has provided some alternative suggestions to search for. This function
       * checks the search result payload and publishes on the "ALF_SPELL_CHECK_SEARCH_TERM" and
       * "ALF_SPELL_CHECK_SEARCH_SUGGESTIONS" topics respectively with that data.
       *
       * @instance
       * @param {object} payload The payload containing the search result data
       */
      handleSpellCheck: function alfresco_search_AlfSearchList__handleSpellCheck(payload) {
         // Check to see whether or not spell checking was applied...
         var spellcheck = lang.getObject("response.spellcheck", false, payload);
         if (spellcheck !== null && spellcheck !== undefined)
         {
            if (spellcheck.searchedFor !== null && spellcheck.searchedFor !== undefined)
            {
               // Update the local state to reflect what was actually searched for...
               // this.searchTerm = spellcheck.searchedFor;

               // This means that an alternative search term was used...
               this.alfPublish("ALF_SPELL_CHECK_SEARCH_TERM", {
                  searchRequest: spellcheck.searchRequest,
                  searchedFor: spellcheck.searchedFor
               });
            }
            else if (spellcheck.searchSuggestions !== null && spellcheck.searchSuggestions !== undefined)
            {
               // This means that an alternative search was not performed, but suggested searches
               // are available...
               var suggestions = [];
               array.forEach(spellcheck.searchSuggestions, function(suggestion) {
                  suggestions.push({
                     term: suggestion
                  });
               });
               this.alfPublish("ALF_SPELL_CHECK_SEARCH_SUGGESTIONS", {
                  searchRequest: spellcheck.searchRequest,
                  searchSuggestions: suggestions
               });
            }
            else
            {
               // This means that the requested search term was used. No action required.
            }
         }
      },

      /**
       * Clear Old results from list & reset counts.
       *
       * @instance
       */
      resetResultsList: function alfresco_search_AlfSearchList__resetResultsList() {
         this.startIndex = 0;
         this.currentPage = 1;
         this.hideChildren(this.domNode);
         this.clearViews();
      },

      /**
       * The vars and terms showing on the url hash that should be reset for a new search.
       *
       * @instance
       * @type {string[]}
       * @default ["facetFilters", "query"]
       */
      _resetVars: ["facetFilters", "query"],

      /**
       * Clean resettable variables based on resetVars array.
       *
       * @instance
       */
      _cleanResettableVars: function alfresco_search_AlfSearchList___cleanResettableVars() {
         for (var i = 0; i < this._resetVars.length; i++) {
            this[this._resetVars[i]] = {};
         }
      },

      /**
       * Clean resettable hash terms based on resetVars array.
       *
       * @instance
       * @param {object} currHash An object containing current hash values
       * @return boolean
       */
      _cleanResettableHashTerms: function alfresco_search_AlfSearchList___cleanResettableHashTerms(currHash) {
         var hasTerm = false;
         for (var term in currHash) {
            if(this._resetVars.indexOf(term) !== -1 && currHash[term] !== null && currHash[term] !== "")
            {
               hasTerm = true;
               delete currHash[term];
            }
         }
         return hasTerm;
      }
   });
});