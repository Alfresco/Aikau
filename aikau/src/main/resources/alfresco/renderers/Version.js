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
 * @module alfresco/renderers/Version
 * @extends module:alfresco/renderers/Property
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/Property"], 
        function(declare, Property) {

   return declare([Property], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Version.css"}]
       */
      cssRequirements: [{cssFile:"./css/Version.css"}],
      
      /**
       * This can be set to apply a CSS class to the rendered property value
       * 
       * @instance
       * @type {string}
       * @default
       */
      renderedValueClass: "version",
      
      /**
       * @instance
       * @type {string}
       * @default
       */
      propertyToRender: "version"
   });
});