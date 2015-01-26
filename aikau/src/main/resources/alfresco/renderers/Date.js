/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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
 * @module alfresco/renderers/Date
 * @extends module:alfresco/renderers/Property
 * @mixes module:alfresco/core/TemporalUtils
 * @mixes module:alfresco/core/UrlUtils
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/Property", 
        "alfresco/core/TemporalUtils",
        "alfresco/core/UrlUtils",
        "dojo/_base/lang"], 
        function(declare, Property, TemporalUtils, UrlUtils, lang) {

   return declare([Property, UrlUtils, TemporalUtils], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Date.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/Date.properties"}],
      
      /**
       * This can be set to override the default property to use to get the ISO 8601 
       * modification date which (in dot-notation) will be "jsNode.properties.modified.iso8601".
       * This is the property that is typically available when dealing with standard
       * Node data.
       *
       * @instance
       * @type {string}
       * @default "jsNode.properties.modified.iso8601"
       */
      modifiedDateProperty: null,

      /**
       * This can be set to override the default property to use to get the name of the 
       * modifier which (in dot-notation) will be "jsNode.properties.modifier".
       * This is the property that is typically available when dealing with standard
       * Node data.
       *
       * @instance
       * @type {string}
       * @default "jsNode.properties.modifier"
       */
      modifiedByProperty: null,

      /**
       * Set up the attributes to be used when rendering the template.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_renderers_Date__postMixInProperties() {

         if (this.modifiedDateProperty == null)
         {
            this.modifiedDateProperty = "jsNode.properties.modified.iso8601";
         }
         var modifiedDate = lang.getObject(this.modifiedDateProperty, false, this.currentItem);
         
         if (this.modifiedByProperty == null)
         {
            this.modifiedByProperty = "jsNode.properties.modifier.displayName";
         }
         var modifiedBy = lang.getObject(this.modifiedByProperty, false, this.currentItem);

         var dateI18N = "details.modified-by";

         // TODO: This section is currently commented out as it deals explicitly with 
         //       working copies. This isn't needed in any production page yet and should
         //       only be commented out when needed. The unit test should also be updated at
         //       that time.
         // if (this.currentItem.workingCopy && this.currentItem.workingCopy.isWorkingCopy)
         // {
         //    dateI18N = "details.editing-started-by";
         // }
         // else if (dateProperty === properties.created.iso8601)
         // {
         //    dateI18N = "details.created-by";
         // }
         this.renderedValue = this.message(dateI18N, {
            0: this.getRelativeTime(modifiedDate), 
            1: modifiedBy
         });
         
         this.renderedValueClass = this.renderedValueClass + " " + this.renderSize;
         if (this.deemphasized === true)
         {
            this.renderedValueClass = this.renderedValueClass + " deemphasized";
         }
      }
   });
});