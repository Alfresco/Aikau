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
 * Renders a thumbnail specific to search results. This is different from the usual thumbnail
 * in that it renders specific images for items that are neither documents nor folders.
 * 
 * @module alfresco/search/NoSearchResults
 * @extends module:alfresco/renderers/GalleryThumbnail
 * @mixes module:alfresco/search/SearchThumbnailMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "alfresco/core/Core",
        "dojo/text!./templates/NoSearchResults.html",
        "dojo/_base/array",
        "dojo/dom-construct"], 
        function(declare, _WidgetBase, _TemplatedMixin, AlfCore, template, array, domConstruct) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/FacetFilter.css"}]
       */
      cssRequirements: [{cssFile:"./css/NoSearchResults.css"}],
      
      /**
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * Iterates over the suggestions.
       *
       * @instance
       */
      postCreate: function alfresco_documentlibrary_views_AlfSearchListView_NoSearchResultsTemplate__postCreate() {
         if (this.title != null)
         {
            this.titleNode.innerHTML = this.message(this.title);
         }
         if (this.suggestions != null)
         {
            array.forEach(this.suggestions, function(suggestion, index) {
               domConstruct.create("li", {
                  innerHTML: this.message(suggestion),
                  className: "suggestion"
               }, this.suggestionsNode, "last");
            }, this);
         }
      }
   });
});