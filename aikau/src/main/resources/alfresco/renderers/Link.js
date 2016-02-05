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
 * Extends the [property link renderer]{@link module:alfresco/renderers/Property} to provide a link that is
 * not displayed as a rendering of a property (i.e. it can be rendered with any text).
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
       * 
       * @instance
       * @type {string}
       * @default
       */
      linkLabel: "linkLabel not configured",

      /**
       * If this is set to true then the current item will be published when the link is clicked. If set to
       * false then the payload will be generated from the configured value.
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