/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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
 * This module provides a simple mechanism of creating additional white space between widgets.
 * It will just create a DIV element of the supplied dimensions but you can additional provide
 * CSS classes to add to the element to apply further styling.
 *
 * @module alfresco/html/Spacer
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Spacer.html",
        "alfresco/core/Core",
        "dojo/dom-class",
        "dojo/dom-style"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, domClass, domStyle) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/Spacer.css"}]
       */
      cssRequirements: [{cssFile:"./css/Spacer.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * The height to set.
       * 
       * @instance
       * @type {string}
       * @default null
       */
      height: null,

      /**
       * The width to set.
       * 
       * @instance
       * @type {string}
       * @default null
       */
      width: null,

      /**
       * Any additional classes to add. Some classes have been included with this widget, these are:
       * <ul><li>"top-border-beyond-gutters" - used to create a full width border commonly used under
       * the title bar</li></ul>
       * 
       * @instance
       * @type {string}
       * @default null
       */
      additionalCssClasses: null,

      /**
       * 
       * @instance
       */
      postCreate: function alfresco_html_Spacer__postCreate() {
         if (this.additionalCssClasses != null)
         {
            domClass.add(this.domNode, this.additionalCssClasses);
         }

         if (this.height != null)
         {
            domStyle.set(this.domNode, "height", this.height);
         }
         if (this.width != null)
         {
            domStyle.set(this.domNode, "width", this.height);
         }
      }
   });
});