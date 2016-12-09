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
 * <p><b>This widget is in the "aikau" package and does not adhere to the backwards compatibility standards
 * of the "alfresco" package. The code in this package is intended to form the basis of the next major release
 * of Aikau and will remain in an unstable state until ready for release. Please evaluate and feedback on this
 * module but do not rely on it in production!</b></p>
 *
 * @module aikau/lists/views/layouts/MultiItemRendererMixin
 * @extends module:alfresco/lists/views/layouts/_MultiItemRendererMixin
 * @author Dave Draper
 * @since 1.0.100
 */
define(["dojo/_base/declare",
        "alfresco/lists/views/layouts/_MultiItemRendererMixin",
        "alfresco/lists/views/RenderAppendixSentinel",
        "dojo/_base/lang",
        "dojo/dom-style"], 
        function(declare, _MultiItemRendererMixin, RenderAppendixSentinel, lang, domStyle) {

   return declare([_MultiItemRendererMixin], {

      renderData: function aikau_lists_views_layout_MultiItemRendererMixin__renderData() {
         var promisedData = new Promise(lang.hitch(this, function(resolve, reject) {
            
            this._renderedItemWidgets = [];

            // Ensure that an array is created to hold the root widget subscriptions...
            if (!this.rootWidgetSubscriptions)
            {
               this.rootWidgetSubscriptions = [];
            }

            // Iterate over any previously created subscriptions for last data set and remove them...
            // It is important that this it carried out to clean up the previous data set. By default
            // the only subscriptions that will be present are those for selecting items, but extending
            // classes could have added additional subscriptions. If the subscriptions aren't cleaned 
            // up properly then destroyed widgets will try to be actioned.
            this.rootWidgetSubscriptions && this.rootWidgetSubscriptions.forEach(function(handle) {
               if (typeof handle.remove === "function")
               {
                  handle.remove();
               }
            });
            
            if (this.currentData && this.currentData.items)
            {
               // Set current Index to previousItemCount (so rendering starts at new items)
               this.currentIndex = this.currentData.previousItemCount || 0;
               this.currentItem = this.currentData.items[this.currentIndex];
               
               // Add in the index...
               if (this.currentItem && typeof this.currentItem.index === "undefined")
               {
                  this.currentItem.index = this.currentIndex;
               }

               var itemsToRender = (this.currentIndex)? this.currentData.items.slice(this.currentIndex): this.currentData.items;
               
               var promisedItems = [];
               itemsToRender.forEach(function(item, index) {
                  var promisedItem = this.renderNextItem(item, index);
                  promisedItem && promisedItems.push(promisedItem);
               }, this);
               
               return Promise.all(promisedItems).then(
                  lang.hitch(this, function(renderedItems) {
                     this._renderedItemWidgets = renderedItems;
                     this.allItemsRendered();
                     resolve(renderedItems);
                  }),
                  lang.hitch(this, function(reason) {
                     reject(reason);
                  }));
            }
            else
            {
               resolve([]);
            }
         }));
         return promisedData;
      },

      /**
       * Calls [processWidgets]{@link module:alfresco/core/Core#processWidgets} to instantiate the widgets
       * defined in the JSON model for [currentItem]{@link module:alfresco/lists/views/layouts/_MultiItemRendererMixin#currentItem}
       * 
       * @instance
       * @param {object} itemToRender The item to render next
       * @param {number} index The index of the item to render within the array of items to be rendered
       */
      renderNextItem: function aikau_lists_views_layout_MultiItemRendererMixin__renderNextItem(itemToRender, index) {
         this.currentItem = itemToRender;
         this.currentIndex = index;
         if (this.currentItem && typeof this.currentItem.index === "undefined")
         {
            this.currentItem.index = index;
         }
         if (!itemToRender)
         {
            return new Promise(function(resolve, reject) {
               reject("Null item to be rendered");
            });
         }
         else if (itemToRender === RenderAppendixSentinel && this.widgetsForAppendix)
         {
            // The current item is a marker to render an "appendix". This is a non-data entry into the list
            // of items to be rendered, the original use case is for some kind of "Add" style control that
            // can be used to create a new entry...
            return this.createChildren({
               widgets: this.widgetsForAppendix,
               targetNode: this.containerNode
            });
         }
         else
         {
            // Process the widgets defined using the current item as the data to go into those widgets...
            // Mark the current item with an attribute indicating that it is the last item.
            // This is done for the benefit of renderers that need to know if they are the last item.
            this.currentData.items[index].isLastItem = (this.currentItem.index === this.currentData.items.length -1);

            // Set a width if provided...
            if (this.width)
            {
               domStyle.set(this.domNode, "width", this.width);
            }
            
            if (this.containerNode)
            {
               // It is necessary to clone the widget definition to prevent them being modified for future iterations...
               // Intentionally switched from lang.clone to native JSON approach to cloning for performance...
               var clonedWidgets = JSON.parse(JSON.stringify(this.widgets));
               return this.createChildren({
                  widgets: clonedWidgets,
                  targetNode: this.containerNode
               })
               .then(lang.hitch(this, function(widgets) {
                  widgets.forEach(this.rootWidgetProcessing, this);
                  this.allWidgetsProcessed(widgets);
                  return widgets;
               }));
            }
            else
            {
               this.alfLog("warn", "There is no 'containerNode' for adding an item to");
            }
         }
      }
   });
});