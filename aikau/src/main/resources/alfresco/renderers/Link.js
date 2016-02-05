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
 * Extends the [property link renderer]{@link module:alfresco/renderers/PropertyLink} to allow custom link text to
 * be configured.
 *
 * @example <caption>Simple example:</caption>
 * {
 *   name: "alfresco/renderers/Link",
 *   config: {
 *     labelNode: "Click Me!",
 *     publishTopic: "LINK_CLICKED"
 *   }
 * }
 * 
 * @module alfresco/renderers/Link
 * @extends alfresco/renderers/PropertyLink
 * @author Dave Draper
 * @since 1.0.54
 */
define(["dojo/_base/declare",
        "alfresco/renderers/PropertyLink"], 
        function(declare, PropertyLink) {

   return declare([PropertyLink], {

      /**
       * The value to render as the displayed link.
       * 
       * @instance
       * @type {string}
       * @default
       */
      linkLabel: "linkLabel not configured",

      /**
       * Overrides the [inherited default value]{@link module:alfresco/renderers/Link#useCurrentItemAsPayload}
       * because it is a more sensible default.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      useCurrentItemAsPayload: false,

      /**
       * Overrides the [inherited function]{@link moduke:alfresco/renderers/Property#generateRendering} to return
       * the localized [link label]{@link module:alfresco/renderers/Link#linkLabel}
       *
       * @instance
       * @param {object} value The details of the click event
       */
      generateRendering: function alfresco_renderers_Link__generateRendering(/*jshint unused:false*/ value) {
         return this.message(this.linkLabel);
      }
   });
});