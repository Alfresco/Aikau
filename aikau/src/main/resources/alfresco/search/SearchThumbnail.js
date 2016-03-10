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
 * Renders a thumbnail specific to search results. This is different from the usual thumbnail
 * in that it renders specific images for items that are neither documents nor folders.
 * 
 * @module alfresco/search/SearchThumbnail
 * @extends module:alfresco/renderers/Thumbnail
 * @mixes module:alfresco/search/SearchThumbnailMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/Thumbnail",
        "alfresco/search/SearchThumbnailMixin"], 
        function(declare, Thumbnail, SearchThumbnailMixin) {

   return declare([Thumbnail, SearchThumbnailMixin], {

      /**
       * Overrides the [inherited default]{@link module:alfresco/renderers/Thumbnail#hasShadow} to
       * set a shadow.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.40
       */
      hasShadow: true,

      /**
       * Overrides the [inherited default]{@link module:alfresco/renderers/Thumbnail#horizontalAlignment} to
       * align the image to the right
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.40
       */
      horizontalAlignment: "RIGHT",

      /**
       * Overrides the inherited value to reference the property provided by the search API
       *
       * @instance
       * @type {string}
       * @default
       */
      lastThumbnailModificationProperty: "lastThumbnailModification"
   });
});