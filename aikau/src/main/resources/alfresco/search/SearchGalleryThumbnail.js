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
 * @module alfresco/search/SearchGalleryThumbnail
 * @extends module:alfresco/renderers/GalleryThumbnail
 * @mixes module:alfresco/search/SearchThumbnailMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/GalleryThumbnail",
        "alfresco/search/SearchThumbnailMixin",
        "dojo/dom-class"], 
        function(declare, GalleryThumbnail, SearchThumbnailMixin, domClass) {

   return declare([GalleryThumbnail, SearchThumbnailMixin], {

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
       * [generatePayload]{@link module:alfresco/search/SearchThumbnailMixin#generatePayload}
       * function and then wraps the property in an anchor element by calling the mixed in 
       * [makeAnchor]{@link module:alfresco/navigation/_HtmlAnchorMixin#makeAnchor} function
       *
       * @instance
       */
      postCreate: function alfresco_search_SearchGalleryThumbnail__postCreate() {
         this.inherited(arguments);
      }
   });
});