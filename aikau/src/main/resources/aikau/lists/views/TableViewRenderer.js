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
 * @module aikau/lists/views/TableViewRenderer
 * @extends module:alfresco/lists/views/ListRenderer
 * @author Dave Draper
 * @since 1.0.96
 */
define(["dojo/_base/declare",
        "alfresco/lists/views/ListRenderer",
        "alfresco/core/TemporalUtils",
        "dojo/text!./templates/TableViewRenderer.html",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct"], 
        function(declare, ListRenderer, TemporalUtils, template, lang, array, domConstruct) {
   
   return declare([ListRenderer, TemporalUtils], {

      /**
       * Overides the inherited template.
       *
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * Should be set to an array of items to render as HTML li elements.
       *
       * @instance
       * @type {object[]}
       * @default
       */
      items: null,

      /**
       * 
       * @instance
       */
      renderData: function mdl_views_TableViewRenderer__renderData() {
         array.forEach(this.items, function(item) {
            var row = domConstruct.create("tr", {
               "class": "alfresco-experimental-mdl-views-TableView__renderer__item"
            }, this.itemsNode, "last");

            var name = domConstruct.create("td", {
               "class": "mdl-data-table__cell--non-numeric"
            }, row, "last");

            domConstruct.create("i", {
               "class": "material-icons",
               innerHTML: "folder"
            }, name, "last");

             domConstruct.create("span", {
               innerHTML: lang.getObject("displayName", false, item)
            }, name, "last");

            var modifiedDate = lang.getObject("node.properties.cm:modified.iso8601", false, item);
            var relativeDate = this.getRelativeTime(modifiedDate);

            domConstruct.create("td", {
               "class": "mdl-data-table__cell--non-numeric",
               innerHTML: relativeDate
            }, row, "last");
            domConstruct.create("td", {
               "class": "mdl-data-table__cell--non-numeric",
               innerHTML: lang.getObject("node.properties.cm:modifier.displayName", false, item)
            }, row, "last");
         }, this);

         /* global componentHandler */
         componentHandler.upgradeElement(this.domNode);
      },

      onViewShown: function mdl_views_TableViewRenderer__onViewShown() {
         this.inherited(arguments);

         /* global componentHandler */
         componentHandler.upgradeElement(this.domNode);
      }

   });
});