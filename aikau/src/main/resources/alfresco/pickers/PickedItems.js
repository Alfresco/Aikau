/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * <p>This extends the [abstract document list view]{@link module:alfresco/documentlibrary/views/AlfDocumentListView}
 * to define a widget for rendering items that have been selected from a [picker]{@link module:alfresco/pickers/DocumentListPicker}.
 * The key difference is that this widget does not listen for "bulk" data deliveries but rather renders individual
 * items as they are published. It also provides the ability to remove items from the current selection. The ultimate
 * purpose it to be able to provide a value that is an array of selected items (e.g. for use in a form control).</p>
 *
 * @module alfresco/pickers/PickedItems
 * @extends module:alfresco/documentlibrary/views/AlfDocumentListView
 * @author Dave Draper & David Webster
 */
define(["dojo/_base/declare",
        "alfresco/documentlibrary/views/AlfDocumentListView",
        "dojo/_base/lang",
        "dojo/_base/array"],
   function (declare, AlfDocumentListView, lang, array) {

      return declare([AlfDocumentListView], {

         /**
          * Set the i18n scope so that it's possible to pick up the overridden "no items" message.
          *
          * @instance
          * @type {string}
          * @default "alfresco.pickers.PickedItems"
          */
         i18nScope: "alfresco.pickers.PickedItems",

         /**
          * An array of the i18n files to use with this widget.
          *
          * @instance
          * @type {object[]}
          * @default [{i18nFile: "./i18n/PickedItems.properties"}]
          */
         i18nRequirements: [{i18nFile: "./i18n/PickedItems.properties"}],

         /**
          * If true, forces user to choose a single item only.
          *
          * @instance
          * @type {Boolean}
          * @default false
          */
         singleItemMode: false,

         /**
          * If true, allow zero items to be selected
          *
          * @instance
          * @type {Boolean}
          * @default false
          */
         allowNone: false,

         /**
          * Topic published when picker is valid
          *
          * @instance
          * @type {string}
          * @default "ALF_PICKER_VALID"
          */
         validTopic: "ALF_PICKER_VALID",


         /**
          * Topic published when picker is invalid
          *
          * @instance
          * @type {string}
          * @default "ALF_PICKER_INVALID"
          */
         invalidTopic: "ALF_PICKER_INVALID",

         /**
          * Should picker validity be published globally?
          */
         publishValidityGlobally: true,

         /**
          * Implements the widget life-cycle method to add drag-and-drop upload capabilities to the root DOM node.
          * This allows files to be dragged and dropped from the operating system directly into the browser
          * and uploaded to the location represented by the document list.
          *
          * @instance
          */
         postCreate: function alfresco_pickers_PickedItems__postCreate() {
            // TODO: Change doc load subscription...
            // DOESN'T INHERIT BY DESIGN
            this.removeUploadDragAndDrop(this.domNode);
            // this.setupKeyboardNavigation();

            this.alfSubscribe("ALF_ITEM_SELECTED", lang.hitch(this, "addPickedItem"));
            this.alfSubscribe("ALF_ITEM_REMOVED", lang.hitch(this, "removePickedItem"));
            this.alfSubscribe("ALF_SET_PICKED_ITEMS", lang.hitch(this, this.onSetPickedItems));
            this.alfSubscribe("ALF_ITEM_MOVED_DOWN", lang.hitch(this, this.onReorder, 1));
            this.alfSubscribe("ALF_ITEM_MOVED_UP", lang.hitch(this, this.onReorder, -1));

            // Initialise the data...
            this.currentData = {
               items: (this.value != null) ? this.value : []
            };
            this.renderView();
            this.isValid();
         },

         /**
          * Reset the current Data object.
          */
         clearData: function alfresco_pickers_PickedItems__clearData() {
            // Intentionally overridden to do nothing.
         },

         /**
          * This is the dot-notation path to the attribute in the item that is the unique key. It is used
          * to ensure that duplicate items are not added and also so that items can be removed.
          *
          * @instance
          * @type {string}
          * @default
          */
         itemKey: "nodeRef",

         /**
          * Handles published information about picked items and renders the item in the view.
          *
          * @instance
          * @param {object} payload The details of the item that has been picked
          */
         addPickedItem: function alfresco_pickers_PickedItems__addPickedItem(payload) {
            var keyToAdd = lang.getObject(this.itemKey, false, payload);
            if (keyToAdd == null)
            {
               this.alfLog("warn", "The supplied item does not have a key attribute as expected", payload, this);
            }
            else
            {
               var existingKey = this.findPickedItem(keyToAdd);
               if (existingKey == null)
               {
                  // Should the item to add be the only item selected?
                  if (this.singleItemMode)
                  {
                     this.alfLog("info", "Removing all other selected items", payload, this);
                     array.forEach(this.currentData.items, function(item, index) {
                        this.alfPublish("ALF_ITEM_REMOVED", item);
                     }, this);
                     this.setPickedItems([payload]);
                     this.renderView(false);
                  }
                  else {
                     this.currentData.items.push(payload);
                     array.forEach(this.currentData.items, function(item, index) {
                        item.index = index;
                     });
                     this.renderView(false);
                  }

                  // Publish the data about the items currently selected...
                  this.alfPublish("ALF_ITEMS_SELECTED", {
                     pickedItems: this.currentData.items
                  });
               }
               else
               {
                  this.alfLog("log", "Item is already picked - it will not be added a second time", payload, this);
               }
               this.isValid();
            }
         },

         /**
          * Handles published information about previously picked items that have been removed.
          * It finds the item, removes it from the current data set and then re-renders the data
          *
          * @instance
          * @param {object} payload The details of the item that has been picked
          */
         removePickedItem: function alfresco_pickers_PickedItems__removePickedItem(payload) {
            var keyToRemove = lang.getObject(this.itemKey, false, payload);
            if (keyToRemove == null)
            {
               this.alfLog("warn", "The supplied item does not have a key attribute as expected", payload, this);
            }
            else
            {
               // Filter out the target item...
               this.currentData.items = array.filter(this.currentData.items, function(item, index) {
                  var key = lang.getObject(this.itemKey, false, item);
                  return key != keyToRemove;
               }, this);
               array.forEach(this.currentData.items, function(item, index) {
                  item.index = index;
               });
               this.renderView(false);
               this.alfPublish("ALF_ITEMS_SELECTED", {
                  pickedItems: this.currentData.items
               });
               this.isValid();
            }
         },

         /**
          * This module searches the current data set to try to find an item with the supplied
          * key. The key is matched against the dot-notation path to an attribute located in
          * each object. By default, the key looks for the nodeRef attribute in an item structure
          * that matches data returned for a standard document list.
          *
          * @instance
          * @param {string} targetKey The value to match against a key
          * @returns {object} A matching item or null if one could not be found
          */
         findPickedItem: function alfresco_pickers_PickedItems__findPickedItem(targetKey) {
            var target = null;
            var targetItems = array.filter(this.currentData.items, function(item, index) {
               var key = lang.getObject(this.itemKey, false, item);
               return key == targetKey;
            }, this);

            if (targetItems.length > 0)
            {
               target = targetItems[0];
            }
            return target;
         },

         /**
          * Handles requests to set the picked items via a publication.
          *
          * @instance
          * @param {object} payload
          */
         onSetPickedItems: function alfresco_pickers_PickedItems_setPickedItems(payload) {
            var items = lang.getObject("pickedItems", false, payload);
            if (items != null)
            {
               this.setPickedItems(items);
            }
         },

         /**
          * Sets and renders the supplied items
          *
          * @instance
          * @pararm {object[]} items
          */
         setPickedItems: function alfresco_pickers_PickedItems_setPickedItems(items) {
            if (items != null)
            {
               this.currentData.items = items;
               array.forEach(this.currentData.items, function(item, index) {
                  item.index = index;
               });
            }
            else
            {
               this.alfLog("warn", "No items supplied to 'setPickedItems' function", items, this);
            }
            this.renderView();
            this.isValid();
         },

         /**
          * Re-orders the item in the current data.
          *
          * @instance
          * @param {number} adjustment How to adjust the position, e.g. -1 to move up, 1 to move down
          * @param {object} item The item to move.
          */
         onReorder: function alfresco_pickers_PickedItems__onReorder(adjustment, item) {
            var targetKey = lang.getObject(this.itemKey, false, item);
            if (targetKey != null)
            {
               var targetIndex = null;
               // Use "some" rather than "forEach" to exit loop immediately on match...
               var found = array.some(this.currentData.items, function(currItem, index) {
                  var currKey = lang.getObject(this.itemKey, false, currItem);
                  if (currKey === targetKey)
                  {
                     targetIndex = index;
                  }
                  return currKey === targetKey;
               }, this);
               if (found === true)
               {
                  var updatedIndex = targetIndex + adjustment;
                  if (updatedIndex >= 0 && updatedIndex <= this.currentData.items.length)
                  {
                     this.currentData.items[updatedIndex].index = targetIndex;
                     this.currentData.items[targetIndex].index = updatedIndex;
                     var tmp1 = this.currentData.items[updatedIndex];
                     var tmp2 = this.currentData.items[targetIndex];
                     this.currentData.items[targetIndex] = tmp1;
                     this.currentData.items[updatedIndex] = tmp2;
                     this.renderView(false);
                     this.alfPublish("ALF_ITEMS_SELECTED", {
                        pickedItems: this.currentData.items
                     });
                  }
               }
            }
         },

         /**
          * Called to determine if this control is valid or not & send the appropriate flags if it isn't.
          *
          * @instance
          */
         isValid: function alfresco_pickers_PickedItems_isValid() {
            // This control is valid if there are one or more items selected, or allowNone is true.
            if (this.allowNone || this.currentData.items.length > 0)
            {
               this.alfPublish(this.validTopic, {name: this.id}, this.publishValidityGlobally);
            }
            else
            {
               this.alfPublish(this.invalidTopic, {name: this.id}, this.publishValidityGlobally);
            }
         },


         /**
          * The widgets to be processed to generate each item in the rendered view.
          *
          * @instance
          * @type {object[]}
          * @default null
          */
         widgets: [
            {
               name: "alfresco/documentlibrary/views/layouts/Row",
               config: {
                  widgets: [
                     {
                        name: "alfresco/documentlibrary/views/layouts/Cell",
                        config: {
                           width: "20px",
                           widgets: [
                              {
                                 name: "alfresco/renderers/FileType",
                                 config: {
                                    size: "small",
                                    renderAsLink: false
                                 }
                              }
                           ]
                        }
                     },
                     {
                        name: "alfresco/documentlibrary/views/layouts/Cell",
                        config: {
                           widgets: [
                              {
                                 name: "alfresco/renderers/Property",
                                 config: {
                                    propertyToRender: "node.properties.cm:name",
                                    renderAsLink: false
                                 }
                              }
                           ]
                        }
                     },
                     {
                        name: "alfresco/documentlibrary/views/layouts/Cell",
                        config: {
                           width: "20px",
                           widgets: [
                              {
                                 name: "alfresco/renderers/PublishAction",
                                 config: {
                                    iconClass: "delete-16",
                                    publishTopic: "ALF_ITEM_REMOVED",
                                    publishPayloadType: "CURRENT_ITEM"
                                 }
                              }
                           ]
                        }
                     }
                  ]
               }
            }
         ]
      });
   });