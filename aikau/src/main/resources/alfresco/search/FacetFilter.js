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
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/on",
        "alfresco/util/hashUtils",
        "dojo/io-query",
        "alfresco/core/ArrayUtils"], 
        function(declare, _WidgetBase, _TemplatedMixin, _OnDijitClickMixin, template,  AlfCore, lang, array, domConstruct, domClass, on, hashUtils, ioQuery, arrayUtils) {

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
            this.appliedFilterImageSrc = require.toUrl("alfresco/search") + "/css/images/" + this.appliedFilterImageSrc;
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
      },
      
      /**
       * If the filter has previously been applied then it is removed, if the filter is not applied
       * then it is applied.
       *
       * @instance
       */
      onToggleFilter: function alfresco_search_FacetFilter__onToggleFilter(/*jshint unused:false*/ evt) {
         if (this.applied)
         {
            this.onClearFilter();
         }
         else
         {
            this.onApplyFilter();
         }
      },

      /**
       * Applies the current filter by publishing the details of the filter along with the facet to 
       * which it belongs and then displays the "applied" image.
       *
       * @instance
       */
      onApplyFilter: function alfresco_search_FacetFilter__onApplyFilter() {
         var fullFilter = this.facet + "|" + this.filter;
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
         var fullFilter = this.facet + "|" + this.filter;
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