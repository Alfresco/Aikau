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
 * Extends the [AlfMenuBarPopup]{@link module:alfresco/menus/AlfMenuBarPopup} widget to listen to publications
 * that indicate that documents have been selected and disables the menu bar if nothing is selected.
 * 
 * @module alfresco/documentlibrary/AlfSelectedItemsMenuBarPopup
 * @extends module:alfresco/menus/AlfMenuBarPopup
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuBarPopup",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "dojo/_base/lang"], 
        function(declare, AlfMenuBarPopup, _AlfDocumentListTopicMixin, lang) {
   
   return declare([AlfMenuBarPopup, _AlfDocumentListTopicMixin], {
      
      /**
       * Controls whether or not this widget actively tracks the selected items or passively subscribes
       * to topics that indicate the items that have been selected. It is passive by default.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      passive: true,

      /**
       * Overrides the default to initialise as disabled.
       * 
       * @instance
       * @type {boolean}
       * @default true
       */
      disabled: true,
      
      /**
       * This is used to keep track of the documents that are currently selected. It is initialised to an empty
       * array in the constructor, the onItemSelected function adds elements and the onItemDeselected
       * function removes them.
       *
       * @instance
       * @type {object}
       * @default null
       */
      currentlySelectedItems: null,

      /**
       * This is used to keep a reference to a timeout that is started on the publication of a selected document
       * topic. It is important that multiple selection events can be captured so that only one publication of
       * selected items occurs.
       *
       * @instance
       * @type {timeout}
       * @default null
       */
      selectionTimeout: null,

      /**
       * This is the dot-notation addressed property within the selection/de-selection publication payload that
       * uniquely identifies the item.
       *
       * @instance
       * @type {string}
       * @default "nodeRef"
       */
      itemKeyProperty: "nodeRef",

      /**
       * Extends the [superclass function]{@link module:alfresco/menus/AlfMenuBarPopup#postCreate} to subscribe to
       * the [selectedDocumentsChangeTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#selectedDocumentsChangeTopic}
       * topic which is handled by [onFilesSelected]{@link module:alfresco/documentlibrary/AlfSelectedItemsMenuBarPopup#onFilesSelected}.
       * However, when [passive]{@link module:alfresco/documentlibrary/AlfSelectedItemsMenuBarPopup#passive} is configured as false
       * then it subscribes to the topics to track item selection and deselection
       * @instance
       */
      postCreate: function alfresco_documentlibrary_AlfSelectedItemsMenuBarPopup__postCreate() {
         if (this.passive === true)
         {
            this.alfSubscribe(this.selectedDocumentsChangeTopic, lang.hitch(this, this.onFilesSelected));
         }
         else
         {
            this.currentlySelectedItems = {};
            this.alfSubscribe(this.documentSelectedTopic, lang.hitch(this, this.onItemSelected));
            this.alfSubscribe(this.documentDeselectedTopic, lang.hitch(this, this.onItemDeselected));
            this.alfSubscribe("ALF_CLEAR_SELECTED_ITEMS", lang.hitch(this, this.onItemSelectionCleared));
         }
         this.inherited(arguments);
      },

      /**
       * Updates the aray of documents that are currently selected.
       * @instance
       * @param {object} payload The details of the document selected
       */
      onItemSelected: function alfresco_documentlibrary_AlfSelectedItemsMenuBarPopup__onItemSelected(payload) {
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
       * This is called from [onItemSelected]{@link module:alfresco/documentlibrary/AlfSelectedItemsMenuBarPopup#onItemSelected}
       * when the [selectionTimeout]{@link module:alfresco/documentlibrary/AlfSelectedItemsMenuBarPopup#selectionTimeout} times out. It
       * rests the [selectionTimeout]{@link module:alfresco/documentlibrary/AlfSelectedItemsMenuBarPopup#selectionTimeout} to null and
       * calls [onSelectedFilesChanged]{@link module:alfresco/documentlibrary/AlfSelectedItemsMenuBarPopup#deselectionTimeout}
       *
       * @instance
       */
      deferredSelectionHandler: function alfresco_documentlibrary_AlfSelectedItemsMenuBarPopup__deferredSelectionHandler() {
         var selectedItems = [];
         for (var key in this.currentlySelectedItems)
         {
            if (this.currentlySelectedItems.hasOwnProperty(key)) {
               selectedItems.push(this.currentlySelectedItems[key]);
            }
         }
         this.set("disabled", (selectedItems.length === 0));
         this.publishSelectedItems(selectedItems);
         this.selectionTimeout = null;
      },

      /**
       * This is called from the [deferredSelectionHandler]{@link module:alfresco/documentlibrary/AlfSelectedItemsMenuBarPopup#deferredSelectionHandler}
       * function and publishes on the [selectedDocumentsChangeTopic]
       * {@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#selectedDocumentsChangeTopic}.
       *
       * @instance
       */
      publishSelectedItems: function alfresco_documentlibrary_AlfSelectedItemsMenuBarPopup__publishSelectedItems(selectedItems) {
         this.alfPublish(this.selectedDocumentsChangeTopic, {
            selectedItems: selectedItems
         });
      },

      /**
       * Updates the array of documents that are currently selected.
       *
       * @instance
       * @param {object} payload The details of the document selected
       */
      onItemDeselected: function alfresco_documentlibrary_AlfSelectedItemsMenuBarPopup__onItemDeselected(payload) {
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
               this.selectionTimeout = setTimeout(lang.hitch(this, this.deferredSelectionHandler), 50);
            }
            else
            {
               this.alfLog("warn", "Could not find item key property: '" + this.itemKeyProperty + "' in deselected item value", payload, this);
            }
         }
      },

      /**
       * This clears the currently selected items. It it bound to the "ALF_CLEAR_SELECTED_ITEMS" that is published
       * by the [AlfSelectedItemsMenuItem]{@link module:alfresco/menus/AlfSelectedItemsMenuItem} when clicked.
       *
       * @instance
       * @param {object} payload This is not expected to contain any usable data.
       */
      onItemSelectionCleared: function alfresco_documentlibrary_AlfSelectedItemsMenuBarPopup__onItemSelectionCleared(/*jshint unused:false*/ payload) {
         this.currentlySelectedItems = {};
         if (this.selectionTimeout)
         {
            clearTimeout(this.selectionTimeout);
         }
         this.selectionTimeout = setTimeout(lang.hitch(this, this.deferredSelectionHandler), 50);
      },
      
      /**
       * Called when [selectedDocumentsChangeTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#selectedDocumentsChangeTopic} is
       * published on and disables the popup menu if no files have been selected. 
       * 
       * @instance
       * @param {object} payload The details of the selected files.
       */
      onFilesSelected: function alfresco_documentlibrary_AlfSelectedItemsMenuBarPopup__onFilesSelected(payload) {
         this.set("disabled", (payload && payload.selectedFiles && payload.selectedFiles.length === 0));
      }
   });
});