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
 * @module alfresco/renderers/SmallThumbnail
 * @extends module:alfresco/renderers/Thumbnail
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/Thumbnail",
        "service/constants/Default",
        "alfresco/core/FileIconUtils"], 
        function(declare, Thumbnail, AlfConstants, FileIconUtils) {

   return declare([Thumbnail], {
      
      /**
       * Overrides the [inherited attribute]{@link module:alfresco/renderers/Thumbnail#folderImage} to 
       * use the appropriately sized folder image.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.66
       */
      folderImage: "folder-32.png",

      /**
       * Overrides the [inherited attribute]{@link module:alfresco/renderers/Thumbnail#folderImageSize} to 
       * use when mapping folder images to 
       * [folderImageAspectMappings]{@link module:alfresco/renderers/Thumbnails#folderImageAspectMappings}
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.66
       */
      folderImageSize: "32",

      /**
       * Extends the [inherited function]{@link module:alfresco/renderers/Thumbnail#postMixInProperties}
       * to set the standard small thumbnail dimensions.
       * 
       * @instance
       * @since 1.0.40
       */
      postMixInProperties: function alfresco_renderers_SmallThumbnail__postMixInProperties() {
         this.inherited(arguments);
         if (!this.dimensions)
         {
            this.dimensions = {
               w: "40px"
            };
         }
      },

      /**
       * Generates the URL to use as the source of the thumbnail.
       * 
       * @instance
       * @param {string} renditionName
       * @returns {string}
       */
      generateThumbnailUrl: function alfresco_renderers_SmallThumbnail__generateThumbnailUrl(/*jshint unused:false*/renditionName) {
         var url,
             jsNode = this.currentItem.jsNode;
         if (jsNode.isContainer || (jsNode.isLink && jsNode.linkedNode.isContainer))
         {
            url = this.getFolderImage();
            // TODO: DnD
         }
         else
         {
            var fileIcon = FileIconUtils.getFileIconByMimetype(this.currentItem.node.mimetype);
            url = require.toUrl("alfresco/renderers/css/images/filetypes/" + fileIcon);
            // TODO: Preview
         }
         return url;
      }
   });
});