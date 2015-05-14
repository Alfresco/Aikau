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
 * A layout control used to provide a scrollable central area with fixed-position header/footer widgets.
 *
 * @example <caption>Sample configuration:</caption>
 * {
 *    name: "alfresco/layout/FixedHeaderFooter",
 *    config: {
 *       height: "300px",
 *       widgetsForHeader: [
 *          {
 *             name: "alfresco/logo/Logo"
 *          }
 *       ],
 *       widgets: [
 *          {
 *             name: "alfresco/logo/Logo"
 *          },
 *          {
 *             name: "alfresco/logo/Logo"
 *          },
 *          {
 *             name: "alfresco/logo/Logo"
 *          },
 *          {
 *             name: "alfresco/logo/Logo"
 *          },
 *          {
 *             name: "alfresco/logo/Logo"
 *          }
 *       ],
 *       widgetsForFooter: [
 *          {
 *             name: "alfresco/logo/Logo"
 *          }
 *       ]
 *    }
 * }
 *
 * @module alfresco/layout/FixedHeaderFooter
 * @extends module:alfresco/core/ProcessWidgets
 * @author Martin Doyle
 */
define(["alfresco/core/ProcessWidgets",
      "alfresco/core/ResizeMixin",
      "dojo/_base/array",
      "dojo/_base/declare",
      "dojo/_base/lang",
      "dojo/aspect",
      "dojo/dom-class",
      "dojo/dom-construct",
      "dojo/dom-style",
      "dojo/topic",
      "dojo/text!./templates/FixedHeaderFooter.html"
   ],
   function(ProcessWidgets, ResizeMixin, array, declare, lang, aspect, domClass, domConstruct, domStyle, topic, template) {

      return declare([ProcessWidgets, ResizeMixin], {

         /**
          * The base class for the widget
          *
          * @instance
          * @override
          * @type {string}
          * @default "alfresco-layout-FixedHeaderFooter"
          */
         baseClass: "alfresco-layout-FixedHeaderFooter",

         /**
          * An array of the CSS files to use with this widget.
          *
          * @instance
          * @override
          * @type {object[]}
          * @default [{cssFile:"./css/FixedHeaderFooter.css"}]
          */
         cssRequirements: [{
            cssFile: "./css/FixedHeaderFooter.css"
         }],

         /**
          * The height of the widget (in CSS units)
          *
          * @type {string}
          * @default "100%"
          */
         height: "100%",

         /**
          * The HTML template to use for the widget.
          *
          * @instance
          * @override
          * @type {String}
          */
         templateString: template,

         /**
          * How many ms to wait after the last publish before triggering a resize check
          *
          * @type {number}
          */
         _publishDebounceMs: 500,

         /**
          * The timeout pointer that's set/cleared during the publish debouncing
          *
          * @type {object}
          */
         _publishDebounceTimeout: null,

         /**
          * Run after widget has been created
          *
          * @instance
          * @override
          */
         postCreate: function alfresco_layout_FixedHeaderFooter__postCreate() {

            // We need to potentially resize sometimes ... use these triggers
            this.alfSetupResizeSubscriptions(this._triggerResizeCheck, this);
            aspect.after(topic, "publish", lang.hitch(this, function(originalReturnValue) {
               this._triggerResizeCheck();
               return originalReturnValue;
            }));

            // Set the height of the dom node
            domStyle.set(this.domNode, {
               height: this.height
            });

            // Add in the widgets
            this._doProcessWidgets([{
               widgets: this.widgetsForHeader,
               node: this.header
            }, {
               widgets: this.widgets,
               node: this.content
            }, {
               widgets: this.widgetsForFooter,
               node: this.footer
            }]);

            // Do the resize
            this._resize();
         },

         /**
          * Call the processWidgets function for all provided widgets
          *
          * @instance
          * @param    {object[]} widgetInfos The widget information as objects with 'widgets' and 'node' properties
          */
         _doProcessWidgets: function(widgetInfos) {
            array.forEach(widgetInfos, function(widgetInfo) {
               var widgets = widgetInfo.widgets,
                  node = widgetInfo.node;
               if (widgets && widgets.length) {
                  this.processWidgets(widgets, node);
               } else {
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
         _resize: function alfresco_layout_FixedHeaderFooter___resize() {
            var widgetHeight = this.domNode.offsetHeight,
               headerHeight = this.header.offsetHeight,
               footerHeight = this.footer.offsetHeight;
            domStyle.set(this.content, {
               top: headerHeight + "px",
               height: (widgetHeight - headerHeight - footerHeight) + "px"
            });
         },

         /**
          * This function is called when a resize check is required, but debounces
          * the actual call for browser performance reasons.
          *
          * @instance
          */
         _triggerResizeCheck: function alfresco_layout_FixedHeaderFooter___triggerResizeCheck() {
            clearTimeout(this._publishDebounceTimeout);
            this._publishDebounceTimeout = setTimeout(lang.hitch(this, this._resize), this._publishDebounceMs);
         }
      });
   });