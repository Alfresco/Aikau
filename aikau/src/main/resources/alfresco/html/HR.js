/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * This module provides a simple mechanism for creating HR elements on a page
 * to separate sections of content.
 *
 * @example <caption>Sample usage:</caption>
 * {
 *    name: "alfresco/html/HR",
 *    config: {
 *       style: "background-color: #f00; margin: 20px 10px;"
 *    }
 * }
 *
 * @module alfresco/html/HR
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @author Martin Doyle
 */
define(["dojo/_base/declare",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetBase", 
        "dojo/text!./templates/HR.html"], 
        function(declare, _TemplatedMixin, _WidgetBase, template) {
   
   return declare([_WidgetBase, _TemplatedMixin], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/HR.css"}]
       */
      cssRequirements: [{cssFile:"./css/HR.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * Any optional style rules to be applied to the HR
       *
       * @type {String}
       * @default 
       */
      style: null,

      /**
       * Run after widget has been created
       *
       * @instance
       */
      postCreate: function(){
         this.inherited(arguments);
         if(this.style) {
            this.domNode.style = this.style;
         }
      }
   });
});