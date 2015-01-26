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
 * This mixin provides the capability to a widget to iterate over the data that is returned by making
 * a request to the Alfresco Repository for a list of nodes to be displayed in a Document Library. This
 * should be mixed into any widget that will process a JSON model of widgets because it extends the
 * [createWidget]{@link module:alfresco/core/Core#createWidget} function to pass the details of the item
 * that is currently being rendered to all of its processed widgets. It also overrides the default 
 * [allWidgetsProcessed]{@link module:alfresco/core/Core#allWidgetsProcessed} function to make a call
 * to render the next item in the [currentData]{@link module:alfresco/documentlibrary/views/layouts/_MultiItemRendererMixin#currentData}
 * attribute (if applicable).
 * 
 * @module alfresco/documentlibrary/views/layouts/_MultiItemRendererMixin
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/core/ObjectProcessingMixin",
        "alfresco/core/ObjectTypeUtils",
        "alfresco/core/JsNode",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "dojo/dom-class",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/dom-style",
        "dojo/on",
        "dojo/_base/event"], 
        function(declare, CoreWidgetProcessing, ObjectProcessingMixin, ObjectTypeUtils, JsNode, _AlfDocumentListTopicMixin, 
                 domClass, array, lang, domStyle, on, event) {
   
   return declare([CoreWidgetProcessing, ObjectProcessingMixin, _AlfDocumentListTopicMixin], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/_MultiItemRendererMixin.css"}]
       */
      cssRequirements: [{cssFile:"./css/_MultiItemRendererMixin.css"}],
      
      /**
       * This should be set to the data to iterate over. This should be an object that contains
       * an "items" attribute.
       * 
       * @instance
       * @type {Object[]}
       * @default null
       */
      currentData: null,
      
      /**
       * The index of the item in [currentData]{@link module:alfresco/documentlibrary/views/layouts/_MultiItemRendererMixin#currentData}
       * items array that is currently being rendered
       * 
       * @instance
       * @type {number}
       * @default null
       */
      currentIndex: null,
      
      /**
       * The current item being rendered
       * 
       * @instance
       * @type {Object} 
       * @default null
       */
      currentItem: null,
      
      /**
       * A setter for [currentData]{@link module:alfresco/documentlibrary/views/layouts/_MultiItemRendererMixin#currentData}
       * @instance
       * @param {Object} data The data to set
       */
      setData: function alfresco_documentlibrary_views_layout__MultiItemRendererMixin__setData(data) {
         this.currentData = data;
      },

      /**
       * An advanced setter for[currentData]{@link module:alfresco/documentlibrary/views/layouts/_MultiItemRendererMixin#currentData}
       * It intelligently merges the new data to the old data
       *
       * @param {object} newData data to add to the existing data
       */
      augmentData: function alfresco_documentlibrary_views_layout__MultiItemRendererMixin__augmentData(newData) {
         if (!this.currentData)
         {
            // We don't need to worry about combining data if there isn't any already.
            this.alfLog('debug', 'AlfDocumentListView_augmentData called but this.currentData empty, so using setData instead.');
            this.setData(newData);
         }
         else
         {
            // Update the totalRecords field.
            if (this.currentData.totalRecords && newData.totalRecords && newData.startIndex)
            {
               // TODO: This is going to need to be updated to get infinite scroll to work with regular document lists...
               this.currentData.totalRecords = newData.startIndex + newData.totalRecords;
            }

            // It is also necessary to keep the overall number found count up-to-date (with eventual consistency)
            // on searching, this could actually change after the initial data is set.
            // TODO: This will also need updating for regular document lists...
            this.currentData.numberFound = newData.numberFound;

            // Merge Items arrays.
            if (lang.isArray(this.currentData.items) && lang.isArray(newData.items))
            {
               // Store the old length so we know where to start rendering from.
               this.currentData.previousItemCount = this.currentData.items.length;
               this.currentData.items = this.currentData.items.concat(newData.items);
            }
         }
      },

      /**
       * Reset the current Data object.
       * 
       * @instance
       */
      clearData: function alfresco_documentlibrary_views_layout__MultiItemRendererMixin__clearData() {
         this.alfLog('info', 'Clearing currentData.');
         this.currentData = null;
      },

      /**
       * Return the current data object.
       *
       * @instance
       * @returns {Object[]}
       */
      getData: function alfresco_documentlibrary_views_layout__MultiItemRendererMixin__getData() {
         return this.currentData;
      },

      /**
       * This function should be called to iterate over new data.
       * It sets the currentData object and resets the index back to zero. When [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       * function is called it will being set [currentItem]{@link module:alfresco/documentlibrary/views/layouts/_MultiItemRendererMixin#currentItem} 
       * as the first element in the items attribute belonging to [currentData]{@link module:alfresco/documentlibrary/views/layouts/_MultiItemRendererMixin#currentData}
       * 
       * @instance
       */
      renderData: function alfresco_documentlibrary_views_layout__MultiItemRendererMixin__renderData() {
         
         // Ensure that an array is created to hold the root widget subscriptions...
         if (this.rootWidgetSubscriptions == null)
         {
            this.rootWidgetSubscriptions = [];
         }
         // Iterate over any previously created subscriptions for last data set and remove them...
         // It is important that this it carried out to clean up the previous data set. By default
         // the only subscriptions that will be present are those for selecting items, but extending
         // classes could have added additional subscriptions. If the subscriptions aren't cleaned 
         // up properly then destroyed widgets will try to be actioned.
         array.forEach(this.rootWidgetSubscriptions, function(handle, i) {
            if (typeof handle.remove === "function")
            {
               handle.remove();
            }
         });
         
         if (this.currentData && this.currentData.items)
         {
            this.alfLog("log", "Rendering data", this.currentData.items);
            // Set current Index to previousItemCount (so rendering starts at new items)
            this.currentIndex = this.currentData.previousItemCount || 0;
            this.currentItem = this.currentData.items[this.currentIndex];
            
            // Add in the index...
            if (this.currentItem && this.currentItem.index == null)
            {
               this.currentItem.index = this.currentIndex;
            }

            var itemsToRender = (this.currentIndex)? this.currentData.items.slice(this.currentIndex): this.currentData.items;
            
            array.forEach(itemsToRender, lang.hitch(this, this.renderNextItem));
            this.allItemsRendered();
         }
         else
         {
            this.alfLog("warn", "No data to render!");
         }
      },
      
      /**
       * This is the widget that acts as the root of the view. By default this will
       * be instantiated as a [Table]{@link module:alfresco/documentlibrary/views/layoutTable}.
       * 
       * @instance
       * @type {Object} 
       * @default
       */
      rootViewWidget: null,
      
      /**
       * Calls [processWidgets]{@link module:alfresco/core/Core#processWidgets} to instantiate the widgets
       * defined in the JSON model for [currentItem]{@link module:alfresco/documentlibrary/views/layouts/_MultiItemRendererMixin#currentItem}
       * @instance
       */
      renderNextItem: function alfresco_documentlibrary_views_layout__MultiItemRendererMixin__renderNextItem() {
         // Process the widgets defined using the current item as the data to go into those widgets...
         this.alfLog("log", "Rendering item", this.currentData.items[this.currentIndex]);
         
         // Mark the current item with an attribute indicating that it is the last item.
         // This is done for the benefit of renderers that need to know if they are the last item.
         this.currentData.items[this.currentIndex].isLastItem = (this.currentItem.index === this.currentData.items.length -1);

         // Set a width if provided...
         if (this.width != null)
         {
            domStyle.set(this.domNode, "width", this.width);
         }
         
         if (this.containerNode != null)
         {
            // It is necessary to clone the widget definition to prevent them being modified for future iterations...
            // var clonedWidgets = lang.clone(this.widgets);
            // Intentionally switched from lang.clone to native JSON approach to cloning for performance...
            var clonedWidgets = JSON.parse(JSON.stringify(this.widgets));
            this.processWidgets(clonedWidgets, this.containerNode);
         }
         else
         {
            this.alfLog("warn", "There is no 'containerNode' for adding an item to");
         }
      },
      
      /**
       * Records all the widgets that are processed for each item. This differs from the 
       * [_processedWidgets]{@link module:alfresco/core/CoreWidgetProcessing#_processedWidgets}
       * attribute because that captures the widgets processed for the last item (i.e. the 
       * data is replaced on each item iteration)
       *
       * @instance
       * @type {array}
       * @default null
       */
      _renderedItemWidgets: null,

      /**
       * Overrides the default implementation to start the rendering of the next item.
       * 
       * @instance
       * @param {Object[]}
       */
      allWidgetsProcessed: function alfresco_documentlibrary_views_layout__MultiItemRendererMixin__allWidgetsProcessed(widgets) {
         
         // Push the processed widgets for the last item into the array of rendered widgets...
         if (this._renderedItemWidgets == null)
         {
            this._renderedItemWidgets = [];
         }
         this._renderedItemWidgets.push(widgets);

         // Increment the current index and check to see if there are more items to render...
         // Only the root widget(s) will have the currentData object set so we don't start rendering the next item
         // on nested widgets...
         this.currentIndex++;
         if (this.currentData && 
             this.currentData.items &&
             this.currentData.items.length != null)
         {
            array.forEach(widgets, lang.hitch(this, "rootWidgetProcessing"));
            if (this.currentIndex < this.currentData.items.length)
            {
               // Render the next item...
               this.currentItem = this.currentData.items[this.currentIndex];

               // Add in the index...
               if (this.currentItem.index == null)
               {
                  this.currentItem.index = this.currentIndex;
               }
            }
         }
         else
         {
            // TODO: We need to make sure that we're able to stop rendering if another request arrives before we've completed
         }
      },
      
      /**
       * @instance
       */
      allItemsRendered: function alfresco_documentlibrary_views_layout__MultiItemRendererMixin__allItemsRendered() {
         // No action by default.
      },
      
      /**
       * @instance
       * @type {object[]}
       * @default null
       */
      rootWidgetSubscriptions: null,
      
      /**
       * Adds the "alfresco-documentlibrary-views-layout-_MultiItemRendererMixin--item" class to the root DOM node
       * of the widget and additionally subscribes to item selection publications so that additional CSS classes
       * can be added when an item is selected (so that they can be visually indicate selection).
       * 
       * @instance
       * @param {object} widget The widget to add the styling to
       * @param {number} index The index of the widget
       */
      rootWidgetProcessing: function alfresco_documentlibrary_views_layout__MultiItemRendererMixin__rootWidgetProcessing(widget, index) {
         domClass.add(widget.domNode, "alfresco-documentlibrary-views-layout-_MultiItemRendererMixin--item");
         if (this.rootWidgetSubscriptions == null)
         {
            this.rootWidgetSubscriptions = [];
         }

         if (this.supportsItemSelection === true)
         {
            this.rootWidgetSubscriptions.push(this.alfSubscribe(this.documentSelectedTopic, lang.hitch(this, "onItemSelection", widget)));
            this.rootWidgetSubscriptions.push(this.alfSubscribe(this.documentDeselectedTopic, lang.hitch(this, "onItemDeselection", widget)));
         }
      },
      
      /**
       * Adds the "selected" CSS class to the root widget if it has been selected.
       * 
       * @instance
       * @param {object} payload The details of the selected item
       */
      onItemSelection: function alfresco_documentlibrary_views_layout__MultiItemRendererMixin__onItemSelection(widget, payload) {
         if (this.compareItems(widget.currentItem, payload.value))
         {
            domClass.add(widget.domNode, "selected");
         }
      },

      /**
       * Removes the "selected" CSS class to the root widget if it has been de-selected.
       * 
       * @instance
       * @param {object} payload The details of the selected item
       */
      onItemDeselection: function alfresco_documentlibrary_views_layout__MultiItemRendererMixin__onItemDeselection(widget, payload) {
         if (this.compareItems(widget.currentItem, payload.value))
         {
            domClass.remove(widget.domNode, "selected");
         }
      },

      /**
       * This is the property that should be used to compare unique keys when comparing items. This will default
       * to "nodeRef" if not set.
       * 
       * @instance
       * @type {string}
       * @default "nodeRef"
       */
      itemKey: "nodeRef",

      /**
       * Compares the nodeRef attribute of both item arguments. This has been abstracted to a separate function to
       * allow simpler overriding when comparing items. This function is called by the
       * [onItemSelection]{@link module:alfresco/documentlibrary/views/layouts/_MultiItemRendererMixin#onItemSelection}
       * function to determine whether the item currently selected is the item represented by the current widget. 
       * 
       * @instance
       * @param {object} item1 The first item to compare
       * @param {object} item2 The second item to compare
       * @returns {boolean} true if the items are the same and false otherwise.
       */
      compareItems: function alfresco_documentlibrary_views_layout__MultiItemRendererMixin__compareItems(item1, item2) {
         var key1 = lang.getObject(this.itemKey, null, item1);
         var key2 = lang.getObject(this.itemKey, null, item2);
         return (key1 != null && (key1 == key2));
      },
      
      /**
       * Overrides the default implementation of create widget to update the widget configuration with the
       * current item being rendered. This ensures that each widget has access to all the data about that
       * item.
       * 
       * @instance 
       * @param {Object} config The configuration to pass as an instantiation argument to the widget
       * @param {element} domNode The DOM node to attach the widget to
       * @param {function} callback A function to call once the widget has been instantiated
       * @param {Array} callbackArgs An array of arguments to pass to the callback function
       */
      createWidget: function alfresco_documentlibrary_views_layout__MultiItemRendererMixin__createWidget(config, domNode, callback, callbackArgs) {
         // Only create a widget if there is data to create it with
         if (config == null || config.config == null)
         {
            config.config = {};
         }
         if (this.currentItem != null)
         {
            // This checks if the "jsNode" attribute has been created, and if not will make an attempt
            // to create it. This is in place purely for handling node based items, but shouldn't
            // break anything else...
            if (typeof this.currentItem.jsNode === "undefined" && this.currentItem.node != null)
            {
               this.currentItem.jsNode = new JsNode(this.currentItem.node);
            }
            config.config.currentItem = this.currentItem;

            // Pass on any metadata...
            if (this.currentData && this.currentData.metadata)
            {
               config.config.currentMetadata = this.currentData.metadata;
            }
            this.inherited(arguments);
         }
      },

      /**
       * This function has been added to that mixing modules can ensure that they request focus from
       * their respective container. This ensures that focus is given to the correct item and is not
       * just given to the first child in the container when focus returns to it.
       * 
       * @instance
       * @param {object} evt The click event that gave focus.
       */
      onFocusClick: function alfresco_documentlibrary_views_layout__MultiItemRendererMixin__onFocusClick(evt) {
         on.emit(this.domNode, "onItemFocused", {
            bubbles: true,
            cancelable: true,
            item: this
         });
         event.stop(evt);
      }
   });
});