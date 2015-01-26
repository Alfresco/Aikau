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
 * This module is currently a BETA
 *
 * @module alfresco/preview/Image
 * @extends module:alfresco/preview/AlfDocumentPreviewPlugin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/preview/AlfDocumentPreviewPlugin", 
        "dojo/_base/lang"], 
        function(declare, AlfDocumentPreviewPlugin, lang) {
   
   return declare([AlfDocumentPreviewPlugin], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Image.css"}]
       */
      cssRequirements: [{cssFile:"./css/Image.css"}],

      /**
       *
       * @instance
       * @param {object[]} args
       */
      constructor: function alfresco_preview_Image__constructor(args) {
         lang.mixin(args);

         this.attributes = {
            src: null,
            srcMaxSize: "2000000"
         };
      },

      /**
       * Display the node.
       *
       * @instance
       */
      display: function alfresco_preview_Image__display() {
         this.inherited(arguments);
         this._setPreviewerElementHeight();

         var srcMaxSize = this.attributes.srcMaxSize;
         if (!this.attributes.src && srcMaxSize.match(/^\d+$/) && this.previewManager.size > parseInt(srcMaxSize))
         {
            // The node's content was about to be used and its to big to display
            var msg = '';
            msg += this.previewManager.message("Image.tooLargeFile", this.previewManager.name, Alfresco.util.formatFileSize(this.previewManager.size));
            msg += '<br/>';
            msg += '<a class="theme-color-1" href="' + this.previewManager.getContentUrl(true) + '">';
            msg += this.previewManager.message("Image.downloadLargeFile");
            msg += '</a>';
            msg += '<br/>';
            msg += '<a style="cursor: pointer;" class="theme-color-1" onclick="javascript: this.parentNode.parentNode.innerHTML = \'<img src=' + this.previewManager.getContentUrl(false) + '>\';">';
            msg += this.previewManager.message("Image.viewLargeFile");
            msg += '</a>';
            return '<div class="message">' + msg + '</div>';
         }
         else
         {
            var src = this.attributes.src ? this.previewManager.getThumbnailUrl(this.attributes.src) : this.previewManager.getContentUrl();

            var image = new Image();
            image.onload = function()
            {
               if ('naturalHeight' in this)
               {
                  if (this.naturalHeight + this.naturalWidth === 0)
                  {
                     this.onerror();
                     return;
                  }
               } 
               else if (this.width + this.height === 0)
               {
                  this.onerror();
                  return;
               }
               // At this point, there's no error.
               this.previewManager.previewerNode.innerHTML = '';
               this.previewManager.previewerNode.appendChild(image);
            };
            image.onerror = function()
            {
               //display error
               this.previewManager.previewerNode.innerHTML = '<div class="message">' + 
                  this.previewManager.message("label.noPreview", this.previewManager.getContentUrl(true)) + '</div>';
            };
            image.previewManager = this.previewManager;
            image.src = src;

            return null;
         }
      }
   });
});