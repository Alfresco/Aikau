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
 * An Alfresco styled tool tip. Extends the default Dijit Tooltip and provides an overridden stylesheet.
 *
 * @module alfresco/misc/AlfTooltip
 * @extends module:dijit/Tooltip
 * @author Richard Smith
 */
define(["dojo/_base/declare",
        "dijit/Tooltip"], 
        function(declare, Tooltip) {

   return declare([Tooltip], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile:"./css/AlfTooltip.css"}],

      /**
       * An array of the tool tip positions.
       * 
       * @instance
       * @type {Array}
       * @default ['above-centered', 'below-centered']
       */
      defaultPosition: ['above-centered', 'below-centered'],

      /**
       * A default show delay time in milliseconds.
       * 
       * @instance
       * @type {Number}
       * @default 250
       */
      showDelay: 250,

      /**
       * A dom node to attach the tool tip to - object or string.
       * 
       * @instance
       * @type {object}
       * @default null
       */
      targetNode: null,

      /**
       * @instance postCreate
       */
      postCreate: function alfresco_menus_AlfTooltip__postCreate() {
         Tooltip.defaultPosition = this.defaultPosition;
         // If a targetNode has been provided, use the addTarget method on dijit/Tooltip to apply it
         if (this.targetNode)
         {
            this.addTarget(this.targetNode);
         }
      }

   });
});