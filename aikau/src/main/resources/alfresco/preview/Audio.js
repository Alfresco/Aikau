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
 * This plugin will render the HTML5 audio element to preview the content of an audio node.
 *
 * @module alfresco/preview/Audio
 * @extends module:alfresco/preview/AVPlugin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/preview/AVPlugin", 
        "dojo/_base/lang",
        "dojo/has"], 
        function(declare, AVPlugin, lang, has) {
   
   return declare([AVPlugin], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Audio.css"}]
       */
      cssRequirements: [{cssFile:"./css/Audio.css"}],

      /**
       *
       * @instance
       * @param {object[]} args
       */
      constructor: function alfresco_preview_Audio__constructor(args) {
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
            srcMimeType: null
         };
      },

      /**
       * Tests if the plugin can be used in the users browser.
       *
       * @instance
       * @return {String} Returns nothing if the plugin may be used, otherwise returns a message containing the reason
       *         it cant be used as a string.
       */
      report: function alfresco_preview_Audio__report() {
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
       *
       * @instance
       */
      display: function alfresco_preview_Audio__display() {
         this.inherited(arguments);
         var src = this.attributes.src ? this.previewManager.getThumbnailUrl(this.attributes.src) : this.previewManager.getContentUrl(),
         mimeType = this.attributes.srcMimeType ? this.attributes.srcMimeType : this.previewManager.mimeType;
         var str = "";
         str += "<audio width=\"100%\" height=\"100%\" controls alt=\"" + this.previewManager.name  + "\" title=\"" + this.previewManager.name  + "\">";
         str += "   <source src=\"" + src + "\"  type=\"" + mimeType + "\">";
         str += "</audio>";
         return str;
      }
   });
});