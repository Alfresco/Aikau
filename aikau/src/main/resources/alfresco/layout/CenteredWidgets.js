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
 * <p>This should be used to arrange widgets horizontally and centred. For centre alignment to work each widget contained 
 * within this widget must declare a widthCalc value which is used to calculate the size of the container and therefore the 
 * size of the margins required.</p>
 * <p>It is also possible to define gaps between widgets by using the 
 * [widgetMarginLeft]{@link module:alfresco/layout/HorizontalWidgets#widgetMarginLeft} and
 * [widgetMarginRight]{@link module:alfresco/layout/HorizontalWidgets#widgetMarginRight} attributes (but you should bear
 * in mind that if using both attributes then the gap between 2 widgets will be the <b>combination</b> of both values).</p>
 * <p><b>PLEASE NOTE: Resize operations are not currently handled - this will be addressed in the future</b></p>
 * <p><pre>{
 *    "name": "alfresco/layout/CenteredWidgets",
 *    "config": {
 *       "widgetMarginLeft": 10,
 *       "widgetMarginRight": 10
 *       "widgets": [
 *          {
 *             "name": "alfresco/logo/Logo",
 *             "widthCalc" 300
 *          },
 *          {
 *             "name": "alfresco/logo/Logo",
 *             "widthCalc" 50
 *          }
 *       ]
 *    }
 * }</pre></p>
 * @module alfresco/layout/CenteredWidgets
 * @extends module:alfresco/core/ProcessWidgets
 * @author Richard Smith
 */
define(["alfresco/core/ProcessWidgets",
        "dojo/_base/declare",
        "dojo/text!./templates/CenteredWidgets.html",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-style",
        "dojo/dom-geometry",
        "dojo/on",
        "alfresco/core/ObjectTypeUtils"], 
        function(ProcessWidgets, declare, template, lang, array, domConstruct, domStyle, domGeom, on, ObjectTypeUtils) {
   
   return declare([ProcessWidgets], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/CenteredWidgets.css"}]
       */
      cssRequirements: [{cssFile:"./css/CenteredWidgets.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * This is the size of margin (in pixels) that will appear to the left of every widget added. 
       *
       * @instance
       * @type {number}
       * @default null
       */
      widgetMarginLeft: null,

      /**
       * This is the size of margin (in pixels) that will appear to the right of every widget added. 
       *
       * @instance
       * @type {number}
       * @default null
       */
      widgetMarginRight: null,

      /**
       * Sets up the default width to be allocated to each child widget to be added.
       * 
       * @instance
       */
      postCreate: function alfresco_layout_CenteredWidgets__postCreate() {
         this.inherited(arguments);
      },
      
      /**
       * @instance
       * @param {object} evt The resize event.
       */
      onResize: function alfresco_layout_CenteredWidgets__onResize(evt) {
         this.alfLog("log", "Resizing");

         // TODO: Implement to resize when the window changes...
      },

      /**
       * This overrides the default implementation to ensure that each each child widget added has the 
       * appropriate CSS classes applied such that they appear horizontally. It also sets the width
       * of each widget appropriately (either based on the default generated width which is an equal
       * percentage assigned to each child widget) or the specific width configured for the widget.
       * 
       * @instance
       * @param {object} widget The widget definition to create the DOM node for
       * @param {element} rootNode The DOM node to create the new DOM node as a child of
       * @param {string} rootClassName A string containing one or more space separated CSS classes to set on the DOM node
       * @returns {element} A new DOM node for the widget to be attached to
       */
      createWidgetDomNode: function alfresco_layout_CenteredWidgets__createWidgetDomNode(widget, rootNode, rootClassName) {

         var marginLeft =  (this.widgetMarginLeft != null && !isNaN(this.widgetMarginLeft)) ? this.widgetMarginLeft: 0;
         var marginRight =  (this.widgetMarginRight != null && !isNaN(this.widgetMarginRight)) ? this.widgetMarginRight: 0;

         var outerDiv = domConstruct.create("span", { className: "centered-widget"}, this.containerNode);
         var style = {
            "marginLeft": marginLeft + "px",
            "marginRight": marginRight + "px"
         }
         if (widget.widthCalc != 0)
         {
            style.width = widget.widthCalc + "px";
         }
         domStyle.set(outerDiv, style);
         
         var innerDiv = domConstruct.create("div", {}, outerDiv);
         return innerDiv;

      },

      /**
       * Iterate over the created widgets
       * Work out the total width and max height and then set those as styles on layout elements
       *
       * @instance
       */
      allWidgetsProcessed: function alfresco_layout_CenteredWidgets__allWidgetsProcessed(widgets) {

         // Calculate the total width and the max height of all the contained widgets
         var calcWidth = 0;
         var maxHeight = 0;
         array.forEach(widgets, function(widget, i) {
            calcWidth = calcWidth + this.overallWidth(widget.domNode);
            var thisHeight = this.overallHeight(widget.domNode);
            maxHeight = maxHeight > thisHeight?maxHeight:thisHeight;
         }, this);

         // If the total width is greater than the window has available - bomb
         if(calcWidth > this.overallWidth(this.domNode))
         {
            this.alfLog("error", "The total declared width of widgets in a CenteredWidget container exceeds the available space", this);

         // Otherwise set the containerNode width
         }else{
            var style = {
               "width": calcWidth + "px"
            }
            domStyle.set(this.containerNode, style);
         }

         // Set max height for the domNode
         var style = {
            "height": maxHeight + "px"
         }
         domStyle.set(this.domNode, style);
      },

      /**
       * Calculate the overall width of a node
       *
       * @instance
       */
      overallWidth: function alfresco_layout_CenteredWidgets__overallWidth(node) {
         var computedStyle = domStyle.getComputedStyle(node);
         var output = domGeom.getMarginBox(node, computedStyle);
         return output.w;
      },

      /**
       * Calculate the overall height of a node
       *
       * @instance
       */
      overallHeight: function alfresco_layout_CenteredWidgets__overallHeight(node) {
         var computedStyle = domStyle.getComputedStyle(node);
         var output = domGeom.getMarginBox(node, computedStyle);
         return output.h;
      }

   });
});