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
 * @module alfresco/renderers/SearchThumbnail
 * @extends module:alfresco/renderers/Thumbnail
 * @mixes module:alfresco/search/SearchThumbnailMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/Thumbnail",
        "alfresco/search/SearchThumbnailMixin",
        "dojo/dom-class"], 
        function(declare, Thumbnail, SearchThumbnailMixin, domClass) {

   return declare([Thumbnail, SearchThumbnailMixin], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Thumbnail.css"}]
       */
      cssRequirements: [{cssFile:"./css/SearchThumbnail.css"}],

      /**
       * Overrides the inherited value to reference the property provided by the search API
       *
       * @instance
       * @type {string}
       * @default "lastThumbnailModification"
       */
      lastThumbnailModificationProperty: "lastThumbnailModification",
      
      /**
       * Generates the publication payload by calling the mixed in 
       * [generatePayload]{@link module:alfresco/renderers/_SearchResultLinkMixin#generatePayload}
       * function and then wraps the property in an anchor element by calling the mixed in 
       * [makeAnchor]{@link module:alfresco/navigation/_HtmlAnchorMixin#makeAnchor} function
       *
       * @instance
       */
      postCreate: function alfresco_renderers_SearchThumbnail__postCreate() {
         this.inherited(arguments);
         domClass.add(this.domNode, "alfresco-renderers-SearchThumbnail");
      }
   });
});