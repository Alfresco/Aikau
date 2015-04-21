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
 * Use this widget to render a single cell within a [Row]{@link module:alfresco/lists/views/layouts/Row}
 * 
 * @module alfresco/lists/views/layouts/Cell
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Cell.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/dom-attr"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, CoreWidgetProcessing, domClass, domStyle, domAttr) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Cell.css"}]
       */
      cssRequirements: [{cssFile:"./css/Cell.css"}],
      
      /**
       * The HTML template to use for the widget.
       * 
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * Any additional CSS classes that should be applied to the rendered DOM element.
       *
       * @instance
       * @type {string}
       * @default  null
       */
      additionalCssClasses: null,

      /**
       * The number of columns that this cell should span. Defaults to null (indicating that
       * a colspan attribute will not be set on the rendered DOM element).
       *
       * @instance
       * @type {number}
       * @default null
       */
      colspan: null,

      /**
       * The width to set the cell. This should include units, e.g. "100px" for 100 pixels.
       *
       * @instance
       * @type {string}
       * @default
       */
      width: null,

      /**
       * Calls [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       * 
       * @instance postCreate
       */
      postCreate: function alfresco_lists_views_layouts_Cell__postCreate() {
         if (this.colspan)
         {
            domAttr.set(this.domNode, "colspan", this.colspan);
         }
         if (this.width)
         {
            domStyle.set(this.domNode, "width", this.width);
         }
         if(this.additionalCssClasses)
         {
            domClass.add(this.domNode, this.additionalCssClasses);
         }
         if (this.widgets)
         {
            this.processWidgets(this.widgets, this.containerNode);
         }
      }
   });
});