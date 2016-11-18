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
 * This layout widget allows widget models to be aligned to either the left or the right. Up until Aikau 1.0.36
 * this was achieved by including an "align" attribute in each widget configured to be either "left" or "right".
 * However, since Aikau 1.0.36 the [widgetsRight]{@link module:alfresco/layout/LeftAndRight#widgetsRight} and
 * [widgetsLeft]{@link module:alfresco/layout/LeftAndRight#widgetsLeft} configuration attributes should be used
 * instead.
 *
 * @example <caption>This is an example configuration:</caption>
 * {
 *   name: "alfresco/layout/LeftAndRight",
 *   config: {
 *     widgetsLeft: [
 *        {
 *           name: "alfresco/logo/Logo",
 *           config: {
 *              logoClasses: "surf-logo-small"
 *           }
 *        }
 *     ],
 *     widgetsRight: [
 *        {
 *           name: "alfresco/logo/Logo",
 *           config: {
 *              logoClasses: "alfresco-logo-only"
 *           }
 *        }
 *     ]
 *   }
 * }
 * 
 * @module alfresco/layouts/LeftAndRight
 * @extends module:alfresco/core/ProcessWidgets
 * @mixes module:alfresco/accessibility/_SemanticWrapperMixin
 * @author Dave Draper
 * @author Richard Smith
 */
define(["dojo/_base/declare",
        "alfresco/core/ProcessWidgets",
        "alfresco/accessibility/_SemanticWrapperMixin",
        "dojo/text!./templates/LeftAndRight.html",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/_base/array"], 
        function(declare, ProcessWidgets, _SemanticWrapperMixin, template, domConstruct, domClass, array) {
   
   return declare([ProcessWidgets, _SemanticWrapperMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/LeftAndRight.css"}]
       */
      cssRequirements: [{cssFile:"./css/LeftAndRight.css"},
                        {cssFile:"./css/HorizontalWidgets.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * The widgets model to align to the right.
       * 
       * @instance
       * @type {object[]}
       * @default
       * @since 1.0.36
       */
      widgetsRight: null,

      /**
       * The widgets model to align to the left.
       * 
       * @instance
       * @type {object[]}
       * @default
       * @since 1.0.36
       */
      widgetsLeft: null,

      /**
       * Iterates through the array of widgets to be created and creates the appropriate DOM node based
       * on the "align" attribute of the widget configuration. 
       * 
       * @instance
       */
      postCreate: function alfresco_layout_LeftAndRight__postCreate() {
         domClass.add(this.domNode, this.additionalCssClasses || "");
         if (!this.widgetsRight && 
             !this.widgetsLeft &&
              this.widgets)
         {
            this.widgetsRight = array.filter(this.widgets, function(widget) {
               return widget.align === "right";
            });
            this.widgetsLeft = array.filter(this.widgets, function(widget) {
               return widget.align !== "right";
            });
         }
         // We need to reverse the order of RIGHT widgets so that the last widget is defined is furthest
         // to the RIGHT
         this.widgetsRight && this.widgetsRight.reverse();
         this.widgetsRight && this.processWidgets(this.widgetsRight, this.rightWidgets, "RIGHT");
         this.widgetsLeft && this.processWidgets(this.widgetsLeft, this.leftWidgets, "LEFT");

         // Create a semantic wrapper if required
         if(this.semanticWrapper)
         {
            this.generateSemanticWrapper(this.parentNode, this.containerNode);
         }
      }
   });
});