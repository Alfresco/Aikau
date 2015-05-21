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
 * This module is expected to be used as the [ListRenderer]{@link module:alfresco/lists/views/ListRenderer}
 * for the [HtmlListView]{@link module:alfresco/lists/views/HtmlListView}. It iterates over the supplied list
 * of [items]{@link module:alfresco/lists/views/HtmlListViewRenderer#items} and outputs each one as an HTML
 * li element. This widget is not expected to be included directly in a page model but rather should be referenced
 * programmatically from within other widgets.
 * 
 * @module alfresco/lists/views/HtmlListViewRenderer
 * @extends module:alfresco/lists/views/ListRenderer
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/lists/views/ListRenderer",
        "dojo/text!./templates/HtmlListViewRenderer.html",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct"], 
        function(declare, ListRenderer, template, lang, array, domConstruct) {
   
   return declare([ListRenderer], {

      /**
       * Overides the inherited template.
       *
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * The bullet style to apply to each list item.
       *
       * @instance
       * @type {string}
       * @default "none"
       */
      listStyleType: "none",

      /**
       * Should be set to an array of items to render as HTML li elements.
       *
       * @instance
       * @type {object[]}
       * @default null
       */
      items: null,

      /**
       * Overrides the [inherited function]{@link module:alfresco/lists/views/layouts/_MultiItemRendererMixin#renderData}
       * to iterate over the items that are expected to have been provided by a parent  
       * [HtmlListView]{@link module:alfresco/lists/views/HtmlListView#createListRenderer}.
       * 
       * @instance
       */
      renderData: function alfresco_lists_views_HtmlListViewRenderer__renderData() {
         array.forEach(this.items, function(item) {
            var property = lang.getObject(this.propertyToRender, false, item);
            if (property || property === 0 || property === false)
            {
               domConstruct.create("li", {
                  "class": "alfresco-lists-views-HtmlListView--item",
                  innerHTML: property,
                  style: "list-style-type:" + this.listStyleType
               }, this.domNode, "last");
            }
         }, this);
      }
   });
});