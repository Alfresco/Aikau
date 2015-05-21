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
 * 
 * @module alfresco/lists/views/HtmlListView
 * @extends module:alfresco/lists/views/AlfListView
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/lists/views/AlfListView",
        "dojo/text!./templates/HtmlListView.html",
        "alfresco/lists/views/ListRenderer",
        "dojo/text!./templates/HtmlListViewRenderer.html",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct"], 
        function(declare, AlfListView, template, ListRenderer, rendererTemplate, lang, array, domConstruct) {
   
   var Renderer = declare([ListRenderer], {

      templateString: rendererTemplate,

      renderData: function alfresco_dnd_DragAndDropItems__renderData() {
         array.forEach(this.items, function(item) {
            var property = lang.getObject(this.propertyToRender, false, item);
            if (property || property === 0 || property === false)
            {
               domConstruct.create("li", {
                  "class": "alfresco-lists-views-HtmlListView--item",
                  innerHTML: property
               }, this.domNode, "last");
            }
         }, this);
      }
   });

   return declare([AlfListView], {

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * This is the dot-notation addressed property within each item to render as the value in the list
       * element.
       *
       * @instance
       * @type {string}
       * @default  "displayName"
       */
      propertyToRender: "displayName",

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
         var dlr = new Renderer({
            items: this.currentData.items,
            propertyToRender: this.propertyToRender || "displayName"
         });
         return dlr;
      },

      /**
       * Override the default selector to match the li elements created by the renderer.
       *
       * @instance
       * @type {string}
       * @default "li.alfresco-lists-views-HtmlListView--item"
       */
      renderFilterSelectorQuery: "li.alfresco-lists-views-HtmlListView--item"
   });
});