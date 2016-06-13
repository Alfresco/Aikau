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
 * <p>This widget provides a way in which a widget model can be displayed when the mouse moves over another
 * widget. To use this tooltip you need to define a 
 * [widgets model to immediately render]{@link module:alfresco/misc/AlfTooltipDialog#widgets} and then another
 * [widget model]{@link module:alfresco/misc/AlfTooltipDialog#widgetsForTooltip} that will be displayed in the
 * tooltip when the mouse moves over any of the widgets in the first model.</p>
 * 
 * @example <caption>Example configuration:</caption>
 * {
 *    name: "alfresco/layout/ClassicWindow",
 *    config: {
 *    title: "Tooltip displays on mouse over logo",
 *    widgets: [
 *       {
 *          name: "alfresco/misc/AlfTooltip",
 *          config: {
 *             widgets: [
 *                {
 *                   name: "alfresco/logo/Logo"
 *                }
 *             ],
 *             widgetsForTooltip: [
 *                {
 *                   name: "alfresco/html/Label",
 *                   config: {
 *                      label: "This is the tooltip content"
 *                   }
 *                }
 *             ]
 *          }
 *       }
 *    ]
 * }
 * 
 * @example <caption>Example configuration with longer delay before displaying:</caption>
 * {
 *    name: "alfresco/layout/ClassicWindow",
 *    config: {
 *    title: "Tooltip displays on mouse over logo",
 *    widgets: [
 *       {
 *          name: "alfresco/misc/AlfTooltip",
 *          config: {
 *             mouseoverShowDelay: 1000,
 *             widgets: [
 *                {
 *                   name: "alfresco/logo/Logo"
 *                }
 *             ],
 *             widgetsForTooltip: [
 *                {
 *                   name: "alfresco/html/Label",
 *                   config: {
 *                      label: "This is the tooltip content"
 *                   }
 *                }
 *             ]
 *          }
 *       }
 *    ]
 * }
 * 
 * @example <caption>Example configuration using a click event rather than hover and width styling:</caption>
 * {
 *    name: "alfresco/layout/ClassicWindow",
 *    config: {
 *    title: "Tooltip displays on mouse over logo",
 *    widgets: [
 *       {
 *          name: "alfresco/misc/AlfTooltip",
 *          config: {
 *             widgets: [
 *                {
 *                   name: "alfresco/logo/Logo"
 *                }
 *             ],
 *             widgetsForTooltip: [
 *                {
 *                   name: "alfresco/html/Label",
 *                   config: {
 *                      label: "This is the tooltip content"
 *                   }
 *                }
 *             ],
 *             triggeringEvent: "click",
 *             tooltipStyle: "width: 350px;"
 *          }
 *       }
 *    ]
 * }
 * 
 * @module alfresco/misc/AlfTooltip
 * @extends external:dijit/Menu
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 * @author Martin Doyle
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/AlfTooltip.html",
        "dijit/TooltipDialog",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-style",
        "dojo/on",
        "dojo/query",
        "dojo/when",
        "dijit/popup"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, TooltipDialog, AlfCore, CoreWidgetProcessing,
                 lang, array, domConstruct, domStyle, on, query, when, popup) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * <p>This is an optional CSS selector that can be provided to identify a child node that the tooltip
       * should be anchored to. Ideally this should only match a single node, but if it matches multiple
       * nodes then the first result will be used. This selector is only used within the DOM that descends
       * from this widget - not across the entire page.</p>
       * <p>PLEASE NOTE: Use of this attribute is potentially fragile depending
       * upon the selector used - there are no guarantees that the CSS classes or HTML structure of widgets
       * will not change between releases of Aikau! It is strongly recommended that if future proof selectors
       * are required that feature requests are made to add them.</p>
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.71
       */
      anchorSelector: null,

      /**
       * An optional array of the orientation preferences for the tooltip. An example configuration might
       * be ["below-centered", "above-centered"] for example.
       * 
       * @instance
       * @type {string[]}
       * @default
       * @since 1.0.71
       */
      orientation: null,

      /**
       * This is the widget model that will be displayed inside the tooltip.
       * 
       * @instance
       * @type {array}
       * @default
       */
      widgetsForTooltip: null,

      /**
       * This is the widget model that will be immediately rendered. When the mouse is moved over any
       * of the widgets in this model then the tooltip will be created (if it hasn't previously been created)
       * and will then be displayed.
       * 
       * @instance
       * @type {array}
       * @default
       */
      widgets: null,

      /**
       * A reference to the dijit/TooltipDialog that will be created.
       *
       * @instance
       * @type {object}
       * @default
       */
      _tooltip: null,

      /**
       * The style to be applied to the tooltip. Default is null.
       *
       * @instance
       * @type {string}
       * @default
       */
      tooltipStyle: null,

      /**
       * The Javascript "dojo/on" event to listen for. Default is mouseover.
       *
       * @instance
       * @type {string}
       * @default
       */
      triggeringEvent: "mouseover",

      /**
       * How long (ms) to delay displaying the tooltip on mouseover-triggered tooltips.
       *
       * @instance
       * @type {number}
       * @default
       */
      mouseoverShowDelay: 250,

      /**
       * How long (ms) to delay hiding the tooltip on mouseover-triggered tooltips.
       *
       * @instance
       * @type {number}
       * @default
       */
      mouseoutHideDelay: 250,

      /**
       * The pointer for the timeout that will display a tooltip
       *
       * @instance
       * @type {number}
       * @default
       */
      _showTooltipTimeout: 0,

      /**
       * The pointer for the timeout that will hide a tooltip
       *
       * @instance
       * @type {number}
       * @default
       */
      _hideTooltipTimeout: 0,

      /**
       * This is called to display the tooltip. If the tooltip hasn't been created at this point then it will be created.
       * 
       * @instance
       */
      showTooltip: function alfresco_misc_AlfTooltip__showTooltip() {
         if (!this._tooltip)
         {
            this.dialogContent = domConstruct.create("div");
            this.processWidgets(this.widgetsForTooltip, this.dialogContent);
            this._tooltip = new TooltipDialog({
               id: this.id + "_TOOLTIP",
               style: this.tooltipStyle,
               content: this.dialogContent,
               onMouseEnter: lang.hitch(this, this.onTooltipMouseEnter),
               onMouseLeave: lang.hitch(this, this.onTooltipMouseLeave)
            });
         }

         // If a CSS selector has been provided for finding the element to anchor to, then
         // use it to set the target node...
         var targetNode = this.domNode;
         if (this.anchorSelector)
         {
            var results = query(this.anchorSelector, this.domNode);
            if (results.length)
            {
               targetNode = results[0];
            }
         }

         popup.open({
            popup: this._tooltip,
            around: targetNode,
            orient: this.orientation
         });
      },

      /**
       * Called to hide the tooltip. This is done when the mouse leaves the target area by default.
       * 
       * @instance
       */
      hideTooltip: function alfresco_misc_AlfTooltip__hideTooltip() {
         popup.close(this._tooltip);
      },

      /**
       * Sets up the mouse over listener for displaying the tooltip (if
       * [widgetsForTooltip]{@link module:alfresco/misc/AlfTooltipDialog#widgetsForTooltip} contains a widget
       * model) and then processes [widgets]{@link module:alfresco/misc/AlfTooltipDialog#widgets}.
       * 
       * @instance
       */
      postCreate: function alfresco_misc_AlfTooltip__postCreate() {
         if (this.widgetsForTooltip)
         {
            if (this.triggeringEvent === "mouseover") {
               on(this.domNode, "mouseover", lang.hitch(this, this.onMouseover));
               on(this.domNode, "mouseout", lang.hitch(this, this.onMouseout));
            } else {
               on(this.domNode, this.triggeringEvent, lang.hitch(this, this.showTooltip));
            }
         }
         else
         {
            this.alfLog("warn", "A tooltip dialog was configured without a 'widgetsForTooltip' attribute", this);
         }

         if (this.widgets)
         {
            this.processWidgets(this.widgets, this.domNode);
         }
      },

      /**
       * Handle mousing-over the widget.
       *
       * @instance
       */
      onMouseover: function alfresco_misc_AlfTooltip__onMouseover() {
         clearTimeout(this._hideTooltipTimeout);
         this._showTooltipTimeout = setTimeout(lang.hitch(this, this.showTooltip), this.mouseoverShowDelay);
      },

      /**
       * Handle mousing-out of the widget.
       *
       * @instance
       */
      onMouseout: function alfresco_misc_AlfTooltip__onMouseout() {
         clearTimeout(this._showTooltipTimeout);
         this._hideTooltipTimeout = setTimeout(lang.hitch(this, this.hideTooltip), this.mouseoutHideDelay);
      },

      /**
       * Handle mousing-over the tooltip.
       *
       * @instance
       */
      onTooltipMouseEnter: function alfresco_misc_AlfTooltip__onTooltipMouseEnter() {
         clearTimeout(this._hideTooltipTimeout);
      },

      /**
       * Handle mousing-out of the tooltip.
       *
       * @instance
       */
      onTooltipMouseLeave: function alfresco_misc_AlfTooltip__onTooltipMouseLeave() {
         this._hideTooltipTimeout = setTimeout(lang.hitch(this, this.hideTooltip), this.mouseoutHideDelay);
      },

      /**
       * The tooltip needs to take responsibility for delegating any resize requests that its child widgets
       * would usually get if they were not contained within the tooltip. This is particularly important
       * when widgets are placed in a [grid]{@link module:alfresco/lists/views/layouts/Grid} that will request
       * to resize those widgets. Without this delegation the widgets intended to be resized will stay their
       * original size. If the widget does not have a resize function then its DOM node will be resized.
       * If the widget has mixed in the [ResizeMixin]{@link module:alfresco/core/ResizeMixin} then its
       * [alfPublishResizeEvent]{@link module:alfresco/core/ResizeMixin#alfPublishResizeEvent} will be called.
       * 
       * @instance
       * @param {object} dimensions The object containing the width and height for the widget.
       * @since 1.0.47
       */
      resize: function alfresco_misc_AlfTooltip__resize(dimensions) {
         when(this.getProcessedWidgets(), lang.hitch(this, function(widgets) {
            array.forEach(widgets, function(widget) {
               if (widget && typeof widget.resize === "function")
               {
                  widget.resize(dimensions);
               }
               else
               {
                  domStyle.set(widget.domNode, "width", dimensions.w);
                  if (typeof widget.alfPublishResizeEvent === "function")
                  {
                     this.alfPublishResizeEvent(widget.domNode);
                  }
               }
            });
         }));
      }
   });
});