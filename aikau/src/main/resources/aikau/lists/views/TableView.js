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
 * @module aikau/lists/views/TableView
 * @extends module:aikau/lists/views/ListView
 * @author Dave Draper
 * @since 1.0.96
 */
define(["dojo/_base/declare",
        "aikau/lists/views/ListView",
        "dojo/text!./templates/TableView.html",
        "aikau/lists/views/TableViewRenderer"], 
        function(declare, ListView, template, TableViewRenderer) {

   return declare([ListView], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/TableView.css"}]
       */
      cssRequirements: [{cssFile:"./css/TableView.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * Overrides the [inherited function]{@link module:alfresco/lists/views/AlfListView#createListRenderer}
       * to create an [HtmlListViewRenderer]{@link module:alfresco/lists/views/HtmlListViewRenderer}.
       * 
       * @instance
       * @returns {object} A new [HtmlListViewRenderer]{@link module:alfresco/lists/views/HtmlListViewRenderer}
       */
      createListRenderer: function mdl_views_TableView__createListRenderer() {
         var dlr = new TableViewRenderer({
            items: this.currentData.items
         });
         return dlr;
      },

      /**
       * Override the default selector to match the elements created by the renderer.
       *
       * @instance
       * @type {string}
       * @default
       */
      renderFilterSelectorQuery: "tr.alfresco-experimental-mdl-views-TableView__renderer__item"
   });
});