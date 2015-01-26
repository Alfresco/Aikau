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
 * This is a generic banner warning that can be used to display warning and error messages
 * to the user.
 * 
 * @module alfresco/header/Warning
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Warning.html",
        "alfresco/core/Core",
        "dojo/dom-style",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/dom-construct"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, domStyle, array, lang, domConstruct) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/LicenseWarning.css"}]
       */
      cssRequirements: [{cssFile:"./css/Warning.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * This should be set to an array of objects defined the warnings to be displayed.
       * Each object should contain a message and a severity level.
       *
       * @instance
       * @type {array}
       * @default null
       */
      warnings: null,

      /**
       * @instance
       */
      postCreate: function alfresco_header_Warning__postCreate() {
         if (this.warnings)
         {
            array.forEach(this.warnings, lang.hitch(this, this.addMessage));
            if (this.warnings.length > 0)
            {
               domStyle.set(this.domNode, "display", "block");
            }
         }
      },
      
      /**
       * Adds a message to be displayed
       *
       * @instance
       * @param {string} message The message to add
       * @param {number} index The index of the message
       * @param {number} level The severity of the message
       */
      addMessage: function alfresco_header_Warning__addMessage(item, index) {
         var outer = domConstruct.create("div", {
            "class": "info"
         }, this.warningsNode);
         domConstruct.create("span", {
            "class": "level" + item.level
         }, outer);
         domConstruct.create("span", {
            innerHTML: item.message
         }, outer);
      },
      
      /**
       * Adds a warning message.
       *
       * @instance
       * @param {string} warning The warning message to add
       * @param {number} index The index to add
       */
      addWarning: function alfresco_header_Warning__addWarning(warning, index) {
         this.addMessage({
            message: warning,
            index: index,
            level: 1
         });
      },
      
      /**
       * Adds an error message
       *
       * @instance
       * @param {string} error The error message to add
       * @param {number} index The index to add
       */
      addError: function alfresco_header_Warning__addError(error, index) {
         this.addMessage({
            message: error,
            index: index,
            level: 3
         });
      }
   });
});