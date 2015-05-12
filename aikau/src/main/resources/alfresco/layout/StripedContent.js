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
 * A layout control used to provide "stripes" of content, where a full-width background contains a centred, fixed-width area of content.
 *
 * @example <caption>Sample configuration:</caption>
 * {
 *    name: "alfresco/layout/StripedContent",
 *    config: {
 *       contentWidth: "1200px", // Optional: Overrides default of "960px"
 *       widgets: [
 *          {
 *             name: "alfresco/logo/Logo",
 *             stripeClass: "header" // Optional: Current built-in classes are: "header","sub-header","menu"
 *          },
 *          {
 *             name: "alfresco/html/Label",
 *             stripeClass: "sub-header",
 *             config: {
 *                label: "This is the sub-header",
 *                additionalCssClasses: "bold"
 *             }
 *          },
 *          {
 *             name: "alfresco/html/Label",
 *             stripeClass: "menu",
 *             config: {
 *                label: "This is the menu row"
 *             }
 *          },
 *          {
 *             name: "alfresco/html/Label",
 *             stripeStyle: "background: #fee; padding: 30px 0;", // Optional
 *             config: {
 *                label: "Content goes here..."
 *             }
 *          }
 *       ]
 *    }
 * }
 *
 * @module alfresco/layout/StripedContent
 * @extends module:alfresco/core/ProcessWidgets
 * @author Martin Doyle
 */
define(["alfresco/core/ProcessWidgets",
      "dojo/_base/array",
      "dojo/_base/declare",
      "dojo/dom-class",
      "dojo/dom-construct"
   ],
   function(ProcessWidgets, array, declare, domClass, domConstruct) {

      return declare([ProcessWidgets], {

         /**
          * The base class for the widget
          *
          * @instance
          * @override
          * @type {string}
          * @default "alfresco-layout-StripedContent"
          */
         baseClass: "alfresco-layout-StripedContent",

         /**
          * The size of the fixed-content inside the stripe, as a CSS dimension
          *
          * @instance
          * @type {string}
          * @default "960px"
          */
         contentWidth: "960px",

         /**
          * An array of the CSS files to use with this widget.
          *
          * @instance
          * @override
          * @type {object[]}
          * @default [{cssFile:"./css/StripedContent.css"}]
          */
         cssRequirements: [{
            cssFile: "./css/StripedContent.css"
         }],

         /**
          * Creates a new DOM node for a widget to use. The DOM node contains a child <div> element
          * that the widget will be attached to and an outer <div> element that additional CSS classes
          * can be applied to.
          *
          * @instance
          * @override
          * @param {object} widgetConfig The widget definition to create the DOM node for
          * @param {element} rootNode The DOM node to create the new DOM node as a child of
          * @param {string} rootClassName A string containing one or more space separated CSS classes to set on the DOM node
          */
         createWidgetDomNode: function alfresco_core_CoreWidgetProcessing__createWidgetDomNode(widgetConfig, rootNode, /*jshint unused:false*/ rootClassName) {

            // Create the stripe node and a new node for the widget
            var stripeNode = domConstruct.create("div", {
                  className: this.baseClass + "__stripe",
                  style: widgetConfig.stripeStyle || ""
               }, rootNode),
               contentNode = domConstruct.create("div", {
                  className: this.baseClass + "__stripe__content",
                  style: {
                     maxWidth: this.contentWidth
                  }
               }, stripeNode);

            // Add custom CSS
            if (widgetConfig.stripeClass) {
               domClass.add(stripeNode, this.baseClass + "__stripe--" + widgetConfig.stripeClass);
            }

            // Pass back the widget node
            return domConstruct.create("div", {}, contentNode);
         }
      });
   });