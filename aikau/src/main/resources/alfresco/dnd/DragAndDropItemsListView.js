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
 * This view uses a [DragAndDropItems]{@link module:alfresco/dnd/DragAndDropItems} widget as a data renderer
 * so that drag-and-drop item data can be populated via an [AlfList]{@link module:alfresco/lists/AlfList} or any of its
 * descendants. This then means that the items can be sourced via a service and refreshed as necessary (it even
 * allows for the possibility of paging, sorting and filtering).
 * 
 * @module alfresco/dnd/DragAndDropItemsListView
 * @extends module:alfresco/lists/views/AlfListView
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/lists/views/AlfListView",
        "dojo/text!./templates/DragAndDropItemsListView.html",
        "alfresco/dnd/DragAndDropItems"], 
        function(declare, AlfListView, template, DragAndDropItems) {
   
   return declare([AlfListView], {

      /**
       * @instance
       * @type {boolean}
       * @default false
       */
      dragWithHandles: false,

      /**
       * If this is configured to be true then once an item has been used it will be removed 
       * so that it cannot be used again. If the item is deleted it will be reinstated.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      useItemsOnce: false,

      /**
       * When [items can only be used once]{@link module:alfresco/dnd/DragAndDropItemsListView}
       * this is the dot-notation property to compare deleted items against the configured
       * datalist items [AlfList]{@link module:alfresco/lists/AlfList} to see if a deleted 
       * item should be re-instated.
       *
       * @instance
       * @type {string}
       * @default "name"
       */
      useItemsOnceComparisonKey: "name",

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * Creates a new [ListRenderer]{@link module:alfresco/lists/views/ListRenderer}
       * which is used to render the actual items in the view. This function can be overridden by extending views
       * (such as the [Film Strip View]{@link module:alfresco/documentlibrary/views/AlfFilmStripView}) to create
       * alternative widgets applicable to that view.
       * 
       * @instance
       * @returns {object} A new [ListRenderer]{@link module:alfresco/lists/views/ListRenderer}
       */
      createListRenderer: function alfresco_dnd_DragAndDropItemsListView__createListRenderer() {
         var dlr = new DragAndDropItems({
            items: this.currentData.items,
            immediateRender: false,
            dragWithHandles: this.dragWithHandles,
            useItemsOnce: this.useItemsOnce,
            useItemsOnceComparisonKey: this.useItemsOnceComparisonKey
         });
         return dlr;
      },

      /**
       * Override the default selector to match items in the DND source. This is required because the view
       * doesn't render table rows.
       *
       * @instance
       * @type {string}
       * @default ".alfresco-dnd-DragAndDropItem"
       */
      renderFilterSelectorQuery: ".alfresco-dnd-DragAndDropItem"
   });
});