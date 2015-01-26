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
 * This widget represents an input HTML element of type "file". It is used for selecting files
 * from the operating system, typically for the purpose of uploading. It is wrapped by the
 * [FileSelect]{@link module:alfresco/forms/controls/FileSelect} form control.
 * 
 * @module alfresco/html/FileInput
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/FileInput.html",
        "alfresco/core/Core"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore], {

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Label.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/FileInput.properties"}],
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/Label.css"}]
       */
      cssRequirements: [{cssFile:"./css/FileInput.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * The label to display.
       * 
       * @instance
       * @type {string}
       * @default "title.label"
       */
      label: "",

      /**
       * @instance
       */
      postMixinProperties: function alfresco_html_FileInput__postMixinProperties() {
         // No action
      },

      /**
       * This returns the files attribute of the input element
       *
       * @instance
       * @returns The files attribute of the input element
       */
      getValue: function alfresco_html_FileInput__getValue() {
         var value = [];
         var filesData = this.domNode.files;
         for (var i=0; i<filesData.length; i++)
         {
            value.push(filesData[i]);
         }
         return value;
      }
   });
});