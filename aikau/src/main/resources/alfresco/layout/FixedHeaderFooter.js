/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
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
 * <p>This widget provides a simple way in which you can keep a "header" and/or "footer" always visible whilst
 * any overflowing main content is scrolled. The [header]{@link module:alfresco/layout/FixedHeaderFooter#widgetsForHeader},
 * [footer]{@link module:alfresco/layout/FixedHeaderFooter#widgetsForFooter} and 
 * [main content]{@link module:alfresco/layout/FixedHeaderFooter#widgetsForFooter} should be defined as standard
 * widget models.</p>
 * <p>The overall [height]{@link module:alfresco/layout/FixedHeaderFooter#height} of the widget can be explicitly 
 * set but can also be left (or set) to the default value of "auto" which will make the widget take up all the available
 * space in the client window below it.</p>
 *
 * @example <caption>Example configuration:</caption>
 * {
 *    name: "alfresco/layout/FixedHeaderFooter",
 *    config: {
 *       height: "auto",
 *       widgetsForHeader: [
 *          {
 *             name: "alfresco/menus/AlfMenuBar",
 *             config: {
 *                widgets: [
 *                   {
 *                      name: "alfresco/menus/AlfMenuBarItem",
 *                      config: {
 *                         label: "Menu item in header"
 *                      }
 *                   }
 *                ]
 *             }
 *          }
 *       ],
 *       widgets: [
 *          {
 *             name: "alfresco/lists/AlfList",
 *             config: {
 *                currentData: {
 *                   items: [
 *                      { name: "one" }, { name: "two" }, { name: "three" }
 *                   ]
 *                },
 *                widgets: [
 *                   {
 *                      name: "alfresco/lists/views/HtmlListView",
 *                      config: {
 *                         propertyToRender: "name"
 *                      }
 *                   }
 *                ]
 *             }
 *          }
 *       ],
 *       widgetsForFooter: [
 *          {
 *             name: "alfresco/menus/AlfMenuBar",
 *             config: {
 *                popupMenusAbove: true,
 *                widgets: [
 *                   {
 *                      name: "alfresco/menus/AlfMenuBarItem",
 *                      config: {
 *                         label: "Menu item in footer"
 *                      }
 *                   }
 *                ]
 *             }
 *          }
 *       ]
 *    }
 * }
 *
 * @module alfresco/layout/FixedHeaderFooter
 * @extends module:alfresco/core/ProcessWidgets
 * @author Martin Doyle
 * @author Dave Draper
 */
define(["alfresco/core/ProcessWidgets",
        "alfresco/core/ResizeMixin",
        "alfresco/layout/HeightMixin",
        "alfresco/layout/DynamicVisibilityResizingMixin",
        "dojo/_base/array",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/aspect",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/dom-style",
        "dojo/topic",
        "dojo/text!./templates/FixedHeaderFooter.html"],
        function(ProcessWidgets, ResizeMixin, HeightMixin, DynamicVisibilityResizingMixin, array, declare, lang, aspect, 
                 domClass, domConstruct, domStyle, topic, template) {

   return declare([ProcessWidgets, ResizeMixin, HeightMixin, DynamicVisibilityResizingMixin], {

      /**
       * The base class for the widget
       *
       * @instance
       * @type {string}
       * @default
       */
      baseClass: "alfresco-layout-FixedHeaderFooter",

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/FixedHeaderFooter.css"}]
       */
      cssRequirements: [{
         cssFile: "./css/FixedHeaderFooter.css"
      }],

      /**
       * If this widget is placed into a widget that has padding then this allowance can be configured which
       * will be substituted from the calculated height to take padding into account so that an outer scroll
       * bar is not required on the page. This defaults to 0 and has only been provided for potential 
       * convenience. This value will only be used on when [height]{@link module:alfresco/layout/FixedHeaderFooter#height}
       * is set to "auto" (which is also the default).
       *
       * @instance
       * @type {number}
       * @default
       * @deprecated Since 1.0.36 use [heightAdjustment]{@link module:alfresco/layout/HeightMixin#heightAdjustment} instead
       */
      autoHeightPaddingAllowance: 0,

      /**
       * The height of the widget (in CSS units). The default value is "auto" which means that the
       * height of the widget will automatically be set to take up the available space from its current
       * position to the bottom of the window or document (whichever is smallest) so that the entire
       * widget is visible on page load. If a percentage height is set it is imperative that the enclosing
       * DOM element has a fixed height (e.g. a value in pixels) otherwise the height will be calculated
       * as 0.
       *
       * @instance
       * @type {string}
       * @default
       * @deprecated Since 1.0.36 use [heightMode]{@link module:alfresco/layout/HeightMixin#heightMode} instead
       */
      height: "AUTO",

      /**
       * If this is configured to be true the the height of the widget will be reset as the browser window is resized.
       * This will only occur  when [height]{@link module:alfresco/layout/FixedHeaderFooter#height} is set to "auto" 
       * (which is also the default).
       *
       * @instance
       * @type {boolean}
       * @default
       */
      recalculateAutoHeightOnResize: true,

      /**
       * The HTML template to use for the widget.
       *
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * Run after widget has been created
       *
       * @instance
       */
      postCreate: function alfresco_layout_FixedHeaderFooter__postCreate() {
         // Get the details of the header and footer widgets that needs to iterate over looking
         // for visibility configuration topics to subscribe to...
         var widgets = [];
         if (this.widgetsForHeader && typeof this.widgetsForHeader.concat === "function")
         {
            widgets = this.widgetsForHeader.concat(widgets);
         }
         if (this.widgetsForFooter && typeof this.widgetsForFooter.concat === "function")
         {
            widgets = this.widgetsForFooter.concat(widgets);
         }
         this.visibilityRuleTopics = this.getVisibilityRuleTopics(widgets);

         // We need to potentially resize sometimes ... use these triggers
         this.alfSetupResizeSubscriptions(this.onResize, this);

         // This is to fix the fact that the FixedHeaderFooter didn't originally use the 
         // HeightMixin and was expecting a "height" rather than a "heightMode" attribute.
         // It was also expecting "auto" rather than "AUTO" so for backwards compatibility
         // we convert non-numeric values to be all uppercase.
         if (this.height !== "AUTO" && this.heightMode === "AUTO")
         {
            this.heightMode = this.height;
            if (typeof this.heightMode.toUpperCase === "function")
            {
               this.heightMode = this.heightMode.toUpperCase();
            }
         }
         if (this.autoHeightPaddingAllowance && !this.heightAdjustment)
         {
            this.heightAdjustment = this.autoHeightPaddingAllowance;
         }

         this.setHeight(this.domNode);

         // Add in the widgets
         this._doProcessWidgets([
            {
               widgets: this.widgetsForHeader,
               node: this.header
            }, 
            {
               widgets: this.widgets,
               node: this.content
            }, 
            {
               widgets: this.widgetsForFooter,
               node: this.footer
            }
         ]);

         // Do the resize
         this.onResize();
         this.alfPublishResizeEvent(this.domNode);

         // Setup the header resize listener
         this.own(this.addResizeListener(this.header));
      },

      /**
       * <p>Setup a listener that will call [alfPublishResizeEvent]{@link module:alfresco/core/ResizeMixin#alfPublishResizeEvent}
       * whenever a resize is detected in the header.</p>
       *
       * <p><strong>NOTE:</strong> This method is no longer called by the postCreate method, and will be removed in a future version</p>
       *
       * @instance
       * @since 1.0.41
       * @deprecated Since 1.0.42 - use [ResizeMixin.addResizeListener]{@link module:alfresco/core/ResizeMixin#addResizeListener} instead.
       */
      addHeaderResizeListener: function alfresco_layout_FixedHeaderFooter__addHeaderResizeListener() {
         this.addResizeListener(this.header, this.domNode);
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/core/CoreWidgetProcessing#allWidgetsProcessed}
       * to set up subscriptions for the [visibilityRuleTopics]{@link module:alfresco/layout/DynamicVisibilityResizingMixin#visibilityRuleTopics}
       * that are returned by calling [getVisibilityRuleTopics]{@link module:alfresco/layout/DynamicVisibilityResizingMixin#getVisibilityRuleTopics}.
       * The subscriptions need to be created after the widgets have been created in order that their visibility 
       * is adjusted before the [onResize]{@link module:alfresco/layout/FixedHeaderFooter#onResize} function that is bound 
       * to is called.
       *
       * @instance
       * @param {object[]} widgets The widgets that have been created
       * @since 1.0.38
       */
      allWidgetsProcessed: function alfresco_layout_FixedHeaderFooter__allWidgetsProcessed(/*jshint unused:false*/ widgets) {
         this._allWidgetsProcessedCount--;
         if (this._allWidgetsProcessedCount === 0)
         {
            this.subscribeToVisibilityRuleTopics(this.onResize);
         }
      },

      /**
       * Call the processWidgets function for all provided widgets
       *
       * @instance
       * @param {object[]} widgetInfos The widget information as objects with 'widgets' and 'node' properties
       */
      _doProcessWidgets: function alfresco_layout_FixedHeaderFooter___doProcessWidgets(widgetInfos) {
         this._allWidgetsProcessedCount = widgetInfos.length;
         array.forEach(widgetInfos, function(widgetInfo) {
            var widgets = widgetInfo.widgets,
               node = widgetInfo.node;
            if (widgets && widgets.length) 
            {
               this.processWidgets(widgets, node);
            } 
            else 
            {
               domClass.add(node, "hidden");
            }
         }, this);
      },

      /**
       * Resize the header/content/footer containers so that the
       * content fits between the header and footer.
       *
       * @instance
       */
      onResize: function alfresco_layout_FixedHeaderFooter__onResize() {
         if (this.recalculateAutoHeightOnResize === true)
         {
            this.setHeight(this.domNode);
         }

         var widgetHeight = this.domNode.offsetHeight,
             headerHeight = this.header.offsetHeight,
             footerHeight = this.footer.offsetHeight;
         domStyle.set(this.content, {
            top: headerHeight + "px",
            height: (widgetHeight - headerHeight - footerHeight) + "px"
         });
      }
   });
});