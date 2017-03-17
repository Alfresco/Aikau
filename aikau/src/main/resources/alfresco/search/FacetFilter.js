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
 * 
 * @module alfresco/search/FacetFilter
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_OnDijitClickMixin",
        "dojo/text!./templates/FacetFilter.html",
        "alfresco/core/Core",
        "alfresco/core/topics",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/on",
        "alfresco/util/hashUtils",
        "dojo/io-query",
        "alfresco/core/ArrayUtils"], 
        function(declare, _WidgetBase, _TemplatedMixin, _OnDijitClickMixin, template,  AlfCore, topics, 
                 lang, array, domConstruct, domClass, on, hashUtils, ioQuery, arrayUtils) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/FacetFilter.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/FacetFilter.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/FacetFilter.css"}]
       */
      cssRequirements: [{cssFile:"./css/FacetFilter.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * Indicate whether or not the filter is currently applied
       *
       * @instance
       * @type {boolean}
       * @default
       */
      applied: false,
      
      /**
       * The alt-text to use for the image that indicates that a filter has been applied
       *
       * @instance
       * @type {string} 
       * @default
       */
      appliedFilterAltText: "facet.filter.applied.alt-text",

      /**
       * The path to use as the source for the image that indicates that a filter has been applied
       *
       * @instance
       * @type {string}
       * @default
       */
      appliedFilterImageSrc: "12x12-selected-icon.png",

      /**
       * The facet qname
       *
       * @instance
       * @type {string} 
       * @default
       */
      facet: null,

      /**
       * The filter (or more accurately the filterId) for this filter
       * 
       * @instance
       * @type {string} 
       * @default
       */
      filter: null,
      
      /**
       * Additional data for the filter (appended after the filter with a bar, e.g. tag|sometag)
       * 
       * @instance
       * @type {string}
       * @default
       */
      filterData: "",

      /**
       * Indicates that the filter cannot be applied because the a search request is in progress.
       * This is updated by the [blockFilterRequests]{@link module:alfresco/search/FacetFilter#blockFilterRequests}
       * and [unblockFilterRequests]{@link module:alfresco/search/FacetFilter#unblockFilterRequests} functions.
       * It should not be configured.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.51
       */
      _filteringBlocked: false,

      /**
       * Indicates whether or not the full width of the filter (including the count and the white space)
       * can be clicked to toggle the filter.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.47
       */
      fullWidthClick: false,

      /**
       * Indicates that the filter should be hidden. This will be set to "true" if any required data is missing
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      hide: false,
      
      /**
       * When this is set to true the current URL hash fragment will be used to initialise the facet selection
       * and when the facet is selected the hash fragment will be updated with the facet selection.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      useHash: false,

      /**
       * Sets up the attributes required for the HTML template.
       * @instance
       */
      postMixInProperties: function alfresco_search_FacetFilter__postMixInProperties() {
         if (this.label && this.facet && this.filter && this.hits)
         {
            this.label = this.message(this.label);

            // Localize the alt-text for the applied filter message...
            this.appliedFilterAltText = this.message(this.appliedFilterAltText, {0: this.label});

            // Set the source for the image to use to indicate that a filter is applied...
            this.appliedFilterImageSrc = require.toUrl("alfresco/search/css/images/" + this.appliedFilterImageSrc);
         }
         else
         {
            // Hide the filter if there is no label or no link...
            this.alfLog("warn", "Not enough information provided for filter. It will not be displayed", this);
            this.hide = true;
         }
      },
      
      /**
       * @instance
       */
      postCreate: function alfresco_search_FacetFilter__postCreate() {
         if (this.hide === true)
         {
            domClass.add(this.domNode, "hidden");
         }

         if (this.applied)
         {
            domClass.remove(this.removeNode, "hidden");
            domClass.add(this.labelNode, "applied");
         }

         if (this.fullWidthClick)
         {
            domClass.add(this.domNode, "alfresco-search-FacetFilter--full-width-click");
         }

         // See AKU-782 - Ensure that filters cannot be applied when search requests are in progress...
         this.alfSubscribe(topics.SEARCH_REQUEST, lang.hitch(this, this.onSearchRequestStart));
         this.alfSubscribe(topics.GET_DOCUMENT_LIST_SUCCESS, lang.hitch(this, this.onSearchRequestEnd));
      },
      
      /**
       * This function is called from [onSearchRequestStart]{@link module:alfresco/search/FacetFilter#onSearchRequestStart}
       * and sets the [_filteringBlocked]{@link module:alfresco/search/FacetFilter#_filteringBlocked} to be true
       * to prevent further filtering from being performed whilst search requests are in progress.
       * 
       * @instance
       * @since 1.0.51
       */
      blockFilterRequests: function alfresco_search_FacetFilter__blockFilterRequests() {
         this._filteringBlocked = true;
         domClass.add(this.domNode, "alfresco-search-FacetFilter--block-requests");
      },

      /**
       * This function is called from [onSearchRequestEnd]{@link module:alfresco/search/FacetFilter#onSearchRequestEnd}
       * and sets the [_filteringBlocked]{@link module:alfresco/search/FacetFilter#_filteringBlocked} to be false
       * to indicate that the filter can be applied as there is no search request currently in progress.
       * 
       * @instance
       * @since 1.0.51
       */
      unblockFilterRequests: function alfresco_search_FacetFilter__unblockFilterRequests() {
         this._filteringBlocked = false;
         domClass.remove(this.domNode, "alfresco-search-FacetFilter--block-requests");
      },

      /**
       * This function is called when a search request is made. It calls
       * [blockFilterRequests]{@link module:alfresco/search/FacetFilter#blockFilterRequests} to ensure that
       * no further filtering can be performed whilst a search request is in progress.
       * 
       * @instance
       * @param  {object} payload The request start payload
       * @since 1.0.51
       */
      onSearchRequestStart: function alfresco_search_FacetFilter__onSearchRequestStart(/*jshint unused:false*/ payload) {
         this.blockFilterRequests();
      },

      /**
       * This function is called when a search request is made. It calls
       * [unblockFilterRequests]{@link module:alfresco/search/FacetFilter#unblockFilterRequests} to allow filtering
       * to occur as no search request is in progress.
       * 
       * @instance
       * @param  {object} payload The request start payload
       * @since 1.0.51
       */
      onSearchRequestEnd: function alfresco_search_FacetFilter__onSearchRequestEnd(/*jshint unused:false*/ payload) {
         this.unblockFilterRequests();
      },

      /**
       * If the filter has previously been applied then it is removed, if the filter is not applied
       * then it is applied. Note that it is not possible for filters to be applied when
       * [_filteringBlocked]{@link module:alfresco/search/FacetFilter#_filteringBlocked} has been set
       * to true.
       *
       * @instance
       */
      onToggleFilter: function alfresco_search_FacetFilter__onToggleFilter(evt) {
         if (this._filteringBlocked)
         {
            this.alfLog("log", "Facet filtering blocked whilst search request in progress", this);
         }
         else if (evt.target === this.labelNode || this.fullWidthClick)
         {
            if (this.applied)
            {
               this.onClearFilter();
            }
            else
            {
               this.onApplyFilter();
            }
         }
         else
         {
            this.alfLog("debug", "Clicking on details node not supported for current configuration", this);
         }
      },

      /**
       * Applies the current filter by publishing the details of the filter along with the facet to 
       * which it belongs and then displays the "applied" image.
       *
       * @instance
       */
      onApplyFilter: function alfresco_search_FacetFilter__onApplyFilter() {
         var fullFilter = encodeURIComponent(this.facet + "|" + this.filter);
         if(this.useHash)
         {
            this._updateHash(fullFilter, "add");
         }
         else
         {
            this.alfPublish("ALF_APPLY_FACET_FILTER", {
               filter: fullFilter
            });
         }

         domClass.remove(this.removeNode, "hidden");
         domClass.add(this.labelNode, "applied");
         this.applied = true;
      },

      /**
       * Removes the current filter by publishing the details of the filter along with the facet
       * to which it belongs and then hides the "applied" image
       * 
       * @instance
       */
      onClearFilter: function alfresco_search_FacetFilter__onClearFilter() {
         var fullFilter = encodeURIComponent(this.facet + "|" + this.filter);
         if(this.useHash)
         {
            this._updateHash(fullFilter, "remove");
         }
         else
         {
            this.alfPublish("ALF_REMOVE_FACET_FILTER", {
               filter: fullFilter
            });
         }

         domClass.add(this.removeNode, "hidden");
         domClass.remove(this.labelNode, "applied");
         this.applied = false;
      },

      /**
       * Performs updates to the url hash as facets are selected and de-selected
       * 
       * @instance
       */
      _updateHash: function alfresco_search_FacetFilter___updateHash(fullFilter, mode) {
         // Get the existing hash and extract the individual facetFilters into an array
         var aHash = hashUtils.getHash(),
             facetFilters = ((aHash.facetFilters) ? aHash.facetFilters : ""),
             facetFiltersArr = (facetFilters === "") ? [] : facetFilters.split(",");

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
      }
   });
});