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
 * <p>This should be used to lay widgets out in a horizontal line. If no specific widths are requested
 * by the child widgets then each will be allotted an equal amount of the available space. However, it is
 * possible for each widget to request a width in either pixels or percentage (and it is possible to mix
 * and match). Pixel dimensions will be allocated first and the percentages will be of the remaining available
 * width after fixed sizes are deducted. Any widgets that do not request a specific width will be allocated 
 * an equal amount of whatever is left.</p>
 * <p>It is also possible to define gaps between widgets by using the 
 * [widgetMarginLeft]{@link module:alfresco/layout/HorizontalWidgets#widgetMarginLeft} and
 * [widgetMarginRight]{@link module:alfresco/layout/HorizontalWidgets#widgetMarginRight} attributes (but you should bear
 * in mind that if using both attributes then the gap between 2 widgets will be the <b>combination</b> of both values).</p>
 * <p><b>PLEASE NOTE: Resize operations are not currently handled - this will be addressed in the future</b></p>
 * <p><pre>{
 *    "name": "alfresco/layout/VerticalWidgets",
 *    "config": {
 *       "widgetMarginLeft": 10,
 *       "widgetMarginRight": 10
 *       "widgets": [
 *          {
 *             "name": "alfresco/logo/Logo",
 *             "widthPx" 300
 *          },
 *          {
 *             "name": "alfresco/logo/Logo",
 *             "widthPc" 50
 *          }
 *       ]
 *    }
 * }</pre></p>
 * @module alfresco/layout/HorizontalWidgets
 * @extends module:alfresco/core/ProcessWidgets
 * @author Dave Draper
 */
define(["alfresco/core/ProcessWidgets",
        "dojo/_base/declare",
        "dojo/text!./templates/HorizontalWidgets.html",
        "alfresco/core/ResizeMixin",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-style",
        "dojo/dom-geometry",
        "dojo/on",
        "alfresco/core/ObjectTypeUtils"], 
        function(ProcessWidgets, declare, template, ResizeMixin, lang, array, domConstruct, domStyle, domGeom, on, ObjectTypeUtils) {
   
   return declare([ProcessWidgets, ResizeMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/HorizontalWidgets.css"}]
       */
      cssRequirements: [{cssFile:"./css/HorizontalWidgets.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * The CSS class (or a space separated list of classes) to include in the DOM node.
       * 
       * @instance
       * @type {string}
       * @default "horizontal-widgets"
       */
      baseClass: "horizontal-widgets",
      
      /**
       * This will be set to a percentage value such that each widget displayed has an equal share
       * of page width. 
       * 
       * @instance
       * @type {string}
       * @default null 
       */
      widgetWidth: null,
      
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
      postCreate: function alfresco_layout_HorizontalWidgets__postCreate() {
         // Split the full width between all widgets... 
         // We should update this to allow for specific widget width requests...
         this.doWidthProcessing(this.widgets);
         this.inherited(arguments);

         // Update the grid as the window changes...
         this.alfSetupResizeSubscriptions(this.onResize, this);
      },
      
      /**
       * Calculates the widths of each widget based on the requested sizes defined in either pixels or
       * percentage. The pixel widths take precedence and the percentages are calculated as the percentage
       * of whatever remains. If a widget has not requested a width then it will get an even share
       * of whatever horizontal space remains.
       *
       * @instance
       * @param {array} widgets The widgets or widget configurations to process the widths for
       */
      doWidthProcessing: function alfresco_layout_HorizontalWidgets__doWidthProcessing(widgets) {
         if (widgets != null && this.domNode != null)
         {
            // Get the dimensions of the current DOM node...
            var computedStyle = domStyle.getComputedStyle(this.domNode);
            var output = domGeom.getMarginBox(this.domNode, computedStyle);
            var overallwidth = output.w;
            overallwidth -= widgets.length;

            // Always allow some pixels for potential scrollbars...
            overallwidth -= 30;
            
            // Subtract the margins from the overall width
            var leftMarginsSize = 0,
                rightMarginsSize = 0;
            if (this.widgetMarginLeft != null && !isNaN(this.widgetMarginLeft))
            {
               leftMarginsSize = widgets.length * parseInt(this.widgetMarginLeft);
            }
            else
            {
               this.widgetMarginLeft = 0;
            }
            if (this.widgetMarginRight != null && !isNaN(this.widgetMarginRight))
            {
               rightMarginsSize = widgets.length * parseInt(this.widgetMarginRight);
            }
            else
            {
               this.widgetMarginRight = 0;
            }
            var remainingWidth = overallwidth - leftMarginsSize - rightMarginsSize;

            // Work out how many pixels widgets have requested and subtract that from the remainder...
            var widgetRequestedWidth = 0;
            var widgetsWithNoWidthReq = 0;
            array.forEach(widgets, function(widget, index) {
               if (widget.widthPx != null && !isNaN(widget.widthPx))
               {
                  widgetRequestedWidth += parseInt(widget.widthPx);
                  widget.widthCalc = widget.widthPx;
               }
               else if (widget.widthPc != null && !isNaN(widget.widthPc))
               {
                  // No action, just avoiding adding to the count of widgets that don't request
                  // a width as either a pixel or percentage size.
               }
               else
               {
                  // The current widget either hasn't requested a width or has requested it with a value
                  // that is not a number. It will therefore get an equal share of whatever remainder is left.
                  widgetsWithNoWidthReq++;
               }
            });

            // Check to see if there is actually any space left across the page...
            // There's not really a lot we can do about it if not but it's useful to warn developers so that they
            // can spot that there's a potential fault...
            remainingWidth = remainingWidth - widgetRequestedWidth;
            if (remainingWidth < 0)
            {
               this.alfLog("warn", "There is no horizontal space left for widgets requesting a percentage of available space", this);
            }

            // Update the widgets that have requested a percentage of space with a value that is calculated from the remaining space
            var totalWidthAsRequestedPercentage = 0;
            array.forEach(widgets, function(widget, index) {
               if (widget.widthPc != null && !isNaN(widget.widthPc))
               {
                  var pc = parseInt(widget.widthPc);
                  totalWidthAsRequestedPercentage += pc;

                  if (pc > 100)
                  {
                     this.alfLog("warn", "A widget has requested more than 100% of available horizontal space", widget, this);
                  }

                  widget.widthCalc = remainingWidth * (pc/100);
               }
            }, this);

            // Work out the remaining percentage of the page that can be divided between widgets that haven't requested a specific
            // widget in either pixels or as a percentage...
            var remainingPercentage = 0;
            if (totalWidthAsRequestedPercentage > 100)
            {
               this.alfLog("warn", "Widgets have requested more than 100% of the available horizontal space", this);
            }
            else
            {
               remainingPercentage = 100 - totalWidthAsRequestedPercentage;
            }

            // Divide up the remaining horizontal space between the remaining widgets...
            var remainingPercentage = remainingPercentage / widgetsWithNoWidthReq,
                standardWidgetWidth = remainingWidth * (remainingPercentage/100);
            array.forEach(widgets, function(widget, index) {
               if ((widget.widthPc != null && !isNaN(widget.widthPc)) ||
                   (widget.widthPx != null && !isNaN(widget.widthPx)))
               {
                  // No action required. 
               }
               else
               {
                  widget.widthCalc = standardWidgetWidth;
               }
            });
         }
      },

      /**
       * Updates the sizes of each widget when the window is resized.
       *
       * @instance
       * @param {object} evt The resize event.
       */
      onResize: function alfresco_layout_HorizontalWidget__onResize() {
         this.doWidthProcessing(this._processedWidgets);
         array.forEach(this._processedWidgets, function(widget, index) {
            if (widget != null && widget.domNode != null && widget.widthCalc != null && widget.widthCalc != 0)
            {
               domStyle.set(widget.domNode.parentNode, "width", widget.widthCalc + "px");
            }
         });
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
      createWidgetDomNode: function alfresco_layout_HorizontalWidgets__createWidgetDomNode(widget, rootNode, rootClassName) {
         var outerDiv = domConstruct.create("div", { className: "horizontal-widget"}, this.containerNode);
         
         // Set the width of each widget according to how many there are...
         var style = {
            "marginLeft": this.widgetMarginLeft + "px",
            "marginRight": this.widgetMarginRight + "px"
         }
         if (widget.widthCalc != 0)
         {
            style.width =  widget.widthCalc + "px";
         }
         domStyle.set(outerDiv, style);
         
         var innerDiv = domConstruct.create("div", {}, outerDiv);
         return innerDiv;
      },

      /**
       *
       * @instance
       * @param {object} config The configuration for the widget
       * @param {element} domNode The DOM node to attach the widget to
       * @param {function} callback A function to call once the widget has been instantiated
       * @param {object} callbackScope The scope with which to call the callback
       * @param {number} index The index of the widget to create (this will effect it's location in the 
       * [_processedWidgets]{@link module:alfresco/core/Core#_processedWidgets} array)
       */
      createWidget: function alfresco_layout_HorizontalWidgets__createWidget(config, domNode, callback, callbackScope, index) {
         var widget = this.inherited(arguments);
         if (widget != null)
         {
            if (config.widthPx != null && !isNaN(config.widthPx))
            {
               widget.widthPx = config.widthPx;
            }
            else if (config.widthPc != null && !isNaN(config.widthPc))
            {
               widget.widthPc = config.widthPc;
            }
            else
            {
               // No action required
            }
         }
         return widget;
      }
   });
});