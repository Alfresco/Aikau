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
 * Renders an iso8601 format date indicating when a node created or last modified. However,
 * when [simple]{@link module:alfresco/renderers/Date#simple} is configured to be true
 * this will just render the date using the [propertyToRender]{@link module:alfresco/renderers/Property#propertyToRender}
 * configuration attribute.
 * 
 * @example <caption>Sample configuration to override modified by properties:</caption>
 * {
 *    name: "alfresco/renderers/Date",
 *    config: {
 *       modifiedDateProperty: "modifiedOn",
 *       modifiedByProperty: "modifiedBy"
 *    }
 * }
 * 
 * @example <caption>Sample configuration of simple mode:</caption>
 * {
 *    name: "alfresco/renderers/Date",
 *    config: {
 *       simple: true,
 *       propertyToRender: "date"
 *    }
 * }
 * 
 * @module alfresco/renderers/Date
 * @extends module:alfresco/renderers/Property
 * @mixes module:alfresco/core/TemporalUtils
 * @mixes module:alfresco/core/UrlUtilsMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/Property", 
        "alfresco/core/TemporalUtils",
        "alfresco/core/UrlUtilsMixin",
        "alfresco/core/ObjectTypeUtils",
        "dojo/_base/lang"], 
        function(declare, Property, TemporalUtils, UrlUtilsMixin, ObjectTypeUtils, lang) {

   return declare([Property, UrlUtilsMixin, TemporalUtils], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Date.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/Date.properties"}],
      
      /**
       * An optional format to apply to the date. This is only used when 
       * [simple]{@link module:alfresco/renderers/Date#simple} is configured to be true.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.88
       */
      format: null,

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
       * An optional property to complement 
       * [modifiedByProperty]{@link module:alfresco/renderers/Date#modifiedByProperty} for the cases
       * when only "firstName" and "lastName" attributes are available (rather than "displayName").
       * In order to use this the [modifiedByMessage]{@link module:alfresco/renderers/Date#modifiedByMessage}
       * will need to be overridden with a message that accepts a third token.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.86
       */
      modifiedByLastNameProperty: null,

      /**
       * The message to display. This takes the form "Modified <some time> ago by <user>" and is
       * used when a [modifiedByProperty]{@link module:alfresco/renderers/Date#modifiedByProperty} 
       * is available.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.86
       */
      modifiedByMessage: "details.modified-by",

      /**
       * The message to display. This takes the form "Modified <some time> ago" and is
       * used when a [modifiedByProperty]{@link module:alfresco/renderers/Date#modifiedByProperty} 
       * is NOT available.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.86
       */
      modifiedMessage: "details.modified-by.missing-user",

      /**
       * Indicates whether to simply display the date without rendering it within a specific message.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      simple: false,

      /**
       * Set up the attributes to be used when rendering the template.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_renderers_Date__postMixInProperties() {
         // jshint maxcomplexity:false
         if (this.label)
         {
            this.label = this.message(this.label) + ": ";
         }
         else
         {
            this.label = "";
         }

         if (this.simple && this.propertyToRender)
         {
            if (ObjectTypeUtils.isString(this.propertyToRender) &&
               ObjectTypeUtils.isObject(this.currentItem) &&
               lang.exists(this.propertyToRender, this.currentItem))
            {
               this.renderPropertyNotFound = false;
               var dateProperty = lang.getObject(this.propertyToRender, false, this.currentItem);
               this.originalRenderedValue = this.renderedValue = this.renderDate(dateProperty, this.format);
            }
            else
            {
               this.alfLog("log", "Property does not exist:", this);
            }

            this.renderedValue = this.generateRendering(this.renderedValue);
         }
         else
         {
            if (!this.modifiedDateProperty)
            {
               this.modifiedDateProperty = "jsNode.properties.modified.iso8601";
            }
            var modifiedDate = lang.getObject(this.modifiedDateProperty, false, this.currentItem);

            if (!this.modifiedByProperty)
            {
               this.modifiedByProperty = "jsNode.properties.modifier.displayName";
            }
            var lastName = "";
            if (this.modifiedByLastNameProperty)
            {
               lastName = lang.getObject(this.modifiedByLastNameProperty, false, this.currentItem);
            }
            var modifiedBy = lang.getObject(this.modifiedByProperty, false, this.currentItem);
            if (modifiedBy)
            {
               this.renderedValue = this.message(this.modifiedByMessage || "details.modified-by", {
                  0: this.getRelativeTime(modifiedDate),
                  1: this.encodeHTML(modifiedBy),
                  2: this.encodeHTML(lastName || "")
               });
            }
            else
            {
               this.renderedValue = this.message(this.modifiedMessage || "details.modified-by.missing-user", {
                  0: this.getRelativeTime(modifiedDate)
               });
            }
         }
         this.updateRenderedValueClass();
      }
   });
});