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

// TODO: Add ARIA

/**
 * An input control that allows multiple-selection of defined items
 *
 * @example <caption>Sample configuration:</caption>
 * {
 *    id: "MyMultiSelect",
 *    name: "alfresco/forms/controls/MultiSelectInput",
 *    config: {
 *       label: "My multi-select input",
 *       name: "form_field_name",
 *       width: "400px",
 *       optionsConfig: {
 *          labelAttribute: "name",  // Defaults to label
 *          queryAttribute: "name",  // Defaults to name
 *          valueAttribute: "value", // Defaults to value
 *          publishTopic: "ALF_RETRIEVE_MULTISELECT_INFO",
 *          publishPayload: {
 *             resultsProperty: "response.data.items"
 *          }
 *       }
 *    }
 * }
 *
 * @module alfresco/forms/controls/MultiSelect
 * @extends external:dijit/_TemplatedMixin
 * @extends external:dijit/_WidgetBase
 * @author Martin Doyle
 */
define([
      "alfresco/core/Core",
      "alfresco/core/ObjectTypeUtils",
      "dijit/_FocusMixin",
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
      "dojo/when",
      "dojo/text!./templates/MultiSelect.html"
   ],
   function(Core, ObjectTypeUtils, _FocusMixin, _TemplatedMixin, _WidgetBase, array, declare, lang, Deferred, domConstruct, domStyle, domClass, keys, on, when, template) {

      return declare([_WidgetBase, _TemplatedMixin, _FocusMixin, Core], {

         /**
          * The Choice object (referenced in other JSDoc comments)
          *
          * @instance
          * @typedef {object} Choice
          * @property {object} domNode The main domNode for the choice
          * @property {object} contentNode The content domNode inside the choice
          * @property {object} closeButton The domNode of the close button
          * @property {object} selectListener A remove handle for the choice selection listener
          * @property {object} closeListener A remove handle for the close-button listener
          * @property {object} item The store item
          * @property {string} label The label for this choice
          * @property {string} value The value of this choice
          */

         /**
          * The Result object (referenced in other JSDoc comments)
          *
          * @instance
          * @typedef {object} Result
          * @property {object} domNode The main domNode for the result
          * @property {object} item The store item
          * @property {string} label The label for this choice
          * @property {string} value The value of this choice
          */

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
          * An array of the i18n files to use with this widget.
          *
          * @instance
          * @type {object[]}
          * @default [{i18nFile: "./i18n/MultiSelect.properties"}]
          */
         i18nRequirements: [{
            i18nFile: "./i18n/MultiSelect.properties"
         }],

         /**
          * The localised loading message used by the template
          *
          * @instance
          * @type {string}
          */
         loadingMessage: null,

         /**
          * The root class of this widget
          *
          * @instance
          * @type {string}
          */
         rootClass: "alfresco-forms-controls-MultiSelect",

         /**
          * The HTML template to use for the widget.
          *
          * @override
          * @instance
          * @type {String}
          */
         templateString: template,

         /**
          * The current value of the control
          *
          * @instance
          * @type {object[]}
          */
         value: null,

         /**
          * A cache of the current search value
          *
          * @instance
          * @type {string}
          */
         _currentSearchValue: "",

         /**
          * Listener handles by choice (for removing)
          *
          * @instance
          * @type {object}
          */
         _choiceListeners: null,

         /**
          * Collection of choice objects
          *
          * @instance
          * @type {Choice[]}
          */
         _choices: null,

         /**
          * The currently focused result item
          *
          * @instance
          * @type {Result}
          */
         _focusedResult: null,

         /**
          * Collection of items which are "temporary" and need updating from the store
          * NOTE: It is assumed these items are also in the _storeItems collection,
          *       so their properties can just be updated in-situ
          *
          * @instance
          * @type {object[]}
          */
         _itemsToUpdateFromStore: null,

         /**
          * The index of the latest search request
          *
          * @instance
          * @type {number}
          */
         _latestSearchRequestIndex: 0,

         /**
          * How long a query can run (ms) before a loading message is displayed
          *
          * @instance
          * @type {number}
          */
         _loadingMessageTimeoutMs: 250,

         /**
          * Timeout used to debounce new search requests
          *
          * @instance
          * @type {number}
          */
         _newSearchTimeoutPointer: 0,

         /**
          * Collection of listeners for the results dropdown to help track and
          * remove them when no longer needed
          *
          * @instance
          * @type {object[]}
          */
         _resultListeners: null,

         /**
          * The results
          *
          * @instance
          * @type {Result[]}
          */
         _results: null,

         /**
          * The number of milliseconds to debounce search requests, i.e. the pause
          * needed during typing for a search request to actually kick off
          *
          * @instance
          * @type {number}
          */
         _searchDebounceMs: 100,

         /**
          * The currently selected choice object
          *
          * @instance
          * @type {Choice}
          */
         _selectedChoice: null,

         /**
          * A timeout to ensure the loading message does not display if the results
          * come back super-quick
          *
          * @instance
          * @type {number}
          */
         _showLoadingTimeoutPointer: 0,

         /**
          * A map of retrieved items, by value
          *
          * @instance
          * @type {object}
          */
         _storeItems: null,

         /**
          * The attribute name against which to store the value of an item in the HTML
          *
          * @instance
          * @type {string}
          */
         _valueHtmlAttribute: "data-aikau-value",

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
            this._choices = [];
            this._choiceListeners = {};
            this._itemsToUpdateFromStore = [];
            this._results = [];
            this._resultListeners = [];
            this._storeItems = {};
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
            this.value = [];
         },

         /**
          * Widget instantiated and properties mixed, but not been started
          *
          * @instance
          * @override
          */
         postMixInProperties: function() {
            this.inherited(arguments);
            this.loadingMessage = this.message("multiselect.loading");
         },

         /**
          * Get the value of the control
          *
          * @instance
          * @returns {string[]} The value(s) of the control
          */
         getValue: function alfresco_forms_controls_MultiSelect__getValue() {
            return this.value;
         },

         /**
          * Set the value of the control
          *
          * @instance
          * @param    {string|string[]|object|object[]} newValue The new value(s)
          */
         setValue: function alfresco_forms_controls_MultiSelect__setValue(newValueParam) {

            // Setup helper vars
            var labelAttrName = this.store.labelAttribute,
               valueAttrName = this.store.valueAttribute,
               newValuesArray = newValueParam;
            if (!ObjectTypeUtils.isArray(newValuesArray)) {
               newValuesArray = (newValueParam && [newValueParam]) || [];
            }

            // Create an items array
            var chosenItems = array.map(newValuesArray, function(nextNewValue) {

               // Try and get the value from the existing result items
               var newValueIsString = typeof nextNewValue === "string",
                  realValue = (newValueIsString && nextNewValue) || nextNewValue[valueAttrName],
                  nextItem = this._storeItems[realValue];

               // If we already have the item, return immediately
               if (nextItem) {
                  return nextItem;
               }

               // Use value if object, otherwise add as value property to new object
               if (newValueIsString) {
                  nextItem = {};
                  nextItem[valueAttrName] = realValue;
               } else {
                  nextItem = nextNewValue;
               }

               // Add a temporary label if not present
               if (!nextItem.hasOwnProperty(labelAttrName)) {
                  nextItem[labelAttrName] = nextItem[valueAttrName];
               }

               // Put the new item into the items map
               this._storeItems[realValue] = nextItem;

               // Mark this item as needing updating from the store
               this._itemsToUpdateFromStore.push(nextItem);

               // Pass back the final item
               return nextItem;

            }, this);

            // Add the choices to the control and kick off the label retrieval if necessary
            array.forEach(chosenItems, function(nextItem) {
               var label = nextItem[labelAttrName],
                  value = nextItem[valueAttrName];
               this._addChoice(label, value);
            }, this);
            this._updateItemsFromStore();
            this._updateResultsDropdown();

            // Set the new value
            this._changeAttrValue("value", chosenItems);
         },

         /**
          * Add the specified result item to the choices
          *
          * @instance
          * @param    {string} label The label of the chosen item
          * @param    {string} value The value of the chosen item
          */
         _addChoice: function alfresco_forms_controls_MultiSelect___addChoice(label, value) {

            // Add to the control's value property
            var storeItem = this._storeItems[value];
            this._changeAttrValue("value", this.value.concat(storeItem));

            // Construct and attach the DOM nodes
            var choiceClass = this.rootClass + "__choice",
               choiceNode = domConstruct.create("div", {
                  className: choiceClass
               }, this.searchBox, "before"),
               contentNode = domConstruct.create("span", {
                  className: choiceClass + "__content"
               }, choiceNode),
               closeButton = domConstruct.create("a", {
                  className: choiceClass + "__close-button",
                  innerHTML: "&times;"
               }, choiceNode);

            // Setup the listeners
            var choiceObject = {},
               selectListener = on(choiceNode, "click", lang.hitch(this, this._onChoiceClick, choiceObject)),
               closeListener = on(closeButton, "click", lang.hitch(this, this._onChoiceCloseClick, choiceObject));
            this.own(selectListener, closeListener);
            lang.mixin(choiceObject, {
               domNode: choiceNode,
               contentNode: contentNode,
               closeButton: closeButton,
               selectListener: selectListener,
               closeListener: closeListener,
               item: storeItem,
               label: label,
               value: value
            });
            this._choices.push(choiceObject);

            // Add the label and value
            contentNode.setAttribute(this._valueHtmlAttribute, value);
            contentNode.appendChild(document.createTextNode(label));
         },

         /**
          * Choose the focused item in the results dropdown
          *
          * @instance
          * @returns {boolean} Returns true if item is chosen
          */
         _chooseFocusedItem: function alfresco_forms_controls_MultiSelect___chooseFocusedItem() {

            // If there is no chosen item, do nothing
            var focusedResult = this._focusedResult;
            if (!focusedResult) {
               return false;
            }

            // Add the choice
            this._addChoice(focusedResult.label, focusedResult.value);

            // Update the control
            this._resetSearchBox();
            this._updateResultsDropdown();
            this._hideResultsDropdown();

            // Return true to indicate item was chosen
            return true;
         },

         /**
          * Create a document fragment of a label, highlighted with the current search term
          *
          * @instance
          * @param    {string} label The label
          * @returns  {object} A document fragment of the highlighted label
          */
         _createHighlightedLabel: function alfresco_forms_controls_MultiSelect___createHighlightedLabel(label) {
            var labelParts = label.split(this._currentSearchValue),
               labelFrag = document.createDocumentFragment();
            array.forEach(labelParts, function(labelPart, partIndex) {
               var highlightSpan;
               if (partIndex) {
                  highlightSpan = domConstruct.create("span", {
                     className: this.rootClass + "__result__highlighted-label"
                  }, labelFrag);
                  highlightSpan.appendChild(document.createTextNode(this._currentSearchValue));
               }
               labelFrag.appendChild(document.createTextNode(labelPart));
            }, this);
            return labelFrag;
         },

         /**
          * Do not fire multiple searches needlessly. Debounce the search requests,
          * i.e. wait until the user has paused typing to actually do the search.
          *
          * @instance
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
          */
         _deleteSelectedChoice: function alfresco_forms_controls_MultiSelect___deleteSelectedChoice() {
            on.emit(this._selectedChoice.closeButton, "click", {
               bubbles: true,
               cancelable: true
            });
         },

         /**
          * Deselect all choices
          *
          * @instance
          */
         _deselectAllChoices: function alfresco_forms_controls_MultiSelect___deselectAllChoices() {
            array.forEach(this._choices, function(nextChoice) {
               domClass.remove(nextChoice.domNode, this.rootClass + "__choice--selected");
            }, this);
         },

         /**
          * Empty the results dropdown
          *
          * @instance
          */
         _emptyResults: function alfresco_forms_controls_MultiSelect___emptyResults() {
            var resultListener;
            while ((resultListener = this._resultListeners.pop())) {
               resultListener.remove();
            }
            while (this.resultsDropdown.childNodes.length > 3) {
               this.resultsDropdown.removeChild(this.resultsDropdown.lastChild);
            }
            this._focusedResult = null;
         },

         /**
          * Get the cursor position within the search box
          * NOTE: Uses code derived from http://javascript.nwbox.com/cursor_position
          *
          * @instance
          * @returns  {number} The cursor position (zero-indexed)
          */
         _getCursorPositionWithinTextbox: function alfresco_forms_controls_MultiSelect___getCursorPositionWithinTextbox() {
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
          * Go to the next result in the dropdown, or the first one if none selected (ignores already-chosen items)
          *
          * @instance
          * @param {boolean} reverseCommand If true then go to previous item instead
          */
         _gotoNextResult: function alfresco_forms_controls_MultiSelect___gotoNextResult(reverseCommand) {
            var results = this._results.slice(0), // Clone the array, so we can reverse if necessary
               focusedClass = this.rootClass + "__result--focused",
               alreadyChosenClass = this.rootClass + "__result--already-chosen",
               focusNextResult = false,
               resultToFocus;
            if (reverseCommand) {
               results.reverse();
            }
            array.forEach(results, function(nextResult) {
               if (!resultToFocus) {
                  var resultIsChosen = domClass.contains(nextResult.domNode, alreadyChosenClass),
                     resultIsFocused = this._focusedResult === nextResult,
                     resultIsValid = !resultIsChosen && (!this._focusedResult || focusNextResult);
                  if (resultIsValid) {
                     resultToFocus = nextResult;
                  } else if (resultIsFocused) {
                     focusNextResult = true;
                  }
               }
               domClass.remove(nextResult.domNode, focusedClass);
            }, this);
            if (!resultToFocus && this._focusedResult) {
               resultToFocus = this._focusedResult;
            }
            if (resultToFocus) {
               this._focusedResult = resultToFocus;
               domClass.add(resultToFocus.domNode, focusedClass);
            } else {
               this._focusedResult = null;
            }
         },

         /**
          * Handle failures that occur when calling the search service
          *
          * @instance
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
          * @param    {object} responseItems The response items
          */
         _handleSearchSuccess: function alfresco_forms_controls_MultiSelect___handleSearchSuccess(responseItems) {
            this._hideLoadingMessage();
            this._results = array.map(responseItems, function(nextItem) {
               var label = nextItem[this.store.labelAttribute],
                  value = nextItem[this.store.valueAttribute];
               this._storeItems[value] = nextItem;
               return {
                  domNode: null,
                  item: nextItem,
                  label: label,
                  value: value
               };
            }, this);
            this._updateResultsDropdown();
            if (!responseItems.length) {
               this._showEmptyMessage();
            } else {
               this._gotoNextResult();
            }
            this._showResultsDropdown();
         },

         /**
          * Hide the empty message in the dropdown
          *
          * @instance
          */
         _hideEmptyMessage: function alfresco_forms_controls_MultiSelect___hideEmptyMessage() {
            domClass.remove(this.domNode, this.rootClass + "--show-empty");
         },

         /**
          * Hide the error message in the dropdown
          *
          * @instance
          */
         _hideErrorMessage: function alfresco_forms_controls_MultiSelect___hideError() {
            domClass.remove(this.domNode, this.rootClass + "--show-error");
         },

         /**
          * Hide the loading message in the dropdown
          *
          * @instance
          */
         _hideLoadingMessage: function alfresco_forms_controls_MultiSelect___hideLoading() {
            domClass.remove(this.domNode, this.rootClass + "--show-loading");
            clearTimeout(this._showLoadingTimeoutPointer);
         },

         /**
          * Hide the results dropdown
          *
          * @instance
          */
         _hideResultsDropdown: function alfresco_forms_controls_MultiSelect___hideResults() {
            domClass.remove(this.domNode, this.rootClass + "--show-results");
            this._hideLoadingMessage();
            this._hideErrorMessage();
         },

         /**
          * Handle blur events on the search box
          *
          * @instance
          */
         _onBlur: function alfresco_forms_controls_MultiSelect___onSearchBlur() {
            domClass.remove(this.domNode, this.rootClass + "--focused");
            this._deselectAllChoices();
            this._hideResultsDropdown();
         },

         /**
          * Handle clicks on a choice
          *
          * @instance
          * @param    {object} choiceObject The choice (node) being clicked on
          * @param    {object} evt Dojo-normalised event object
          */
         _onChoiceClick: function alfresco_forms_controls_MultiSelect___onChoiceClick(choiceObject, evt) {
            this._selectChoice(choiceObject.domNode);
            this._unfocusResults();
            evt.preventDefault();
            evt.stopPropagation();
         },

         /**
          * Handle clicks on a choice's close icon
          *
          * @instance
          * @param    {object} choiceToRemove The choice object to remove
          * @param    {object} evt Dojo-normalised event object
          */
         _onChoiceCloseClick: function alfresco_forms_controls_MultiSelect___onChoiceCloseClick(choiceToRemove, evt) {

            // Update the choices collection
            this._choices = array.filter(this._choices, function(nextChoice) {
               return nextChoice.value !== choiceToRemove.value;
            });
            if (this._selectedChoice === choiceToRemove) {
               this._selectedChoice = null;
            }

            // Synchronise the control's value with the choices collection
            var updatedValue = array.map(this._choices, function(nextChoice) {
               return nextChoice.item;
            }, this);
            this._changeAttrValue("value", updatedValue);

            // Remove the node and its listeners
            domConstruct.destroy(choiceToRemove.domNode);
            choiceToRemove.selectListener.remove();
            choiceToRemove.closeListener.remove();

            // Stop the click doing anything else
            evt.preventDefault();
            evt.stopPropagation();

            // Update the results (i.e. adjust the items' chosen states)
            this._updateResultsDropdown();
            this._hideResultsDropdown();
         },

         /**
          * Handle clicks on the control
          *
          * @instance
          * @param    {object} evt Dojo-normalised event object
          */
         _onControlClick: function alfresco_forms_controls_MultiSelect___onControlClick(evt) {
            this._deselectAllChoices();
            if (evt.target !== this.searchBox) {
               this.searchBox.focus();
            }
            if (this._results.length && !this._resultsDropdownIsVisible()) {
               this._showResultsDropdown();
               this._gotoNextResult();
            } else {
               this._startSearch(this.searchBox.value);
            }
         },

         /**
          * Handle focus events on this control
          *
          * @instance
          */
         _onFocus: function alfresco_forms_controls_MultiSelect___onSearchFocus() {
            domClass.add(this.domNode, this.rootClass + "--focused");
            if (this._results.length) {
               this._showResultsDropdown();
               this._gotoNextResult();
            } else {
               this._startSearch(this.searchBox.value);
            }
         },

         /**
          * Handle mousedowns on the result items
          * NOTE: We're using mousedown rather than click to evade problems with the searchBox blur event
          *
          * @instance
          */
         _onResultMousedown: function alfresco_forms_controls_MultiSelect___onResultMousedown() {
            this._chooseFocusedItem();
         },

         /**
          * Handle mouseovers on the result items
          *
          * @instance
          * @param    {object} evt Dojo-normalised event object
          */
         _onResultMouseover: function alfresco_forms_controls_MultiSelect___onResultMouseover(evt) {
            var focusedClass = this.rootClass + "__result--focused",
               alreadyChosenClass = this.rootClass + "__result--already-chosen",
               hoveredResultNode = evt.currentTarget,
               hoveredResultAlreadyChosen = domClass.contains(hoveredResultNode, alreadyChosenClass);
            this._focusedResult = null;
            array.forEach(this._results, function(nextResult) {
               var nextResultIsHovered = nextResult.domNode === hoveredResultNode,
                  doFocus = nextResultIsHovered && !hoveredResultAlreadyChosen;
               if (doFocus) {
                  this._focusedResult = nextResult;
                  domClass.add(nextResult.domNode, focusedClass);
               } else {
                  domClass.remove(nextResult.domNode, focusedClass);
               }
            }, this);
         },

         /**
          * Handle changes to the search box value
          *
          * @instance
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
          * Handle keypress events on the search box
          *
          * @instance
          * @param {object} evt Dojo-normalised event object
          */
         _onSearchKeypress: function alfresco_forms_controls_MultiSelect___onSearchKeypress(evt) {
            /*jshint maxcomplexity:21*/
            var cursorPosBeforeKeypress = this._getCursorPositionWithinTextbox(),
               modifiersPressed = evt.ctrlKey || evt.altKey || evt.shiftKey || evt.metaKey;
            if (!modifiersPressed) {
               switch (evt.charOrCode) {
                  case keys.ESCAPE:
                     this._resetSearchBox();
                     this._hideResultsDropdown();
                     evt.preventDefault();
                     evt.stopPropagation();
                     break;
                  case keys.ENTER:
                     if (this._resultsDropdownIsVisible()) {
                        if (this._chooseFocusedItem()) {
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
                     if (this._selectedChoice) {
                        this._selectChoice(1);
                        evt.preventDefault();
                     }
                     break;
                  case keys.DELETE:
                  case keys.BACKSPACE:
                     if (this._selectedChoice) {
                        this._deleteSelectedChoice();
                        evt.preventDefault();
                     } else if (!cursorPosBeforeKeypress && this._choices.length) {
                        this._selectChoice(-1);
                        this._deleteSelectedChoice();
                     }
                     break;
                  default:
                     // Allow to continue
               }
            }
         },

         /**
          * Handle keyup events on the search box
          *
          * @instance
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
          * @param    {object|number} choiceNodeOrOffset The choice node to select or the adjustment offset from
          *                                              the currently selected one, which must be either 1 or -1.
          *                                              If none is selected, then the start position is to the
          *                                              right of the current choices.
          */
         _selectChoice: function alfresco_forms_controls_MultiSelect___selectChoice(choiceNodeOrOffset) {
            var currentlySelectedChoice = this._selectedChoice,
               selectNextChoice = false,
               choiceToSelect = null,
               choices = this._choices.slice(0); // Clone the array, so we can reverse if necessary
            this._deselectAllChoices();
            if (typeof choiceNodeOrOffset === "object") {
               array.some(choices, function(nextChoice) {
                  if (nextChoice.domNode === choiceNodeOrOffset) {
                     choiceToSelect = nextChoice;
                  }
                  return !!choiceToSelect;
               });
            } else {
               if (!currentlySelectedChoice) {
                  choiceToSelect = choices[choices.length - 1];
               } else {
                  if (choiceNodeOrOffset < 0) {
                     choices.reverse();
                  }
                  array.some(choices, function(nextChoice) {
                     if (currentlySelectedChoice === nextChoice) {
                        selectNextChoice = true;
                     } else if (selectNextChoice) {
                        choiceToSelect = nextChoice;
                     }
                     return !!choiceToSelect;
                  });
                  if (!choiceToSelect && choiceNodeOrOffset < 0) {
                     choiceToSelect = currentlySelectedChoice;
                  }
               }
            }
            if (choiceToSelect) {
               domClass.add(choiceToSelect.domNode, this.rootClass + "__choice--selected");
            }
            this._selectedChoice = choiceToSelect;
            this.searchBox.focus();
         },

         /**
          * Show the empty message in the dropdown
          *
          * @instance
          */
         _showEmptyMessage: function alfresco_forms_controls_MultiSelect___showEmptyMessage() {
            while (this.noResultsMessage.hasChildNodes()) {
               this.noResultsMessage.removeChild(this.noResultsMessage.firstChild);
            }
            var emptyMessage = this.message("multiselect.noresults", this._currentSearchValue);
            this.noResultsMessage.appendChild(document.createTextNode(emptyMessage));
            domClass.add(this.domNode, this.rootClass + "--show-empty");
            this._hideErrorMessage();
            this._hideLoadingMessage();
            this._showResultsDropdown();
         },

         /**
          * Show the error message in the dropdown
          *
          * @instance
          * @param {string} message The error message to be shown
          */
         _showErrorMessage: function alfresco_forms_controls_MultiSelect___showError(message) {

            // Remove old message and insert new one
            while (this.errorMessage.hasChildNodes()) {
               this.errorMessage.removeChild(this.errorMessage.firstChild);
            }
            this.errorMessage.appendChild(document.createTextNode(message));

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
          */
         _showResultsDropdown: function alfresco_forms_controls_MultiSelect___showResults() {
            domClass.add(this.domNode, this.rootClass + "--show-results");
         },

         /**
          * Start a new search
          *
          * @instance
          * @param    {string} searchString The string to search on
          */
         _startSearch: function alfresco_forms_controls_MultiSelect___startSearch(searchString) {

            // Hide existing result items
            this._hideLoadingMessage();
            this._hideErrorMessage();
            this._hideEmptyMessage();

            // Setup handlers and update request "counter"
            var thisRequestIndex = this._latestSearchRequestIndex = this._latestSearchRequestIndex + 1,
               successHandler = lang.hitch(this, function(responseItems) {
                  if (thisRequestIndex === this._latestSearchRequestIndex) {
                     this._handleSearchSuccess(responseItems);
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
          * Update the results list
          *
          * @instance
          */
         _updateResultsDropdown: function alfresco_forms_controls_MultiSelect___updateResultsDropdown() {

            // Remove all existing listeners and reset the focused result
            array.forEach(this._resultListeners, function(nextListener) {
               nextListener.remove();
            });
            this._focusedResult = null;

            // If we have too many current results displaying, remove the excess nodes
            while (this.resultsDropdown.childNodes.length > this._results.length + 3) {
               this.resultsDropdown.removeChild(this.resultsDropdown.lastChild);
            }

            // Update or add as necessary
            array.forEach(this._results, function(nextResult, index) {

               // Setup variables
               var resultIsChosen = array.some(this._choices, function(nextChoice) {
                     return nextChoice.value === nextResult.value;
                  }),
                  itemNode = this.resultsDropdown.childNodes[index + 3],
                  clickListener,
                  mouseoverListener;

               // Construct the item if not already present
               if (!itemNode) {
                  itemNode = domConstruct.create("li", {
                     "className": this.rootClass + "__result"
                  }, this.resultsDropdown);
               }

               // Update the value if necessary
               if (itemNode.getAttribute(this._valueHtmlAttribute) !== nextResult.value) {
                  itemNode.setAttribute(this._valueHtmlAttribute, nextResult.value);
               }

               // Recreate the label
               var newLabel = this._createHighlightedLabel(nextResult.label);
               if (itemNode.innerHTML !== newLabel.outerHTML) {
                  while (itemNode.hasChildNodes()) {
                     itemNode.removeChild(itemNode.firstChild);
                  }
                  itemNode.appendChild(newLabel);
               }

               // Setup event listeners
               clickListener = on(itemNode, "mousedown", lang.hitch(this, this._onResultMousedown));
               mouseoverListener = on(itemNode, "mouseover", lang.hitch(this, this._onResultMouseover));
               this._resultListeners.push(clickListener, mouseoverListener);
               this.own(clickListener, mouseoverListener);

               // Update the domNode in the result item
               nextResult.domNode = itemNode;

               // Mark item as chosen, if appropriate and remove focused indicator
               domClass[resultIsChosen ? "add" : "remove"](itemNode, this.rootClass + "__result--already-chosen");
               domClass.remove(itemNode, this.rootClass + "__result--focused");

            }, this);
         },

         /**
          * Update all of the items in [_itemsToUpdateFromStore]{@link module:alfresco/forms/controls/MultiSelect#_itemsToUpdateFromStore} with info from the store
          *
          * @instance
          */
         _updateItemsFromStore: function alfresco_forms_controls_MultiSelect___updateItemsFromStore() {

            // Make sure we have some that need updating
            if (!this._itemsToUpdateFromStore.length) {
               return;
            }

            // Setup handlers
            var successHandler = lang.hitch(this, function(responseItems) {

                  // Update the result items map
                  array.forEach(responseItems, function(nextItem) {
                     var value = nextItem[this.store.valueAttribute];
                     if (this._storeItems[value]) {
                        lang.mixin(this._storeItems[value], nextItem);
                     } else {
                        this._storeItems[value] = nextItem;
                     }
                  }, this);

                  // Run through the choices, updating their labels
                  array.forEach(this._choices, function(nextChoice) {
                     var contentNode = nextChoice.contentNode,
                        realLabel = nextChoice.item[this.store.labelAttribute];
                     while (contentNode.hasChildNodes()) {
                        contentNode.removeChild(contentNode.firstChild);
                     }
                     contentNode.appendChild(document.createTextNode(realLabel));
                  }, this);

               }),
               failureHandler = lang.hitch(this, function(err) {
                  this.alfLog("error", "Error updating labels from store", err);
               });

            // Make the query
            var queryObj = {};
            queryObj[this.store.queryAttribute] = "";
            when(this.store.query(queryObj), successHandler, failureHandler);
         },

         /**
          * Un-focus all results
          *
          * @instance
          */
         _unfocusResults: function alfresco_forms_controls_MultiSelect___unfocusResults() {
            this._focusedResult = null;
            array.forEach(this._results, function(nextResult) {
               domClass.remove(nextResult.domNode, this.rootClass + "__result--focused");
            }, this);
         }
      });
   }
);