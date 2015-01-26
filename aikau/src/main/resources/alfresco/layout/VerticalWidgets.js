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
 * <p>This should be used to stack widgets in a column. Each widget will be allocated 100% of the available width and
 * will consume as much vertical height as required. It is possible to space widgets by setting the 
 * [widgetMarginTop]{@link module:alfresco/layout/VerticalWidgets#widgetMarginTop} and
 * [widgetMarginBottom]{@link module:alfresco/layout/VerticalWidgets#widgetMarginBottom} attributes (but you should bear
 * in mind that if using both attributes then the gap between 2 widgets will be the <b>combination</b> of both values).</p>
 * <p>Example configuration:</p>
 * <p><pre>{
 *    "name": "alfresco/layout/VerticalWidgets",
 *    "config": {
 *       "widgetMarginTop": 10,
 *       "widgetMarginBottom": 10
 *       "widgets": [
 *          {
 *             "name": "alfresco/logo/Logo"
 *          },
 *          {
 *             "name": "alfresco/logo/Logo"
 *          }
 *       ]
 *    }
 * }</pre></p>
 * @module alfresco/layout/VerticalWidgets
 * @extends module:alfresco/core/ProcessWidgets
 * @author Dave Draper
 */
define(["alfresco/core/ProcessWidgets",
        "dojo/_base/declare",
        "dojo/dom-construct",
        "dojo/dom-style",
        "dojo/_base/array"], 
        function(ProcessWidgets, declare, domConstruct, domStyle, array) {
   
   return declare([ProcessWidgets], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/VerticalWidgets.css"}]
       */
      cssRequirements: [{cssFile:"./css/VerticalWidgets.css"}],

      /**
       * The CSS class (or a space separated list of classes) to include in the DOM node.
       * 
       * @instance
       * @type {string}
       * @default "horizontal-widgets"
       */
      baseClass: "alfresco-layout-VerticalWidgets",

      /**
       * This is the size of margin (in pixels) that will appear to the left of every widget added. 
       *
       * @instance
       * @type {number}
       * @default null
       */
      widgetMarginTop: null,

      /**
       * This is the size of margin (in pixels) that will appear to the right of every widget added. 
       *
       * @instance
       * @type {number}
       * @default null
       */
      widgetMarginBottom: null,

      /**
       * Iterate over the created widgets and add the requested margins to them.
       *
       * @instance
       */
      allWidgetsProcessed: function alfresco_layout_VerticalWidgets__allWidgetsProcessed(widgets) {
         if (this.widgetMarginTop != null || this.widgetMarginBottom != null)
         {
            array.forEach(widgets, function(widget, i) {
               if(this.widgetMarginTop != null)
               {
                  domStyle.set(widget.domNode, {
                     "marginTop": this.widgetMarginTop + "px"
                  });
               }
               if(this.widgetMarginBottom != null)
               {
                  domStyle.set(widget.domNode, {
                     "marginBottom": this.widgetMarginBottom + "px"
                  });
               }
            }, this);
         }
      }
   });
});