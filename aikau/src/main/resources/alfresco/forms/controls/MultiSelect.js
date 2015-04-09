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
      "dojo/_base/array",
      "dojo/_base/declare",
      "dojo/_base/lang",
      "dojo/Deferred",
      "dojo/dom-construct",
      "dojo/dom-style",
      "dojo/dom-class",
      "dojo/keys",
      "dojo/on",
      "dojo/query",
      "dojo/when",
      "dojo/text!./templates/MultiSelect.html"
   ],
   function(_TemplatedMixin, _WidgetBase, array, declare, lang, Deferred, domConstruct, domStyle, domClass, keys, on, query, when, template) {

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
          * Listener handles by choice (for removing)
          *
          * @type {object}
          */
         _choiceListeners: null,

         /**
          * The index of the latest search request
          *
          * @type {number}
          */
         _latestSearchRequestIndex: 0,

         /**
          * How long a query can run (ms) before a loading message is displayed
          *
          * @type {number}
          */
         _loadingMessageTimeoutMs: 250,

         /**
          * Timeout used to debounce new search requests
          *
          * @type {number}
          */
         _newSearchTimeoutPointer: 0,

         /**
          * A map of retrieved items, by value
          *
          * @type {object}
          */
         _resultItems: null,

         /**
          * Collection of listeners for the results dropdown to help track and
          * remove them when no longer needed
          *
          * @type {object[]}
          */
         _resultListeners: null,

         /**
          * The number of milliseconds to debounce search requests, i.e. the pause
          * needed during typing for a search request to actually kick off
          *
          * @type {number}
          */
         _searchDebounceMs: 100,

         /**
          * A timeout to ensure the loading message does not display if the results
          * come back super-quick
          *
          * @type {number}
          */
         _showLoadingTimeoutPointer: 0,

         /**
          * The attribute name against which to store the value of an item in the HTML
          *
          * @type {string}
          */
         _valueAttribute: "data-aikau-value",

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
            this._choiceListeners = {};
            this._resultItems = {};
            this._resultListeners = [];
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
          * Get the value of the control
          *
          * @instance
          * @returns {string[]} The value(s) of the control
          */
         getValue: function alfresco_forms_controls_MultiSelect__setValue() {
            var currentChoices = this._getChoices(),
               values = array.map(currentChoices, function(nextChoice) {
                  return this._resultItems[nextChoice.value];
               }, this);
            console.debug("getValue returning ", values);
            return values;
         },

         /**
          * Set the value of the control
          *
          * @instance
          * @param    {string[]} newValues The new values
          */
         setValue: function alfresco_forms_controls_MultiSelect__setValue(newValue) {
            /*jshint unused:false,devel:true*/
            console.error("Attempt to call MultiSelect.setValue() but not yet implemented");
         },

         /**
          * Add the specified result item to the choices
          *
          * @instance
          * @protected
          * @param    {object} chosenResultItem The result item to add
          */
         _addChoice: function alfresco_forms_controls_MultiSelect___addChoice(chosenResultItem) {
            var label = chosenResultItem.textContent || chosenResultItem.innerText,
               value = chosenResultItem.getAttribute(this._valueAttribute),
               choiceClass = this.rootClass + "__choice",
               choiceNode = domConstruct.create("div", {
                  className: choiceClass
               }, this.searchBox, "before"),
               contentNode = domConstruct.create("span", {
                  className: choiceClass + "__content"
               }, choiceNode),
               closeButton = domConstruct.create("a", {
                  className: choiceClass + "__close-button",
                  innerHTML: "x"
               }, choiceNode),
               choiceObject = {},
               selectListener = on(choiceNode, "click", lang.hitch(this, this._onChoiceClick, choiceObject)),
               closeListener = on(closeButton, "click", lang.hitch(this, this._onChoiceCloseClick, choiceObject));
            lang.mixin(choiceObject, {
               node: choiceNode,
               selectListener: selectListener,
               closeListener: closeListener
            });
            contentNode.setAttribute(this._valueAttribute, value);
            contentNode.appendChild(document.createTextNode(label));
            this.own(selectListener, closeListener);
         },

         /**
          * Helper function, with an API consistent with being called by array.forEach(), which
          * will add result items to the results dropdown and create associated listeners
          *
          * @instance
          * @protected
          * @param    {object} nextResultItem The next item from the search results
          * @param    {number} itemIndex The index of this item in the results collection
          */
         _addResultItem: function alfresco_forms_controls_MultiSelect___addResultItem(nextResultItem) {
            var label = nextResultItem[this.store.labelAttribute],
               value = nextResultItem[this.store.valueAttribute],
               resultListItem = domConstruct.create("li", {
                  "className": this.rootClass + "__result"
               }, this.resultsDropdown),
               labelParts = label.split(this._currentSearchValue),
               clickListener,
               mouseoverListener;
            this._resultItems[value] = nextResultItem;
            resultListItem.setAttribute(this._valueAttribute, value);
            array.forEach(labelParts, function(labelPart, partIndex) {
               var highlightSpan;
               if (partIndex) {
                  highlightSpan = domConstruct.create("span", {
                     className: this.rootClass + "__result__highlighted-label"
                  }, resultListItem);
                  highlightSpan.appendChild(document.createTextNode(this._currentSearchValue));
               }
               resultListItem.appendChild(document.createTextNode(labelPart));
            }, this);
            clickListener = on(resultListItem, "mousedown", lang.hitch(this, this._onResultMousedown));
            mouseoverListener = on(resultListItem, "mouseover", lang.hitch(this, this._onResultMouseover, resultListItem));
            this._resultListeners.push(clickListener, mouseoverListener);
            this.own(clickListener, mouseoverListener);
         },

         /**
          * Choose the focused item in the results dropdown
          *
          * @instance
          * @protected
          * @returns {boolean} Returns true if item is chosen
          */
         _chooseItem: function alfresco_forms_controls_MultiSelect___chooseItem() {

            // Get the chosen item
            var focusedClass = this.rootClass + "__result--focused",
               alreadyChosenClass = this.rootClass + "__result--already-chosen",
               focusedResultItem;
            array.some(this._getResultItemNodes(), function(nextItem) {
               if (domClass.contains(nextItem, focusedClass) && !domClass.contains(nextItem, alreadyChosenClass)) {
                  focusedResultItem = nextItem;
               }
               return !!focusedResultItem;
            });

            // If there is no chosen item, do nothing
            if (!focusedResultItem) {
               return false;
            }

            // Choose the item and update the control
            this._addChoice(focusedResultItem);
            this._updateChoicesInResultsList();
            this._gotoNextResult();

            // Return true to indicate item was chosen
            return true;
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
            clearTimeout(this._newSearchTimeoutPointer);
            this._newSearchTimeoutPointer = setTimeout(lang.hitch(this, function() {
               this._startSearch(searchString);
            }), this._searchDebounceMs);
         },

         /**
          * Delete the currently selected choice
          *
          * @instance
          * @protected
          */
         _deleteSelectedChoice: function alfresco_forms_controls_MultiSelect___deleteSelectedChoice() {
            var selectedChoice = this._getSelectedChoiceNode(),
               choiceCloseLink = query("." + this.rootClass + "__choice__close-button", selectedChoice)[0];
            on.emit(choiceCloseLink, "click", {
               bubbles: true,
               cancelable: true
            });
         },

         /**
          * Deselect all choices
          *
          * @instance
          * @protected
          */
         _deselectAllChoices: function alfresco_forms_controls_MultiSelect___deselectAllChoices() {
            query("." + this.rootClass + "__choice").forEach(function(nextChoice) {
               domClass.remove(nextChoice, this.rootClass + "__choice--selected");
            }, this);
         },

         /**
          * Empty the results dropdown
          *
          * @instance
          * @protected
          */
         _emptyResults: function alfresco_forms_controls_MultiSelect___emptyResults() {
            var resultListener;
            while ((resultListener = this._resultListeners.pop())) {
               resultListener.remove();
            }
            while (this.errorItem.nextSibling) { // "empty message" item and all preceding will remain
               this.resultsDropdown.removeChild(this.resultsDropdown.lastChild);
            }
         },

         /**
          * Get the choices, as an array of objects with "node", "label" and "value" properties
          *
          * @instance
          * @protected
          * @returns  {object[]} The choices
          */
         _getChoices: function alfresco_forms_controls_MultiSelect___getChoices() {
            var choices = [];
            query(".alfresco-forms-controls-MultiSelect__choice__content").forEach(function(choiceContentNode) {
               choices.push({
                  node: choiceContentNode.parentNode,
                  label: choiceContentNode.textContent || choiceContentNode.innerText,
                  value: choiceContentNode.getAttribute(this._valueAttribute)
               });
            }, this);
            return choices;
         },

         /**
          * Get the cursor position within the search box
          * NOTE: Uses code derived from http://javascript.nwbox.com/cursor_position
          *
          * @instance
          * @protected
          * @returns  {number} The cursor position (zero-indexed)
          */
         _getCursorPosition: function alfresco_forms_controls_MultiSelect___getCursorPosition() {
            var cursorPos = 0,
               range;
            if (this.searchBox.createTextRange) {
               range = document.selection.createRange().duplicate();
               range.moveEnd("character", this.searchBox.value.length);
               if (!range.text) {
                  cursorPos = this.searchBox.value.length;
               } else {
                  cursorPos = this.searchBox.value.lastIndexOf(range.text);
               }
            } else {
               cursorPos = this.searchBox.selectionStart;
            }
            return cursorPos;
         },

         /**
          * Get the currently selected choice (or null if one isn't selected).
          *
          * @instance
          * @protected
          * @returns  {object} The currently selected choice (node)
          */
         _getSelectedChoiceNode: function alfresco_forms_controls_MultiSelect___getSelectedChoice() {
            var selectedChoice = null;
            query("." + this.rootClass + "__choice").some(function(nextChoice) {
               if (domClass.contains(nextChoice, this.rootClass + "__choice--selected")) {
                  selectedChoice = nextChoice;
               }
               return !!selectedChoice;
            }, this);
            return selectedChoice;
         },

         /**
          * Get the result-item nodes as an array (only if the dropdown is open)
          *
          * @instance
          * @protected
          * @returns  {[object]} Item nodes
          */
         _getResultItemNodes: function alfresco_forms_controls_MultiSelect___getResultItemNodes() {
            var itemNodes = [];
            query("." + this.rootClass + "__result", this.domNode).forEach(function(nextItem) {
               itemNodes.push(nextItem);
            });
            return itemNodes;
         },

         /**
          * Go to the next result in the dropdown, or the first one if none selected (ignores already-chosen items)
          *
          * @instance
          * @protected
          * @param {boolean} reverseCommand If true then go to previous item instead
          */
         _gotoNextResult: function alfresco_forms_controls_MultiSelect___gotoNextResult(reverseCommand) {
            var resultItems = this._getResultItemNodes(),
               focusedClass = this.rootClass + "__result--focused",
               alreadyChosenClass = this.rootClass + "__result--already-chosen",
               focusNextItem = false,
               focusedItem,
               itemToGainFocus;
            if (reverseCommand) {
               resultItems.reverse();
            }
            array.some(resultItems, function(nextItem) {
               if (domClass.contains(nextItem, focusedClass) && !domClass.contains(nextItem, alreadyChosenClass)) {
                  focusedItem = nextItem;
               }
               return !!focusedItem;
            });
            resultItems.forEach(function(nextItem) {
               if (!itemToGainFocus) {
                  var itemIsChosen = domClass.contains(nextItem, alreadyChosenClass),
                     itemIsFocused = domClass.contains(nextItem, focusedClass),
                     itemIsValid = !itemIsChosen && (!focusedItem || focusNextItem);
                  if (itemIsValid) {
                     itemToGainFocus = nextItem;
                  } else if (itemIsFocused) {
                     focusNextItem = true;
                  }
               }
               domClass.remove(nextItem, focusedClass);
            });
            if (itemToGainFocus) {
               domClass.add(itemToGainFocus, focusedClass);
            } else if (focusedItem) {
               domClass.add(focusedItem, focusedClass);
            }
         },

         /**
          * Handle failures that occur when calling the search service
          *
          * @instance
          * @protected
          * @param    {object} err The error object
          */
         _handleSearchFailure: function alfresco_forms_controls_MultiSelect___handleSearchFailure(err) {

            // Remove old results
            this._emptyResults();

            // Hide loading and show error
            this._hideLoadingMessage();
            this._showErrorMessage(err.message);

            // Log full error details
            this.alfLog("error", "Error occurred during search: ", err);
         },

         /**
          * Handle the (successful) response from the search service
          *
          * @instance
          * @protected
          * @param    {object} responseItems The response items
          */
         _handleSearchSuccess: function alfresco_forms_controls_MultiSelect___handleSearchSuccess(responseItems) {
            this._hideLoadingMessage();
            this._emptyResults();
            if (!responseItems.length) {
               this._showEmptyMessage();
            } else {
               array.forEach(responseItems, this._addResultItem, this);
               this._updateChoicesInResultsList();
               this._gotoNextResult();
            }
            this._showResultsDropdown();
         },

         /**
          * Hide the empty message in the dropdown
          *
          * @instance
          * @protected
          */
         _hideEmptyMessage: function alfresco_forms_controls_MultiSelect___hideEmptyMessage() {
            domClass.remove(this.domNode, this.rootClass + "--show-empty");
         },

         /**
          * Hide the error message in the dropdown
          *
          * @instance
          * @protected
          */
         _hideErrorMessage: function alfresco_forms_controls_MultiSelect___hideError() {
            domClass.remove(this.domNode, this.rootClass + "--show-error");
         },

         /**
          * Hide the loading message in the dropdown
          *
          * @instance
          * @protected
          */
         _hideLoadingMessage: function alfresco_forms_controls_MultiSelect___hideLoading() {
            domClass.remove(this.domNode, this.rootClass + "--show-loading");
            clearTimeout(this._showLoadingTimeoutPointer);
         },

         /**
          * Hide the results dropdown
          *
          * @instance
          * @protected
          */
         _hideResultsDropdown: function alfresco_forms_controls_MultiSelect___hideResults() {
            domClass.remove(this.domNode, this.rootClass + "--show-results");
            this._hideLoadingMessage();
            this._hideErrorMessage();
         },

         /**
          * Handle clicks on a choice
          *
          * @instance
          * @protected
          * @param    {object} choiceObject The choice (node) being clicked on
          * @param    {object} evt Dojo-normalised event object
          */
         _onChoiceClick: function alfresco_forms_controls_MultiSelect___onChoiceClick(choiceObject, evt) {
            this._selectChoice(choiceObject.node);
            evt.preventDefault();
            evt.stopPropagation();
         },

         /**
          * Handle clicks on a choice's close icon
          *
          * @instance
          * @protected
          * @param    {object} choiceObject Object containing information about the choice ("node", "selectListener" and "closeListener")
          * @param    {object} evt Dojo-normalised event object
          */
         _onChoiceCloseClick: function alfresco_forms_controls_MultiSelect___onChoiceCloseClick(choiceObject, evt) {
            domConstruct.destroy(choiceObject.node);
            choiceObject.selectListener.remove();
            choiceObject.closeListener.remove();
            evt.preventDefault();
            evt.stopPropagation();
            this._updateChoicesInResultsList();
            this.searchBox.focus();
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
            this._deselectAllChoices();
            if (evt.target !== this.searchBox && !controlIsFocused) {
               this.searchBox.focus();
            }
         },

         /**
          * Handle mousedowns on the result items
          * NOTE: We're using mousedown rather than click to evade problems with the searchBox blur event
          *
          * @instance
          * @protected
          */
         _onResultMousedown: function alfresco_forms_controls_MultiSelect___onResultMousedown() {
            this._chooseItem();
         },

         /**
          * Handle mouseovers on the result items
          * NOTE: This will blindly add the focused class to the item, as the already-chosen class
          *       will override it if necessary
          *
          * @instance
          * @protected
          * @param    {object} resultListItem The node in the result list that's being moused-over
          */
         _onResultMouseover: function alfresco_forms_controls_MultiSelect___onResultMouseover(resultListItem) {
            array.forEach(this._getResultItemNodes(), function(nextItemNode) {
               domClass[nextItemNode === resultListItem ? "add" : "remove"](nextItemNode, this.rootClass + "__result--focused");
            }, this);
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

            // Get new value
            this._currentSearchValue = newValue;

            // Update searchBox size
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
            var existingResults = query("." + this.rootClass + "__result", this.domNode);
            if (existingResults.length) {
               this._showResultsDropdown();
               this._gotoNextResult();
            } else {
               this._startSearch(this.searchBox.value);
            }
         },

         /**
          * Handle keypress events on the search box
          *
          * @instance
          * @protected
          * @param {object} evt Dojo-normalised event object
          */
         _onSearchKeypress: function alfresco_forms_controls_MultiSelect___onSearchKeypress(evt) {
            /*jshint maxcomplexity:11*/
            var cursorPosBeforeKeypress = this._getCursorPosition();
            switch (evt.charOrCode) {
               case keys.ESCAPE:
                  this._resetSearchBox();
                  this._hideResultsDropdown();
                  evt.preventDefault();
                  evt.stopPropagation();
                  break;
               case keys.ENTER:
                  if (this._resultsDropdownIsVisible()) {
                     if (this._chooseItem()) {
                        this._resetSearchBox();
                        this._hideResultsDropdown();
                     }
                  }
                  evt.preventDefault();
                  evt.stopPropagation();
                  break;
               case keys.DOWN_ARROW:
                  if (this._resultsDropdownIsVisible()) {
                     this._gotoNextResult();
                  } else {
                     this._showResultsDropdown();
                  }
                  evt.preventDefault();
                  break;
               case keys.UP_ARROW:
                  if (this._resultsDropdownIsVisible()) {
                     this._gotoNextResult(true);
                  }
                  evt.preventDefault();
                  break;
               case keys.LEFT_ARROW:
                  if (!cursorPosBeforeKeypress) {
                     this._selectChoice(-1);
                  }
                  break;
               case keys.RIGHT_ARROW:
                  if (this._getSelectedChoiceNode()) {
                     this._selectChoice(1);
                     evt.preventDefault();
                  }
                  break;
               case keys.DELETE:
               case keys.BACKSPACE:
                  if (this._getSelectedChoiceNode()) {
                     this._deleteSelectedChoice();
                     evt.preventDefault();
                  }
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
            this._currentSearchValue = "";
            this.searchBox.value = "";
         },

         /**
          * Test whether the results dropdown is currently visible
          *
          * @instance
          * @returns  {boolean} The results dropdown's visibility
          */
         _resultsDropdownIsVisible: function alfresco_forms_controls_MultiSelect___resultsDropdownIsVisible() {
            return domClass.contains(this.domNode, this.rootClass + "--show-results");
         },

         /**
          * Select the specified choice
          *
          * @instance
          * @protected
          * @param    {object|number} choiceNodeOrOffset The choice node to select or the adjustment offset from
          *                                              the currently selected one, which must be either 1 or -1.
          *                                              If none is selected, then the start position is to the
          *                                              right of the current choices.
          */
         _selectChoice: function alfresco_forms_controls_MultiSelect___selectChoice(choiceNodeOrOffset) {
            var selectedClass = this.rootClass + "__choice--selected",
               currentlySelectedChoiceNode = this._getSelectedChoiceNode(),
               selectNextChoice = false,
               choiceToSelect = null,
               choices;
            this._deselectAllChoices();
            if (typeof choiceNodeOrOffset === "object") { // Node
               domClass.add(choiceNodeOrOffset, selectedClass);
            } else { // Offset
               choices = this._getChoices();
               if (!currentlySelectedChoiceNode) {
                  domClass.add(choices[choices.length - 1].node, selectedClass);
               } else {
                  if (choiceNodeOrOffset < 0) {
                     choices.reverse();
                  }
                  array.some(choices, function(nextChoice) {
                     if (currentlySelectedChoiceNode === nextChoice.node) {
                        selectNextChoice = true;
                     } else if (selectNextChoice) {
                        choiceToSelect = nextChoice;
                     }
                     return !!choiceToSelect;
                  });
                  if (!choiceToSelect && choiceNodeOrOffset < 0) {
                     domClass.add(currentlySelectedChoiceNode, selectedClass);
                  } else if (choiceToSelect) {
                     domClass.add(choiceToSelect.node, selectedClass);
                  }
               }
            }
         },

         /**
          * Show the empty message in the dropdown
          *
          * @instance
          * @protected
          */
         _showEmptyMessage: function alfresco_forms_controls_MultiSelect___showEmptyMessage() {
            while (this.noResultSearchTerm.hasChildNodes()) {
               this.noResultSearchTerm.removeChild(this.noResultSearchTerm.firstChild);
            }
            this.noResultSearchTerm.appendChild(document.createTextNode(this._currentSearchValue));
            domClass.add(this.domNode, this.rootClass + "--show-empty");
            this._hideErrorMessage();
            this._hideLoadingMessage();
            this._showResultsDropdown();
         },

         /**
          * Show the error message in the dropdown
          *
          * @instance
          * @protected
          * @param {string} message The error message to be shown
          */
         _showErrorMessage: function alfresco_forms_controls_MultiSelect___showError(message) {

            // Remove old message and insert new one
            while (this.errorItem.hasChildNodes()) {
               this.errorItem.removeChild(this.errorItem.firstChild);
            }
            this.errorItem.appendChild(document.createTextNode(message));

            // Show the error (and hide any loading indicator)
            domClass.add(this.domNode, this.rootClass + "--show-error");
            this._hideEmptyMessage();
            this._hideLoadingMessage();
            this._showResultsDropdown();
         },

         /**
          * Show the loading message in the dropdown
          *
          * @instance
          * @protected
          */
         _showLoadingMessage: function alfresco_forms_controls_MultiSelect___showLoading() {
            domClass.add(this.domNode, this.rootClass + "--show-loading");
            this._hideEmptyMessage();
            this._hideErrorMessage();
            this._showResultsDropdown();
         },

         /**
          * Show the results dropdown
          *
          * @instance
          * @protected
          */
         _showResultsDropdown: function alfresco_forms_controls_MultiSelect___showResults() {
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

            // Hide existing result items
            this._hideLoadingMessage();
            this._hideErrorMessage();
            this._hideEmptyMessage();
            this._emptyResults();

            // Setup handlers and update request "counter"
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
               }),
               queryObj = {};

            // Make the query
            queryObj[this.store.queryAttribute] = searchString;
            this._showLoadingTimeoutPointer = setTimeout(lang.hitch(this, this._showLoadingMessage), this._loadingMessageTimeoutMs);
            when(this.store.query(queryObj), successHandler, failureHandler);
         },

         /**
          * Update the results list, specifically to update the choices within it
          *
          * @instance
          * @protected
          */
         _updateChoicesInResultsList: function alfresco_forms_controls_MultiSelect___updateChoicesInResultsList() {
            var resultItemNodes = this._getResultItemNodes(),
               choices = this._getChoices();
            array.forEach(resultItemNodes, function(nextResultItem) {
               var resultLabel = nextResultItem.textContent || nextResultItem.innerText,
                  resultValue = nextResultItem.getAttribute(this._valueAttribute),
                  itemIsChosen = array.some(choices, function(nextChoice) {
                     return (resultLabel === nextChoice.label && resultValue === nextChoice.value);
                  });
               domClass[itemIsChosen ? "add" : "remove"](nextResultItem, this.rootClass + "__result--already-chosen");
            }, this);
         }
      });
   }
);