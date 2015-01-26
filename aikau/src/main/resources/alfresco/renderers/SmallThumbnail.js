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
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/SmallThumbnail.css"}]
       */
      cssRequirements: [{cssFile:"./css/SmallThumbnail.css"}],
      
      /**
       * Adds the "small" CSS classes the main DOM node defined in the template
       * @instance
       * @type {string}
       * @default "small"
       */
      customClasses: "small",
      
      /**
       * Generates the URL to use as the source of the thumbnail.
       * 
       * @instance
       * @param {string} renditionName
       * @returns {string}
       */
      generateThumbnailUrl: function alfresco_renderers_SmallThumbnail__generateThumbnailUrl(renditionName) {
         var url,
             jsNode = this.currentItem.jsNode;
         if (jsNode.isContainer || (jsNode.isLink && jsNode.linkedNode.isContainer))
         {
            url = require.toUrl("alfresco/renderers") + "/css/images/filetypes/generic-folder-32.png";
            // TODO: DnD
         }
         else
         {
            var fileIcon = FileIconUtils.getFileIconByMimetype(this.currentItem.node.mimetype);
            url = require.toUrl("alfresco/renderers") + "/css/images/filetypes/" + fileIcon;
            // TODO: Preview
         }
         return url;
      }
   });
});