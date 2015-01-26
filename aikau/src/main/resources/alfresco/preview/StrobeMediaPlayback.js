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
 * This module is currently a BETA.
 * TODO: Document the attribute settings here.
 *
 * @module alfresco/preview/StrobeMediaPlayback
 * @extends module:alfresco/preview/AlfDocumentPreviewPlugin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/preview/AlfDocumentPreviewPlugin", 
        "dojo/_base/lang",
        "service/constants/Default"], 
        function(declare, AlfDocumentPreviewPlugin, lang, AlfConstants) {
   
   return declare([AlfDocumentPreviewPlugin], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/StrobeMediaPlayback.css"}]
       */
      cssRequirements: [{cssFile:"./css/StrobeMediaPlayback.css"}],

      /**
       *
       * @instance
       * @param {object[]} args
       */
      constructor: function alfresco_preview_StrobeMediaPlayback__constructor(args) {
         lang.mixin(args);

         this.attributes = {

            /**
             * Decides if the node's content or one of its thumbnails shall be displayed.
             * Leave it as it is if the node's content shall be used.
             * Set to a custom thumbnail definition name if a node thumbnail shall be displayed instead of the content.
             *
             */
            src: null,

            /**
             * Decides if a poster (an image representing the movie) shall be displayed before the movie is loaded or played.
             * Leave it as it is if no poster shall be used.
             * Set to a thumbnail definition name if the node's thumbnail shall be used.
             *
             * Example value: "imgpreview"
             *
             */
            poster: null,

            /**
             * If a poster is used we must tell StrobeMediaPlayback what type of image it is by appending a file suffix on the url
             * when requesting the poster thumbnail. Must be given if a poster is in use.
             *
             * Example value: ".png"
             *
             */
            posterFileSuffix: null,

            /**
             * Media stream type
             *
             * Possible values: "letterbox", "none", "stretch", "zoom"
             *
             */
            scaleMode: "letterbox",

            /**
             * Looping behaviour
             *
             * Possible values: "true", "false"
             *
             */
            loop: "false",

            /**
             * Automatic playback
             *
             * Possible values: "true", "false"
             *
             */
            autoPlay: "false",

            /**
             * Play button overlay
             *
             *
             * Possible values: "true", "false"
             *
             */
            playButtonOverlay: "true",

            /**
             * Control bar position
             *
             * Possible values: "docked", "floating", "none"
             *
             */
            controlBarMode: "docked",

            /**
             * Control bar visibility
             *
             * Possible values: "true", "false"
             *
             */
            controlBarAutoHide: "true",

            /**
             * Duration of control bar visibility
             *
             * Number of seconds the control bar is displayed after last user action.
             *
             */
            controlBarAutoHideTimeout: "3",

            /**
             * Display buffering indicator
             *
             * Possible values: "true", "false"
             *
             */
            bufferingOverlay: "true",

            /**
             * Muted audio
             *
             * Possible values: "true", "false"
             *
             */
            muted: "false",

            /**
             * Set the volume
             *
             * Possible values: "0" (muted), "0.5" (half muted), "1" (full volume)
             *
             */
            volume: "1",

            /**
             * Set the sound balance
             *
             * Possible values: "-1" (full pan left) to "1" (full pan right). "0" sets both sides to an equal volume.
             *
             */
            audioPan: "0"
         };
      },

      /**
       * Tests if the plugin can be used in the users browser.
       *
       * @instance
       * @return {String} Returns nothing if the plugin may be used, otherwise returns a message containing the reason
       * it cant be used as a string.
       */
      report: function alfresco_preview_StrobeMediaPlayback__report() {
         if (!this.previewManager.hasRequiredFlashPlayer(10, 0, 0))
         {
            return this.previewManager.message("label.noFlash");
         }
      },

      /**
       * Display the node.
       *
       * @instance
       */
      display: function alfresco_preview_StrobeMediaPlayback__display() {
         var ctx = this.resolveUrls();

         // Create flash web preview by using swfobject
         var swfId = "StrobeMediaPlayback_" + this.previewManager.id;
         var so = new YAHOO.deconcept.SWFObject(AlfConstants.URL_CONTEXT + "res/components/preview/StrobeMediaPlayback.swf",
               swfId, "100%", "100%", "9.0.45");
         
         so.addVariable("src", ctx.src);
         if (ctx.poster)
         {
            so.addVariable("poster", ctx.poster);
         }
         so.addVariable("loop", this.attributes.loop);
         so.addVariable("autoPlay", this.attributes.autoPlay);
         so.addVariable("playButtonOverlay", this.attributes.playButtonOverlay);
         so.addVariable("controlBarAutoHide", this.attributes.controlBarAutoHide);
         so.addVariable("scaleMode", this.attributes.scaleMode);
         so.addVariable("controlBarMode", this.attributes.controlBarMode);
         so.addVariable("controlBarAutoHideTimeout", this.attributes.controlBarAutoHideTimeout);
         so.addVariable("bufferingOverlay", this.attributes.bufferingOverlay);
         so.addVariable("muted", this.attributes.muted);
         so.addVariable("volume", this.attributes.volume);
         so.addVariable("audioPan", this.attributes.audioPan);

         so.addParam("allowScriptAccess", "sameDomain");
         so.addParam("allowFullScreen", "true");
         so.addParam("wmode", "transparent");

         // Finally create (or recreate) the flash web preview in the new div
         so.write(this.previewManager.getPreviewerElement());
      },

      /**
       * Helper method to get the urls to use depending on the given attributes.
       *
       * @instance
       * @return {object} An object containing urls.
       */
      resolveUrls: function alfresco_preview_StrobeMediaPlayback__resolveUrls()
      {
         var ctx = {
            src: this.attributes.src ? this.previewManager.getThumbnailUrl(this.attributes.src) : this.previewManager.getContentUrl()
         };
         if (this.attributes.poster && this.attributes.poster.length > 0 && this.attributes.posterFileSuffix)
         {
            ctx.poster = this.previewManager.getThumbnailUrl(this.attributes.poster, this.attributes.posterFileSuffix);
         }
         return ctx;
      }
   });
});