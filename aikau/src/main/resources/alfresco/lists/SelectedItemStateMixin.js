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
 * <p>This module can be mixed into widgets that need to maintain the state of any selected items. Item
 * selection is typically actioned by either individual [Selector]{@link module:alfresco/renderers/Selector}
 * widgets in a [list]{@link module:alfresco/lists/AlfList} or by a menu action such as the ones provided by
 * the [AlfSelectDocumentListItems]{@link module:alfresco/documentlibrary/AlfSelectDocumentListItems}.</P>
 * <p>Mixing modules should call the 
 * [createSelectedItemSubscriptions]{@link module:alfresco/lists/SelectedItemStateMixin#createSelectedItemSubscriptions}
 * on creation to keep track of selected items. The can also call the 
 * [publishSelectedItems]{@link module:alfresco/lists/SelectedItemStateMixin#publishSelectedItems} function
 * to broadcast the details of changes to item selection.</p>
 * 
 * @module alfresco/lists/SelectedItemStateMixin
 * @author Dave Draper
 * @since 1.0.39
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/topics",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "dojo/_base/lang"], 
        function( declare, Core, topics, _AlfDocumentListTopicMixin, lang) {
   
   return declare([Core, _AlfDocumentListTopicMixin], {
      
      /**
       * This is used to keep track of the documents that are currently selected. It is initialised to an empty
       * array in the constructor, [onItemSelected]{@link module:alfresco/lists/SelectedItemStateMixin#onItemSelected} 
       * adds elements and the [onItemDeselected]{@link module:alfresco/lists/SelectedItemStateMixin#onItemDeselected} 
       * removes them.
       *
       * @instance
       * @type {object}
       * @default
       */
      currentlySelectedItems: null,

      /**
       * The number of milliseconds to wait after a selection event before publishing the latest selected item
       * data.
       *
       * @instance
       * @type {number}
       * @default
       */
      debounceTime: 50,

      /**
       * Indicates whether or not the the [disable]{@link module:alfresco/lists/SelectedItemStateMixin#disable}
       * function should be called when no items are selected.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      disableWhenNothingSelected: false,

      /**
       * This is the dot-notation addressed property within the selection/de-selection publication payload that
       * uniquely identifies the item.
       *
       * @instance
       * @type {string}
       * @default
       */
      itemKeyProperty: "node.nodeRef",

      /**
       * An array of the [itemKeyProperty]{@link module:alfresco/lists/SelectedItemStateMixin#itemKeyProperty}
       * attributes taken from each entry in the 
       * [currentlySelectedItems]{@link module:alfresco/lists/SelectedItemStateMixin#currentlySelectedItems}
       * map.
       * 
       * @instance
       * @type {string[]}
       * @default
       */
      selectedItems: null,

      /**
       * This is used to keep a reference to a timeout that is started on the publication of a selected document
       * topic. It is important that multiple selection events can be captured so that only one publication of
       * selected items occurs.
       *
       * @instance
       * @type {number}
       * @default
       */
      selectionTimeout: null,

      /**
       * 
       * @instance
       */
      createSelectedItemSubscriptions: function alfresco_lists_SelectedItemStateMixin__createSelectedItemSubscriptions() {
         this.currentlySelectedItems = {};
         this.alfSubscribe(this.documentSelectedTopic, lang.hitch(this, this.onItemSelected));
         this.alfSubscribe(this.documentDeselectedTopic, lang.hitch(this, this.onItemDeselected));
         this.alfSubscribe(topics.CLEAR_SELECTED_ITEMS, lang.hitch(this, this.onItemSelectionCleared));
      },

      /**
       * This is called from [onItemSelected]{@link module:alfresco/lists/SelectedItemStateMixin#onItemSelected}
       * when the [selectionTimeout]{@link module:alfresco/lists/SelectedItemStateMixin#selectionTimeout} times out. It
       * resets the [selectionTimeout]{@link module:alfresco/lists/SelectedItemStateMixin#selectionTimeout} to null and
       * calls [onSelectedItemsChanged]{@link module:alfresco/lists/SelectedItemStateMixin#deselectionTimeout}
       *
       * @instance
       */
      deferredSelectionHandler: function alfresco_lists_SelectedItemStateMixin__deferredSelectionHandler() {
         this.selectedItems = [];
         for (var key in this.currentlySelectedItems)
         {
            if (this.currentlySelectedItems.hasOwnProperty(key)) {
               this.selectedItems.push(this.currentlySelectedItems[key]);
            }
         }
         if (this.disableWhenNothingSelected)
         {
            this.disable(this.selectedItems.length === 0);
         }
         
         this.publishSelectedItems(this.selectedItems);
         this.selectionTimeout = null;
      },

      /**
       * This function is called if 
       * [disableWhenNothingSelected]{@link module:alfresco/lists/SelectedItemStateMixin#disableWhenNothingSelected}
       * is configured to be true and a selection update occurs that results in no items being selected. By
       * default it will attempt to toggle the disable state of the widget.
       *
       * @instance
       * @param {boolean} disable Indicates whether to disable or enable the widget
       * @overridable
       */
      disable: function alfresco_lists_SelectedItemStateMixin__disable(disable) {
         this.set("disabled", disable);
      },

      /**
       * Updates the array of documents that are currently selected.
       *
       * @instance
       * @param {object} payload The details of the item selected
       */
      onItemDeselected: function alfresco_lists_SelectedItemStateMixin__onItemDeselected(payload) {
         if (payload && payload.value)
         {
            var itemKey = lang.getObject(this.itemKeyProperty, false, payload.value);
            if (itemKey)
            {
               delete this.currentlySelectedItems[itemKey];
               if (this.selectionTimeout)
               {
                  clearTimeout(this.selectionTimeout);
               }
               this.selectionTimeout = setTimeout(lang.hitch(this, this.deferredSelectionHandler), this.debounceTime);
            }
            else
            {
               this.alfLog("warn", "Could not find item key property: '" + this.itemKeyProperty + "' in deselected item value", payload, this);
            }
         }
      },

      /**
       * Updates the aray of documents that are currently selected.
       * @instance
       * @param {object} payload The details of the document selected
       */
      onItemSelected: function alfresco_lists_SelectedItemStateMixin__onItemSelected(payload) {
         if (payload && payload.value)
         {
            var itemKey = lang.getObject(this.itemKeyProperty, false, payload.value);
            if (itemKey)
            {
               this.currentlySelectedItems[itemKey] = payload.value;
               if (this.selectionTimeout)
               {
                  clearTimeout(this.selectionTimeout);
               }
               this.selectionTimeout = setTimeout(lang.hitch(this, this.deferredSelectionHandler), 50);
            }
            else
            {
               this.alfLog("warn", "Could not find item key property: '" + this.itemKeyProperty + "' in selected item value", payload, this);
            }
         }
      },

      /**
       * This clears the currently selected items. It it bound to the 
       * [CLEAR_SELECTED_ITEMS topic]{@link module:alfresco/core/topics#CLEAR_SELECTED_ITEMS} that is published
       * by the [AlfSelectedItemsMenuItem]{@link module:alfresco/menus/AlfSelectedItemsMenuItem} when clicked.
       *
       * @instance
       * @param {object} payload This is not expected to contain any usable data.
       */
      onItemSelectionCleared: function alfresco_lists_SelectedItemStateMixin__onItemSelectionCleared(/*jshint unused:false*/ payload) {
         this.currentlySelectedItems = {};
         if (this.selectionTimeout)
         {
            clearTimeout(this.selectionTimeout);
         }
         this.selectionTimeout = setTimeout(lang.hitch(this, this.deferredSelectionHandler), 50);
      },

      /**
       * Tracks the currently selected items and stores them as the 
       * [selectedItems]{@link module:alfresco/lists/SelectedItemStateMixin#selectedItems} variable.
       * 
       * @instance
       * @param  {object} payload A payload expected to contain a "selectedItems" attribute
       */
      onSelectedItemsChange: function alfresco_lists_SelectedItemStateMixin__onSelectedItemsChange(payload) {
         if (payload.selectedItems)
         {
            this.selectedItems = payload.selectedItems;
         }
         else
         {
            this.alfLog("warn", "A publication was made indicating an item selection update, but no 'selectedItems' attribute was provided in the payload", payload, this);
         }
      },

      /**
       * This is called from the [deferredSelectionHandler]{@link module:alfresco/lists/SelectedItemStateMixin#deferredSelectionHandler}
       * function and publishes on the [selectedDocumentsChangeTopic]
       * {@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#selectedDocumentsChangeTopic}.
       *
       * @instance
       */
      publishSelectedItems: function alfresco_lists_SelectedItemStateMixin__publishSelectedItems() {
         this.alfPublish(this.selectedDocumentsChangeTopic, {
            selectedItems: this.selectedItems
         });
         this.alfPublish(this.documentSelectionTopic, {
            selectedItems: this.selectedItems
         });
      }
   });
});