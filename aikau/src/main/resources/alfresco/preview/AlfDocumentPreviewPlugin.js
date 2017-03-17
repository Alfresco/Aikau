/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * This is the base module should be extended by all plugins for the 
 * [document previewer]{@link module:alfresco/preview/AlfDocumentPreview}. This provides basic 
 * height calculations for the preview (which can be overridden if required). The 
 * [display]{@link module:alfresco/preview/AlfDocumentPreviewPlugin#display} function should be
 * overridden to implement the preview behaviour.
 *
 * @module alfresco/preview/AlfDocumentPreviewPlugin
 * @extends external:dijit/_WidgetBase
 * @mixes module:alfresco/layout/HeightMixin
 * @mixes module:alfresco/core/ResizeMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "alfresco/layout/HeightMixin",
        "alfresco/core/ResizeMixin",
        "alfresco/core/Core",
        "dojo/_base/lang"], 
        function(declare, _Widget, HeightMixin, ResizeMixin, Core, lang) {
   
   return declare([_Widget, HeightMixin, ResizeMixin, Core], {

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
       * If [display]{@link module:alfresco/preview/AlfDocumentPreview#display} returns HTML to be
       * added as the preview then this function will be called after it has been added to the document.
       * This provides an opportunity for the plugin to perform any additional initialisation.
       * 
       * @instance
       * @since 1.0.51
       */
      onMarkupAdded: function alfresco_preview_AlfDocumentPreviewPlugin__onMarkupAdded() {
         // By default don't report anything.
      },

      /**
       * Tests if the plugin can be used in the users browser.
       *
       * @instance
       * @overridable
       */
      report: function alfresco_preview_AlfDocumentPreviewPlugin__report() {
         // By default don't report anything.
      },

      /**
       * By default does nothing.
       *
       * @instance
       * @overridable
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
       * Sets the height of the previewer element using functions provided by calling the 
       * [setHeight function]{@link module:alfresco/layout/HeightMixin#setHeight} provided by the
       * [HeightMixin]{@link module:alfresco/layout/HeightMixin} module.
       *
       * @instance
       */
      _setPreviewerElementHeight: function alfresco_preview_AlfDocumentPreviewPlugin___setPreviewerElementHeight() {
         var pE = this.previewManager.getPreviewerElement();
         this.heightMode = this.previewManager.heightMode;
         this.heightAdjustment = this.previewManager.heightAdjustment || 0;
         this.setHeight(pE);
      }
   });
});