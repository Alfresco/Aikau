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
 * @module alfresco/preview/Video
 * @extends module:alfresco/preview/AlfDocumentPreviewPlugin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/preview/AlfDocumentPreviewPlugin", 
        "dojo/_base/lang",
        "dojo/has"], 
        function(declare, AlfDocumentPreviewPlugin, lang, has) {
   
   return declare([AlfDocumentPreviewPlugin], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Video.css"}]
       */
      cssRequirements: [{cssFile:"./css/Video.css"}],

      /**
       *
       * @instance
       * @param {object[]} args
       */
      constructor: function alfresco_preview_Video__constructor(args) {
         lang.mixin(args);
         this.attributes = {
            /**
             * The thumbnail to display, If thumbnail isn't specified, the document's content will be displayed.
             * Will create a url to access node's content. If specified will create url based on the thumbnail definition name.
             *
             */
            src: null,

            /**
             * Specify thumbnail's mimeType if src has been set to a thumbnail.
             * will be "null" by default, and the use the node's content's mimeType.
             *
             */
            srcMimeType: null,

            poster: null,

            posterFileSuffix: null
         };
      },

      /**
       * Tests if the plugin can be used in the users browser.
       *
       * @instance
       * @return {String} Returns nothing if the plugin may be used, otherwise returns a message containing the reason
       *         it cant be used as a string.
       */
      report: function alfresco_preview_Video__report() {
         // Should ideally use a future proof algorithm for testing if the browsers video element can display video of the current mimetype
         if ((has("ie") > 0 && has("ie") < 9) || // IE 9
             (has("ff") > 0 && has("ff") < 1.91) || // FireFox 3.5
             (has("webkit") > 0 &&  has("webkit") < 523.12)) // Safari 3
         {
            // We at least know that the current setups DON'T support the video element
            return this.previewManager.message("label.browserReport", "&lt;video&gt;");
         }
      },

      /**
       * Display the node.
       * TODO: Set max-height of view port and scale based on width, dynamically reset max height as view port changes
       *
       * @instance
       */
      display: function alfresco_preview_Video__display() {
         this.inherited(arguments);
         this._setPreviewerElementHeight();

         var src = this.attributes.src ? this.previewManager.getThumbnailUrl(this.attributes.src) : this.previewManager.getContentUrl(),
            mimeType = this.attributes.srcMimeType ? this.attributes.srcMimeType : this.previewManager.mimeType;
         var str = '';
         str += '<video controls alt="' + this.previewManager.name  + '" title="' + this.previewManager.name  + '">';
         str += '   <source src="' + src + '"  type=\'' + mimeType + '\'>';
         str += '</video>';
         return str;
      }
   });
});