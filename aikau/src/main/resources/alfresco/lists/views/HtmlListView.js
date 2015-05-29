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
 * This module extends the [base list view]{@link module:alfresco/lists/views/AlfListView} to render a simple
 * HTML list of items. It is intended to be used when only a single 
 * [property]{@link module:alfresco/lists/views/HtmlListView#propertyToRender} from each item in the list needs
 * to be displayed. This view replaces the standard [ListRenderer]{@link module:alfresco/lists/views/ListRenderer}
 * with a [custom list renderer]{@link module:alfresco/lists/views/HtmlListViewRenderer} that iterates over the list
 * of items and renders a single property of each one as an individual bullet. The bullet style can be configured
 * using the [listStyleType]{@link module:alfresco/lists/views/HtmlListView#listStyleType} attributes.
 *
 * @example <caption>Example of using the view within a list:</caption>
 * {
 *   name: "alfresco/lists/AlfList",
 *   config: {
 *     widgets: [
 *       {
 *         name: "alfresco/lists/views/HtmlListView",
 *         config: {
 *           propertyToRender: "node.properties.cm:name",
 *           listStyleType: "square"
 *         }
 *       }
 *     ]
 *   }
 * 
 * @module alfresco/lists/views/HtmlListView
 * @extends module:alfresco/lists/views/AlfListView
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/lists/views/AlfListView",
        "dojo/text!./templates/HtmlListView.html",
        "alfresco/lists/views/HtmlListViewRenderer"], 
        function(declare, AlfListView, template, HtmlListViewRenderer) {

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
       * The bullet style to apply to each list item. These should be set to one of the supported
       * [link-style-type values]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type}.
       *
       * @instance
       * @type {string}
       * @default "none"
       */
      listStyleType: "none",

      /**
       * Overrides the [inherited function]{@link module:alfresco/lists/views/AlfListView#createListRenderer}
       * to create an [HtmlListViewRenderer]{@link module:alfresco/lists/views/HtmlListViewRenderer}.
       * 
       * @instance
       * @returns {object} A new [HtmlListViewRenderer]{@link module:alfresco/lists/views/HtmlListViewRenderer}
       */
      createListRenderer: function alfresco_lists_views_HtmlListView__createListRenderer() {
         var dlr = new HtmlListViewRenderer({
            items: this.currentData.items,
            propertyToRender: this.propertyToRender || "displayName",
            listStyleType: this.listStyleType || "none"
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