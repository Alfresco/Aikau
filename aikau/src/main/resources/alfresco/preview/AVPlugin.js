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
 * An abstract module for [preview plugins]{@link module:alfresco/preview/AlfDocumentPreviewPlugin} to extend
 * that handles auto-play and auto-pause capabilities.
 *
 * @module alfresco/preview/AVPlugin
 * @extends module:alfresco/preview/AlfDocumentPreviewPlugin
 * @author Dave Draper
 * @since 1.0.51
 */
define(["dojo/_base/declare",
        "alfresco/preview/AlfDocumentPreviewPlugin", 
        "alfresco/core/topics",
        "dojo/_base/lang",
        "dojo/_base/array"], 
        function(declare, AlfDocumentPreviewPlugin, topics, lang, array) {
   
   return declare([AlfDocumentPreviewPlugin], {

      /**
       * Indicates whether or not the AV previewer should automatically play when it is displayed.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      autoPlay: false,

      /**
       * Extends the [inherited function]{@link module:alfresco/preview/AlfDocumentPreviewPlugin#display}
       * to set up a subscription to handle when the plugin is hiden or displayed. 
       *
       * @instance
       * @listens module:alfresco/core/topics#PREVIEWS_SHOWN
       */
      display: function alfresco_preview_AVPlugin__display() {
         this.alfSubscribe(topics.PREVIEWS_SHOWN, lang.hitch(this, this.onPreviewDisplayChange));
         this.inherited(arguments);
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/preview/AlfDocumentPreviewPlugin#onMarkupAdded}
       * to start playing the preview if [autoPlay]{@link module:alfresco/preview/AVPlugin#autoPlay} is true.
       * 
       * @instance
       */
      onMarkupAdded: function alfresco_preview_AlfDocumentPreviewPlugin__onMarkupAdded() {
         this.inherited(arguments);
         if (this.autoPlay)
         {
            this.previewManager.getPreviewerElement().firstChild.play();
         }
      },

      /**
       * Inspects the payload to see if the item represented by this plugin instance is being displayed.
       * If [autoPlay]{@link module:alfresco/preview/AVPlugin#autoPlay} is true then the preview will begin
       * playing when displayed, but it will always stop playing when hidden.
       * 
       * @instance
       * @param  {object} payload The list of items that are currently displayed.
       */
      onPreviewDisplayChange: function alfresco_preview_AVPlugin__onPreviewDisplayChange(payload) {
         var displayed = array.some(payload.items, function(item) {
            return item.nodeRef === this.previewManager.nodeRef;
         }, this);

         if (!displayed)
         {
            this.previewManager.getPreviewerElement().firstChild.pause();
         }
         else if (this.autoPlay)
         {
            this.previewManager.getPreviewerElement().firstChild.play();
         }
      }
   });
});