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
 * @module alfresco/preview/AlfDocumentPreviewPlugin
 * @extends external:dijit/_WidgetBase
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "alfresco/core/ResizeMixin",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "dojo/dom-style",
        "jquery"], 
        function(declare, _Widget, ResizeMixin, Core, lang, domStyle, $) {
   
   return declare([_Widget, ResizeMixin, Core], {

      /**
       *
       * @instance
       * @param {object[]} args
       */
      constructor: function alfresco_preview_AlfDocumentPreviewPlugin__constructor(args) {
         lang.mixin(args);

         // Ensure that an initial attributes instance variable is defined to avoid
         // errors when the [setAttributes]{@link module:alfresco/preview/AlfDocumentPreviewPlugin#setAttributes}
         // function is called.
         if (!this.attributes)
         {
            this.attributes = {};
         }
      },

      /**
       * Updates the attributes with the values from the [AlfDocumentPreview]{@link module:alfresco/preview/AlfDocumentPreview}
       * instance for the current Node being previewed.
       *
       * @instance
       * @param {object[]} attributes The attributes object to mixin into the default settings.
       */
      setAttributes: function alfresco_preview_AlfDocumentPreviewPlugin__setAttributes(attributes) {
         var clonedAttributes = lang.clone(attributes);
         lang.mixin(this.attributes, clonedAttributes);
      },

      /**
       * Tests if the plugin can be used in the users browser.
       *
       * @instance
       * @return {String} Returns nothing if the plugin may be used, otherwise returns a message containing the reason
       * it cant be used as a string.
       */
      report: function alfresco_preview_AlfDocumentPreviewPlugin__report() {
         // By default don't report anything.
      },

      /**
       * By default does nothing.
       *
       * @instance
       */
      display: function alfresco_preview_AlfDocumentPreviewPlugin__display() {
         this.alfSetupResizeSubscriptions(this.onRecalculatePreviewLayout, this);
      },

      /**
       * Handler for window resize event. This will call [_setPreviewerElementHeight]
       * {@link module:alfresco/preview/AlfDocumentPreviewPlugin#_setPreviewerElementHeight}
       * but can be extended or overridden to perform additional preview layout actions.
       * 
       * @instance
       */
      onRecalculatePreviewLayout: function alfresco_preview_AlfDocumentPreviewPlugin__onRecalculatePreviewLayout() {
         this._setPreviewerElementHeight();
      },

      /**
       * <p>This function attempts to set an appropriate height for the previewer. There are 3 different modes
       * of controlling the height which can be set through the "heightMode" configuration of the main
       * [AlfDocumentPreview widget]{@link module:alfresco/preview/AlfDocumentPreview}.</p>
       * <p>"AUTO" will attempt to ensure that the the previewer takes up the complete vertical space in the 
       * client from where it starts. This makes sense to use if you have a single previewer on a page.</p>
       * <p>Any positive number (note: not as a string) will set an explicit height that won't change as the 
       * browser resizes</p>
       * <p>Any negative number will result in that amount being deducted from the browser window height and this
       * will change as the browser is resized. This can be useful for setting the previewer in a dialog.</p>
       *
       * @instance
       */
      _setPreviewerElementHeight: function alfresco_preview_AlfDocumentPreviewPlugin___setPreviewerElementHeight() {
         var previewHeight;
         var pE = this.previewManager.getPreviewerElement();
         var previewerOffset = $(pE).offset();
         var docHeight = $(document).height(),
             clientHeight = $(window).height();

         // Work with either the window or document height depending upon which is smallest...
         var h = (docHeight < clientHeight) ? docHeight : clientHeight;

         var heightMode = this.previewManager.heightMode;
         if (heightMode === "DIALOG")
         {
            previewHeight = $(pE).parentsUntil(".alfresco-dialog-AlfDialog").last().height();
         }
         else if (!heightMode || heightMode === "AUTO" || isNaN(heightMode))
         {
            previewHeight =  h- previewerOffset.top;
         }
         else if (heightMode < 0)
         {
            // If the height mode is a number less than zero, then deduct that height from the available space.
            previewHeight = h + heightMode; // NOTE: Not a mistake, remember adding a negative number substracts! :)
         }
         else
         {
            previewHeight = heightMode;
         }
         domStyle.set(pE, "height", previewHeight + "px");
      }
   });
});