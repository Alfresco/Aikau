/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
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
 * @module alfresco/forms/controls/utilities/ChoiceMixin
 * @author Dave Draper
 * @author Martin Doyle
 * @since 1.0.54
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/on"], 
        function(declare, lang, array, domConstruct, domClass, on) {

   return declare([], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/ChoiceMixin.css"}]
       */
      cssRequirements: [{cssFile:"./css/ChoiceMixin.css"}],

      /**
       * Whether choices' text can wrap
       *
       * @instance
       * @type {boolean}
       * @default
       */
      choiceCanWrap: true,

      /**
       * The maximum width of choices within the control as a CSS string
       *
       * @instance
       * @type {string}
       * @default
       */
      choiceMaxWidth: "100%",

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
       * @type {module:alfresco/forms/controls/MultiSelect#Choice[]}
       */
      _choices: null,

      /**
       * The root class for choice CSS selectors.
       *
       * @instance
       * @type {string}
       * @default
       */
      _rootChoiceClass: "alfresco-forms-controls-utilities-ChoiceMixin",

      /**
       * The currently selected choice object
       *
       * @instance
       * @type {module:alfresco/forms/controls/MultiSelect#Choice}
       */
      _selectedChoice: null,

      /**
       * A map of retrieved items, by value
       *
       * @instance
       * @type {object}
       */
      _storeItems: null,

      /**
       * 
       * @instance
       */
      postCreate: function alfresco_forms_controls_utilities_ChoiceMixin__postCreate() {
         this.inherited(arguments);
         domClass.add(this.getRootClassTargetNode(), this._rootChoiceClass);
         if (!this.choiceCanWrap) {
            domClass.add(this.getRootClassTargetNode(), this._rootChoiceClass + "--choices-nowrap");
         }
            
         this._choices = [];
         this._choiceListeners = {};
         this._storeItems = {};
      },

      /**
       * Called from [_addChoice]{@link module:alfresco/forms/controls/utilities/ChoiceMixin#_addChoice} to return the 
       * DOM element that new choices should be added relative to.
       * 
       * @instance
       * @return {object} The DOM element to add choices relative to
       * @overridable
       */
      getNewChoiceTargetNode: function alfresco_forms_controls_utilities_ChoiceMixin__getNewChoiceTargetNode() {
         return this.domNode;
      },

      /**
       * Called from [_addChoice]{@link module:alfresco/forms/controls/utilities/ChoiceMixin#_addChoice} to return the 
       * position that new choices should be added relative to the 
       * [a target DOM element]{@link module:alfresco/forms/controls/utilities/ChoiceMixin#getNewChoiceTargetNode}
       * 
       * @instance
       * @return {object} The DOM element to add choices relative to
       * @overridable
       */
      getNewChoiceRelativePosition: function alfresco_forms_controls_utilities_ChoiceMixin__getNewChoiceTargetNode() {
         return "last";
      },

      /**
       * Called from [_addChoice]{@link module:alfresco/forms/controls/utilities/ChoiceMixin#_addChoice} to return the 
       * a more detailed value for the supplied value from an associated store. By default this simply returns the 
       * supplied object, but can be overridden to return more complex data.
       * 
       * @instance
       * @return {object} The DOM element to add choices relative to
       * @overridable
       */
      getStoreItem: function alfresco_forms_controls_utilities_ChoiceMixin__getStoreItem(value) {
         return value;
      },

      /**
       * Called from [postCreate]{@link module:alfresco/forms/controls/utilities/ChoiceMixin#postCreate} to return the 
       * DOM element that the [root class]{@link module:alfresco/forms/controls/utilities/ChoiceMixin#_rootChoiceClass}
       * should be applied to.
       * 
       * @instance
       * @return {object} The target DOM element
       * @overridable
       */
      getRootClassTargetNode: function alfresco_forms_controls_utilities_ChoiceMixin__getRootClassTargetNode() {
         return this.domNode;
      },

      /**
       * Add the specified result item to the choices
       *
       * @instance
       * @param {object} item The item to choose
       */
      _addChoice: function alfresco_forms_controls_utilities_ChoiceMixin___addChoice(item) {
         // Get the label and value
         var labelObj = this._getLabel(item);
         var value = this.getItemValue(item);

         // Add to the value property
         var storeItem = this.getStoreItem(value);
         !this.value && (this.value = []);
         this._changeAttrValue("value", this.value.concat(item));

         // Construct and attach the DOM nodes
         var choiceClass = this._rootChoiceClass + "__choice",
             choiceNode = domConstruct.create("div", {
               className: choiceClass,
               style: {
                  maxWidth: this.choiceMaxWidth
               }
            }, this.getNewChoiceTargetNode(), this.getNewChoiceRelativePosition()),
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
            closeListener = on(closeButton, "mousedown", lang.hitch(this, this._onChoiceCloseMouseDown, choiceObject));
         this.own(selectListener, closeListener);
         lang.mixin(choiceObject, {
            domNode: choiceNode,
            contentNode: contentNode,
            closeButton: closeButton,
            selectListener: selectListener,
            closeListener: closeListener,
            item: storeItem,
            value: value
         });
         this._choices.push(choiceObject);

         // Add the label
         contentNode.setAttribute("title", labelObj.full);
         contentNode.appendChild(document.createTextNode(labelObj.choice));
      },

      /**
       * Returns an object based on the supplied item that has attributes for rendering the title and display
       * value of the item. By default both are returned as the supplied item (expected to be a string) however
       * this function can be overridden to return alternative displays for complex items.
       * 
       * @instance
       * @param  {object} item The item to return a label object for
       * @returns {object} An object with 'full' and 'choice' attributes.
       * @overridable
       */
      _getLabel: function alfresco_forms_controls_utilities_ChoiceMixin___getLabel(item) {
         return {
            full: item,
            choice: item
         };
      },


      /**
       * Returns the full value for the supplied item. By default it simply returns the item provided
       * however this function can be overridden by mixing modules to retrieve additional data.
       *
       * @instance
       * @param {object} item The item to return the value for
       * @overridable
       */
      getItemValue: function alfresco_forms_controls_utilities_ChoiceMixin__getItemValue(item) {
         return item;
      },

      /**
       * Delete the currently selected choice
       *
       * @instance
       */
      _deleteSelectedChoice: function alfresco_forms_controls_utilities_ChoiceMixin___deleteSelectedChoice() {
         on.emit(this._selectedChoice.closeButton, "mousedown", {
            bubbles: true,
            cancelable: true
         });
      },

      /**
       * Deselect all choices
       *
       * @instance
       */
      _deselectAllChoices: function alfresco_forms_controls_utilities_ChoiceMixin___deselectAllChoices() {
         array.forEach(this._choices, function(nextChoice) {
            domClass.remove(nextChoice.domNode, this._rootChoiceClass + "__choice--selected");
         }, this);
      },

         /**
       * Handle clicks on a choice
       *
       * @instance
       * @param    {object} choiceObject The choice (node) being clicked on
       * @param    {object} evt The click event object
       * @extendable
       */
      _onChoiceClick: function alfresco_forms_controls_utilities_ChoiceMixin___onChoiceClick(choiceObject, evt) {
         this._selectChoice(choiceObject.domNode);
         this._unfocusResults();
         evt.preventDefault();
         evt.stopPropagation();
      },

      /**
       * Handle clicks on the close button of a choice by [removing the choice]{@link module:alfresco/forms/controls/utilities/ChoiceMixin#_removeChoice}.
       *
       * @instance
       * @param    {object} choiceToRemove The choice object to remove
       * @param    {object} evt The click event object
       * @extendable
       */
      _onChoiceCloseMouseDown: function alfresco_forms_controls_utilities_ChoiceMixin___onChoiceCloseMouseDown(choiceToRemove, evt) {
         this._removeChoice(choiceToRemove);
         evt.preventDefault();
         evt.stopPropagation();
      },

      /**
       * Remove a specific choice value
       *
       * @instance
       * @param    {object} choiceToRemove The choice object to remove
       * @param    {object} evt Dojo-normalised event object
       */
      _removeChoice: function alfresco_forms_controls_MultiSelect___removeChoice(choiceToRemove) {
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
      },

      /**
       * Select the specified choice
       *
       * @instance
       * @param    {object|number} choiceNodeOrOffset The choice node to select or the adjustment offset from
       *                                              the currently selected one, which must be either 1 or -1.
       *                                              If none is selected, then the start position is to the
       *                                              right of the current choices.
       * @overridable
       */
      _selectChoice: function alfresco_forms_controls_MultiSelect___selectChoice(/*jshint unused:false*/ choiceNodeOrOffset) {
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
            domClass.add(choiceToSelect.domNode, this._rootChoiceClass + "__choice--selected");
         }
         this._selectedChoice = choiceToSelect;
      }
   });
});