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
 * @module alfresco/forms/controls/MultiSelect
 * @extends external:dijit/_TemplatedMixin
 * @extends external:dijit/_WidgetBase
 * @author Martin Doyle
 */
define([
      "dijit/_TemplatedMixin",
      "dijit/_WidgetBase",
      "dojo/_base/declare",
      "dojo/_base/lang",
      "dojo/Deferred",
      "dojo/dom-construct",
      "dojo/dom-style",
      "dojo/dom-class",
      "dojo/keys",
      "dojo/on",
      "dojo/text!./templates/MultiSelect.html"
   ],
   function(_TemplatedMixin, _WidgetBase, declare, lang, Deferred, domConstruct, domStyle, domClass, keys, on, template) {

      return declare([_WidgetBase, _TemplatedMixin], {

         /**
          * An array of the CSS files to use with this widget.
          *
          * @instance
          * @type {object[]}
          * @default [{cssFile:"./css/MultiSelect.css"}]
          */
         cssRequirements: [{
            cssFile: "./css/MultiSelect.css"
         }],

         /**
          * The HTML template to use for the widget.
          *
          * @override
          * @instance
          * @type {String}
          */
         templateString: template,

         /**
          * The root class of this widget
          *
          * @protected
          * @instance
          * @type {string}
          */
         rootClass: "alfresco-forms-controls-MultiSelect",

         /**
          * A cache of the current search value
          *
          * @type {string}
          */
         _currentSearchValue: "",

         /**
          * The index of the latest search request
          *
          * @type {number}
          */
         _latestSearchRequestIndex: 0,

         /**
          * Timeout used to debounce new search requests
          *
          * @type {number}
          */
         _newSearchTimeout: 0,

         /**
          * A cache of the last search value
          *
          * @type {string}
          */
         _prevSearchValue: null,

         /**
          * The number of milliseconds to debounce search requests, i.e. the pause
          * needed during typing for a search request to actually kick off
          *
          * @type {number}
          */
         _searchDebounceMs: 250,

         /**
          * TEMPORARY - Override of proper functionality for development purposes
          *
          * @override
          * @instance
          * @returns  {object} A dojo/promise/Promise object
          */
         alfPublishToPromise: function() {
            console.log("alfPublishToPromise...");
            var deferred = new Deferred();
            setTimeout(function() {
               // deferred.resolve({
               //    aloha: "Hi there"
               // });
               deferred.reject({
                  message: "An expected error occurred - \"Wibble!\""
               });
            }, 1000);
            return deferred.promise;
         },

         /**
          * Widget template has been turned into a DOM
          *
          * @override
          * @instance
          */
         buildRendering: function alfresco_forms_controls_MultiSelect__buildRendering() {
            this.inherited(arguments);
            this.width && domStyle.set(this.domNode, "width", this.width);
         },

         /**
          * Constructor
          *
          * @override
          * @instance
          */
         constructor: function alfresco_forms_controls_MultiSelect__constructor() {
            window.alfMs = this;
         },

         /**
          * Widget has been created, but possibly not sub-widgets
          *
          * @override
          * @instance
          */
         postCreate: function alfresco_forms_controls_MultiSelect__postCreate() {
            this.inherited(arguments);
            this.own(on(this.domNode, "click", lang.hitch(this, this._onControlClick)));
            this.own(on(this.searchBox, "focus", lang.hitch(this, this._onSearchFocus)));
            this.own(on(this.searchBox, "blur", lang.hitch(this, this._onSearchBlur)));
         },

         /**
          * Widget and sub-widgets have been created
          *
          * @override
          * @instance
          */
         startup: function alfresco_forms_controls_MultiSelect__startup() {
            this.inherited(arguments);
         },

         /**
          * Set the value of the control
          *
          * @instance
          * @param    {string[]} newValues The new values
          */
         setValue: function alfresco_forms_controls_MultiSelect__setValue(newValue) {
            /*jshint unused:false*/
            // NOOP
         },

         /**
          * Do not fire multiple searches needlessly. Debounce the search requests,
          * i.e. wait until the user has paused typing to actually do the search.
          *
          * @instance
          * @protected
          * @param    {string} searchString The search string to use
          */
         _debounceNewSearch: function alfresco_forms_controls_MultiSelect___debounceNewSeach(searchString) {
            clearTimeout(this._newSearchTimeout);
            this._newSearchTimeout = setTimeout(lang.hitch(this, function() {
               this._startSearch(searchString);
            }), this._searchDebounceMs);
         },

         /**
          * Handle failures that occur when calling the search service
          *
          * @instance
          * @protected
          * @param    {object} err The error object
          */
         _handleSearchFailure: function alfresco_forms_controls_MultiSelect___handleSearchFailure(err) {
            this._hideLoading();
            this._showError(err.message);
            this.alfLog("error", "Error occurred during search: ", err);
         },

         /**
          * Handle the (successful) response from the search service
          *
          * @instance
          * @protected
          * @param    {object} response The response
          */
         _handleSearchSuccess: function alfresco_forms_controls_MultiSelect___handleSearchSuccess(response) {
            this._hideLoading();
            console.warn("Response received from search service: ", response);
         },

         /**
          * Hide the error dropdown
          *
          * @instance
          * @protected
          */
         _hideError: function alfresco_forms_controls_MultiSelect___hideError() {
            domClass.remove(this.domNode, this.rootClass + "--show-error");
         },

         /**
          * Hide the loading dropdown
          *
          * @instance
          * @protected
          */
         _hideLoading: function alfresco_forms_controls_MultiSelect___hideLoading() {
            domClass.remove(this.domNode, this.rootClass + "--show-loading");

         },

         /**
          * Hide the results dropdown
          *
          * @instance
          * @protected
          */
         _hideResultsDropdown: function alfresco_forms_controls_MultiSelect___hideResults() {
            domClass.remove(this.domNode, this.rootClass + "--show-results");
            this._hideLoading();
            this._hideError();
         },

         /**
          * Handle clicks on the control
          *
          * @instance
          * @protected
          * @param    {object} evt Dojo-normalised event object
          */
         _onControlClick: function alfresco_forms_controls_MultiSelect___onControlClick(evt) {
            var controlIsFocused = domClass.contains(this.domNode, this.rootClass + "--focused");
            if (evt.target !== this.searchBox && !controlIsFocused) {
               this.searchBox.focus();
            }
         },

         /**
          * Handle blur events on the search box
          *
          * @instance
          * @protected
          * @param {object} evt Dojo-normalised event object
          */
         _onSearchBlur: function alfresco_forms_controls_MultiSelect___onSearchBlur(evt) {
            /*jshint unused:false*/
            domClass.remove(this.domNode, this.rootClass + "--focused");
            this._hideResultsDropdown();
         },

         /**
          * Handle changes to the search box value
          *
          * @instance
          * @protected
          * @param {string} newValue The new search value
          */
         _onSearchChange: function alfresco_forms_controls_MultiSelect___onSearchChange(newValue) {

            // Get new value and update stored value
            this._prevSearchValue = this._currentSearchValue;
            this._currentSearchValue = newValue;

            // Update searchbox size
            this.offScreenSearch.innerHTML = newValue;
            var contentWidth = this.offScreenSearch.offsetWidth;
            domStyle.set(this.searchBox, "width", (contentWidth + 20) + "px");

            // Start a new search
            this._debounceNewSearch(newValue);
         },

         /**
          * Handle focus events on this control
          *
          * @instance
          * @protected
          * @param {object} evt Dojo-normalised event object
          */
         _onSearchFocus: function alfresco_forms_controls_MultiSelect___onSearchFocus(evt) {
            /*jshint unused:false*/
            domClass.add(this.domNode, this.rootClass + "--focused");
            this._showResults();
         },

         /**
          * Handle keypress events on the search box
          *
          * @instance
          * @protected
          * @param {object} evt Dojo-normalised event object
          */
         _onSearchKeypress: function alfresco_forms_controls_MultiSelect___onSearchKeypress(evt) {
            switch (evt.charOrCode) {
               case keys.ESCAPE:
                  this._resetSearchBox();
                  this._hideResultsDropdown();
                  break;
               case keys.DOWN_ARROW:
                  this._showResults();
                  break;
               default:
                  // Allow to continue
            }
         },

         /**
          * Handle keyup events on the search box
          *
          * @instance
          * @protected
          * @param {object} evt Dojo-normalised event object
          */
         _onSearchKeyup: function alfresco_forms_controls_MultiSelect___onSearchKeyup(evt) {
            /*jshint unused:false*/
            this._onSearchUpdate();
         },

         /**
          * Handle updates to the search box, which may or may not result in
          * the search value having changed
          *
          * @instance
          * @protected
          */
         _onSearchUpdate: function alfresco_forms_controls_MultiSelect___onSearchUpdate() {
            var trimmedValue = this.searchBox.value.replace(/^\s+|\s+$/g, "");
            if (this._currentSearchValue !== trimmedValue) {
               this._onSearchChange(trimmedValue);
            }
         },

         /**
          * Reset the search box (i.e. empty it)
          *
          * @instance
          * @protected
          */
         _resetSearchBox: function alfresco_forms_controls_MultiSelect___resetSearchBox() {
            this.searchBox.value = "";
         },

         /**
          * Show the error dropdown
          *
          * @instance
          * @protected
          * @param {string} message The error message to be shown
          */
         _showError: function alfresco_forms_controls_MultiSelect___showError(message) {

            // Remove old message and insert new one (safely!)
            while (this.errorItem.hasChildNodes()) {
               this.errorItem.removeChild(this.errorItem.firstChild);
            }
            this.errorItem.appendChild(document.createTextNode(message));

            // Show the error (and hide any loading indicator)
            domClass.add(this.domNode, this.rootClass + "--show-error");
            this._hideLoading();
            this._showResults();
         },

         /**
          * Show the loading dropdown
          *
          * @instance
          * @protected
          */
         _showLoading: function alfresco_forms_controls_MultiSelect___showLoading() {
            domClass.add(this.domNode, this.rootClass + "--show-loading");
            this._hideError();
            this._showResults();
         },

         /**
          * Show the results dropdown
          *
          * @instance
          * @protected
          */
         _showResults: function alfresco_forms_controls_MultiSelect___showResults() {
            domClass.add(this.domNode, this.rootClass + "--show-results");
         },

         /**
          * Start a new search
          *
          * @instance
          * @protected
          * @param    {string} searchString The string to search on
          */
         _startSearch: function alfresco_forms_controls_MultiSelect___startSearch(searchString) {
            /*jshint unused:false*/
            var thisRequestIndex = this._latestSearchRequestIndex = this._latestSearchRequestIndex + 1,
               successHandler = lang.hitch(this, function(response) {
                  if (thisRequestIndex === this._latestSearchRequestIndex) {
                     this._handleSearchSuccess(response);
                  }
               }),
               failureHandler = lang.hitch(this, function(err) {
                  if (thisRequestIndex === this._latestSearchRequestIndex) {
                     this._handleSearchFailure(err);
                  }
               });
            if (searchString) {
               this._showLoading();
               this.alfPublishToPromise().then(successHandler, failureHandler);
            } else {
               this._hideResultsDropdown();
            }
         }
      });
   }
);