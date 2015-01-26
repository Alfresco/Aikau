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
 * @module alfresco/renderers/Size
 * @extends module:alfresco/renderers/Property
 * @mixes module:alfresco/core/FileSizeMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/Property",
        "alfresco/core/FileSizeMixin",
        "dojo/_base/lang"], 
        function(declare, Property, FileSizeMixin, lang) {

   return declare([Property, FileSizeMixin], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Size.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/Size.properties"}],
      
      /**
       * This can be set to override the default size property of 'jsNode.size' that 
       * is typically available when dealing with standard Node data.
       *
       * @instance
       * @type {string}
       * @default "jsNode.size"
       */
      sizeProperty: null,
      
      /**
       * Set up the attributes to be used when rendering the template.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_renderers_Size__postMixInProperties() {
         if (this.currentItem != null)
         {
            if (this.sizeProperty == null)
            {
               this.sizeProperty = "jsNode.size";
            }
            var size = lang.getObject(this.sizeProperty, false, this.currentItem);
            this.renderedValue = this.formatFileSize(size);
         }
         this.renderedValueClass = this.renderedValueClass + " " + this.renderSize;
         if (this.deemphasized === true)
         {
            this.renderedValueClass = this.renderedValueClass + " deemphasized";
         }
      }
   });
});