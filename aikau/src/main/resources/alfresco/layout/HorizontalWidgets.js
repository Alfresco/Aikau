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
 * <p>This should be used to lay widgets out in a horizontal line. If no specific widths are requested
 * by the child widgets then each will be allotted an equal amount of the available space. However, it is
 * possible for each widget to request a width in either pixels or percentage (and it is possible to mix
 * and match). Pixel dimensions will be allocated first and the percentages will be of the remaining available
 * width after fixed sizes are deducted. Any widgets that do not request a specific width will be allocated 
 * an equal amount of whatever is left.</p>
 * 
 * <p>It is also possible to define gaps between widgets by using the 
 * [widgetMarginLeft]{@link module:alfresco/layout/HorizontalWidgets#widgetMarginLeft} and
 * [widgetMarginRight]{@link module:alfresco/layout/HorizontalWidgets#widgetMarginRight} attributes (but you should bear
 * in mind that if using both attributes then the gap between 2 widgets will be the <b>combination</b> of both values).</p>
 * 
 * <p><b>PLEASE NOTE:</b> It is not possible to use this module to control the layout of controls within a form. If you wish
 * to create a form containing horizontally aligned controls then you should use the 
 * [ControlRow]{@link module:alfresco/forms/ControlRow} widget</p>
 *
 * <p><b>PLEASE NOTE: Resize operations are not currently handled - this will be addressed in the future</b></p>
 * 
 * @example <caption>Sample usage:</caption>
 * {
 *    "name": "alfresco/layout/HorizontalWidgets",
 *    "config": {
 *       "widgetMarginLeft": 10,
 *       "widgetMarginRight": 10,
 *       "widgets": [
 *          {
 *             "name": "alfresco/logo/Logo",
 *             "widthPx": 300
 *          },
 *          {
 *             "name": "alfresco/logo/Logo",
 *             "widthPc": 50
 *          }
 *       ]
 *    }
 * }
 * 
 * @module alfresco/layout/HorizontalWidgets
 * @extends module:alfresco/core/ProcessWidgets
 * @mixes module:alfresco/core/ResizeMixin
 * @mixes module:alfresco/alfresco/layout/DynamicVisibilityResizingMixin
 * @author Dave Draper
 */
define(["alfresco/core/ProcessWidgets",
        "dojo/_base/declare",
        "dojo/text!./templates/HorizontalWidgets.html",
        "alfresco/core/ResizeMixin",
        "alfresco/layout/DynamicVisibilityResizingMixin",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/dom-style",
        "dojo/dom-geometry",
        "dojo/when",
        "jquery"], 
        function(ProcessWidgets, declare, template, ResizeMixin, DynamicVisibilityResizingMixin, lang, array, 
                 domClass, domConstruct, domStyle, domGeom, when, $) {
   
   return declare([ProcessWidgets, ResizeMixin, DynamicVisibilityResizingMixin], {
      
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
       * @default
       */
      baseClass: "horizontal-widgets",
      
      /**
       * This will be set to a percentage value such that each widget displayed has an equal share
       * of page width. 
       * 
       * @instance
       * @type {string}
       * @default
       */
      widgetWidth: null,
      
      /**
       * This is the size of margin (in pixels) that will appear to the left of every widget added. 
       *
       * @instance
       * @type {number}
       * @default
       */
      widgetMarginLeft: null,

      /**
       * This is the size of margin (in pixels) that will appear to the right of every widget added. 
       *
       * @instance
       * @type {number}
       * @default
       */
      widgetMarginRight: null,

      /**
       * Indicates whether or not the widget has dimensions to work with when created. This mainly refers
       * to the available width and when there is no width to consume then is not "safe" to create child
       * widgets.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.46
       */
      _hasInitialDimensions: false,

      /**
       * Extends the [inherited function]{@link module:alfresco/core/CoreWidgetProcessing#allWidgetsProcessed}
       * to set up subscriptions for the [visibilityRuleTopics]{@link module:alfresco/layout/DynamicVisibilityResizingMixin#visibilityRuleTopics}
       * that are returned by calling [getVisibilityRuleTopics]{@link module:alfresco/layout/DynamicVisibilityResizingMixin#getVisibilityRuleTopics}
       * on the first pass through the [doWidthProcessing]{@link module:alfresco/layout/HorizontalWidgets#doWidthProcessing}
       * function. The subscriptions need to be created after the widgets have been created in order that their visibility 
       * is adjusted before the [onResize]{@link module:alfresco/layout/HorizontalWidgets#onResize} function that is bound 
       * to is called.
       *
       * @instance
       * @param {object[]} widgets The widgets that have been created
       * @since 1.0.33
       */
      allWidgetsProcessed: function alfresco_layout_HorizontalWidgets__allWidgetsProcessed(/*jshint unused:false*/ widgets) {
         this.inherited(arguments);
         this.subscribeToVisibilityRuleTopics(this.onResize);
      },

      /**
       * Sets up the default width to be allocated to each child widget to be added.
       * 
       * @instance
       */
      postCreate: function alfresco_layout_HorizontalWidgets__postCreate() {
         // Split the full width between all widgets... 
         // We should update this to allow for specific widget width requests...
         this.visibilityRuleTopics = this.getVisibilityRuleTopics(this.widgets);

         // NOTE: Here we're very deliberately using JQuery to get the available width, this
         //       is to address a very specific issue with Firefox failing when using iframes
         //       and the dojo/dom-geometry code (in particular the getComputedStyle) - see AKU-692
         var overallwidth = $(this.domNode).width();
         if (overallwidth)
         {
            this._hasInitialDimensions = true;
            this.doWidthProcessing(this.widgets, true);
         }
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
       * @param {boolean} firstPass Indicates whether this is the first pass (this determines whether to look at visibility
       * rule configuration or DOM node visibility).
       */
      doWidthProcessing: function alfresco_layout_HorizontalWidgets__doWidthProcessing(widgets, firstPass) {
         // jshint maxstatements:false
         if (widgets && this.domNode)
         {
            try
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

               // Filter out any widgets that are configured to be initially invisible (on first pass processing)
               // or that have a DOM node that is not displayed (on resizing)...
               if (firstPass)
               {
                  widgets = array.filter(widgets, function(widget) {
                     var visibleInitialValue = lang.getObject("config.visibilityConfig.initialValue", false, widget);
                     var invisibleInitialValue = lang.getObject("config.invisibilityConfig.initialValue", false, widget);
                     return visibleInitialValue !== false && invisibleInitialValue !== true;
                  });
               }
               else
               {
                  widgets = array.filter(widgets, function(widget) {
                     return widget.domNode && domStyle.get(widget.domNode, "display") !== "none";
                  });
               }
               
               // NOTE: In the "if" statements below we're not worried about widgetMarginLeft 
               //       or widgetMarginRight being 0 and thus the statement failing to evaluate
               //       to true since the calculated size would remain 0 anyway
               if (this.widgetMarginLeft && !isNaN(this.widgetMarginLeft))
               {
                  leftMarginsSize = widgets.length * parseInt(this.widgetMarginLeft, 10);
               }
               else
               {
                  this.widgetMarginLeft = 0;
               }
               if (this.widgetMarginRight && !isNaN(this.widgetMarginRight))
               {
                  rightMarginsSize = widgets.length * parseInt(this.widgetMarginRight, 10);
               }
               else
               {
                  this.widgetMarginRight = 0;
               }
               var remainingWidth = overallwidth - leftMarginsSize - rightMarginsSize;

               // Work out how many pixels widgets have requested and subtract that from the remainder...
               var widgetRequestedWidth = 0;
               var widgetsWithNoWidthReq = 0;
               array.forEach(widgets, function(widget) {
                  if ((widget.widthPx || widget.widthPx === 0) && !isNaN(widget.widthPx))
                  {
                     widgetRequestedWidth += parseInt(widget.widthPx, 10);
                     widget.widthCalc = widget.widthPx;
                  }
                  else if ((widget.widthPc || widget.widthPc === 0) && !isNaN(widget.widthPc))
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
               array.forEach(widgets, function(widget) {
                  if ((widget.widthPc || widget.widthPc === 0) && !isNaN(widget.widthPc))
                  {
                     var pc = parseInt(widget.widthPc, 10);
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
               remainingPercentage = remainingPercentage / widgetsWithNoWidthReq;
               var standardWidgetWidth = remainingWidth * (remainingPercentage/100);
               array.forEach(widgets, function(widget) {
                  if (((widget.widthPc || widget.widthPc === 0) && !isNaN(widget.widthPc)) ||
                      ((widget.widthPx || widget.widthPx === 0) && !isNaN(widget.widthPx)))
                  {
                     // No action required. 
                  }
                  else
                  {
                     widget.widthCalc = standardWidgetWidth;
                  }
               });
            }
            catch (e)
            {
               this.alfLog("warn", "Failure to calculate widths correctly", e, this);
            }
         }
      },

      /**
       * Updates the sizes of each widget when the window is resized.
       *
       * @instance
       * @param {object} evt The resize event.
       */
      onResize: function alfresco_layout_HorizontalWidget__onResize() {
         // This function is called whenever a resize event occurs, but also when a widget 
         // changes in visibility. This allows us to hook into any ancestor widget publishing
         // a resize request that occurs as it becomes visible. This allows us then to check
         // for some dimensions to work with...
         if (!this._hasInitialDimensions)
         {
            var overallwidth = $(this.domNode).width();
            if (overallwidth)
            {
               this._hasInitialDimensions = true;
               this.doWidthProcessing(this.widgets, true);
               this.alfPublishResizeEvent(this.domNode);
            }
         }
         else
         {
            when(this.getProcessedWidgets(), lang.hitch(this, function(processedWidgets) {
               this.doWidthProcessing(processedWidgets, false);
               array.forEach(processedWidgets, function(widget) {
                  if (widget && widget.domNode && widget.widthCalc)
                  {
                     var currentWidth = domGeom.getMarginBox(widget.domNode.parentNode).w;
                     domStyle.set(widget.domNode.parentNode, "width", widget.widthCalc + "px");
                     if (currentWidth !== widget.widthCalc)
                     {
                        this.alfPublishResizeEvent(widget.domNode.parentNode);
                     }
                  }
               }, this);
            }));
         }
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
      createWidgetDomNode: function alfresco_layout_HorizontalWidgets__createWidgetDomNode(widget, /*jshint unused:false*/ rootNode, rootClassName) {
         var outerDiv = domConstruct.create("div", { className: "horizontal-widget"}, this.containerNode);
         
         // Set the width of each widget according to how many there are...
         var style = {
            "marginLeft": this.widgetMarginLeft + "px",
            "marginRight": this.widgetMarginRight + "px"
         };
         if (widget.widthCalc)
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
      createWidget: function alfresco_layout_HorizontalWidgets__createWidget(config, /*jshint unused:false*/ domNode, callback, callbackScope, index) {
         var widget = this.inherited(arguments);
         if (widget)
         {
            if ((config.widthPx || config.widgetPx === 0) && !isNaN(config.widthPx))
            {
               widget.widthPx = config.widthPx;
            }
            else if ((config.widthPc || config.widthPc === 0) && !isNaN(config.widthPc))
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
