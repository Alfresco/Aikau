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
 * 
 * @module alfresco/layout/AbsoluteCenterWidgets
 * @extends module:alfresco/core/ProcessWidgets
 * @author Dave Draper
 */
define(["alfresco/core/ProcessWidgets",
        "dojo/_base/declare",
        "dojo/dom-style",
        "dojo/dom-geometry",
        "dojo/dom-construct",
        "dojo/_base/array"], 
        function(ProcessWidgets, declare, domStyle, domGeom, domConstruct, array) {
   
   return declare([ProcessWidgets], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AbsoluteCenterWidgets.css"}]
       */
      cssRequirements: [{cssFile:"./css/AbsoluteCenterWidgets.css"}],

      /**
       * The CSS class (or a space separated list of classes) to include in the DOM node.
       * 
       * @instance
       * @type {string}
       * @default "alfresco-layout-AbsoluteCenterWidgets"
       */
      baseClass: "alfresco-layout-AbsoluteCenterWidgets",

      /**
       * Iterate over the created widgets and add the requested margins to them.
       *
       * @instance
       */
      allWidgetsProcessed: function alfresco_layout_AbsoluteCenterWidgets__allWidgetsProcessed(widgets) {
         var heightRequired = 0;
         array.forEach(widgets, function(widget, index) {
            var computedStyle = domStyle.getComputedStyle(widget.domNode);
            var output = domGeom.getMarginBox(widget.domNode, computedStyle);
            heightRequired += output.h;
         }, this);
         domStyle.set(this.domNode, "height", heightRequired + "px");

         if (this.width != null && !isNaN(this.width))
         {
            domStyle.set(this.domNode, "width", this.width + "px");
         }
      }
   });
});