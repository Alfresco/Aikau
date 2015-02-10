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
 * This widget was written for use in the faceted search page and is used to handle the scenario where a 
 * search term is requested by the search service reports that an alternative (better) search term was used.
 * This widget will both show the alternative term as well as the originally requested term. These terms
 * can both be clicked on in order to publish a request to issue a new search.
 * 
 * @module alfresco/search/AlternativeSearchLabel
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes external:dojo/_OnDijitClickMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_OnDijitClickMixin",
        "alfresco/core/Core",
        "dojo/text!./templates/AlternativeSearchLabel.html",
        "dojo/_base/lang"], 
        function(declare, _WidgetBase, _TemplatedMixin, _OnDijitClickMixin, AlfCore, template, lang) {

   return declare([_WidgetBase, _TemplatedMixin, _OnDijitClickMixin, AlfCore], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlternativeSearchLabel.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlternativeSearchLabel.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/AlternativeSearchLabel.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlternativeSearchLabel.css"}],
      
      /**
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * This is the label to use to prefix the term that was searched for instead of the originally
       * requested term.
       * 
       * @instance
       * @type {string}
       * @default "alternativesearch.searchedFor"
       */
      searchedForLabel: "alternativesearch.searchedFor",

      /**
       * This is the label to use to prefix the term that was originally requested instead of the
       * search that was actually carried out.
       * 
       * @instance
       * @type {string}
       * @default "alternativesearch.searchInsteadFor"
       */
      searchInsteadForLabel: "alternativesearch.searchInsteadFor",

      /**
       * This should be set to the term that was actually searched for.
       *
       * @instance
       * @type {string}
       * @default null
       */
      searchedFor: null,

      /**
       * This should be set to the term that was originally requested
       *
       * @instance
       * @type {string}
       * @default null
       */
      searchRequest: null,

      /**
       * This is the topic that will be subscribed to for receiving alternative search data. It defaults
       * to the topic used by the [AlfSearchList]{@link alfresco/search/AlfSearchList} widget.
       *
       * @instance
       * @type {string}
       * @default "ALF_SPELL_CHECK_SEARCH_TERM"
       */
      subscriptionTopic: "ALF_SPELL_CHECK_SEARCH_TERM",

      /**
       * Iterates over the suggestions.
       *
       * @instance
       */
      postMixInProperties: function alfresco_search_AlternativeSearchLabel__postMixInProperties() {
         this.searchedForLabel = this.message(this.searchedForLabel);
         this.searchInsteadForLabel = this.message(this.searchInsteadForLabel);
         this.alfSubscribe(this.subscriptionTopic, lang.hitch(this, this.onAlternativeSearch));
      },

      /**
       * This is the attribute key to use for retrieving the term that was actually searched for in the
       * payload provided to the [onAlternativeSearch]{@link alfresco/search/AlternativeSearchLabel#onAlternativeSearch}
       * function. It defaults to the key provided by the [AlfSearchList]{@link alfresco/search/AlfSearchList}.
       *
       * @instance
       * @type {string}
       * @default "searchedFor"
       */
      searchedForKey: "searchedFor",

      /**
       * This is the attribute key to use for retrieving the term that was originally requested for in the
       * payload provided to the [onAlternativeSearch]{@link alfresco/search/AlternativeSearchLabel#onAlternativeSearch}
       * function. It defaults to the key provided by the [AlfSearchList]{@link alfresco/search/AlfSearchList}.
       *
       * @instance
       * @type {string}
       * @default "searchRequest"
       */
      searchRequestKey: "searchRequest",

      /**
       * This function handles alternative search data being provided. E.g. it is called when a search has been carried out
       * and the search performed used an alternative search term to the one originally requested. This will then update
       * the [searchedFor]{@link alfresco/search/AlternativeSearchLabel#searchedFor} and
       * [searchRequest]{@link alfresco/search/AlternativeSearchLabel#searchRequest} attributes and update the DOM with the
       * new data.
       *
       * @instance
       * @param {object} payload The payload containing details of the search carried out.
       */
      onAlternativeSearch: function alfresco_search_AlternativeSearchLabel__onAlternativeSearch(payload) {
         var searchedFor = lang.getObject(this.searchedForKey, false, payload);
         var searchRequest = lang.getObject(this.searchRequestKey, false, payload);
         if (searchedFor !== null)
         {
            this.searchedFor = searchedFor;
            this.searchedForNode.innerHTML = searchedFor;
         }
         if (searchRequest !== null)
         {
            this.searchRequest = searchRequest;
            this.searchRequestNode.innerHTML = searchRequest;
         }
      },

      /**
       * This function is called if the user clicks on the link that displays the term that was actually searched on
       *
       * @instance
       * @param {object} evt The click event
       */
      onSearchFor: function alfresco_search_AlternativeSearchLabel__onSearchFor(evt) {
         this.alfPublish("ALF_NAVIGATE_TO_PAGE", {
            type: "HASH",
            url: "searchTerm=" + this.searchedFor
         }, true);
      },

      /**
       * This function is called if the user clicks on the link that displays the term that was originally requested
       *
       * @instance
       * @param {object} evt The click event
       */
      onSearchInsteadFor: function alfresco_search_AlternativeSearchLabel__onSearchInsteadFor(evt) {
          this.alfPublish("ALF_SET_SEARCH_TERM", {
            type: "HASH",
            searchTerm: this.searchRequest,
            spellcheck: false
         }, true);
      }
   });
});