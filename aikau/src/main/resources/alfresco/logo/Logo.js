/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * Displays an image typically used as an application logo. Provides a number of Alfresco and
 * Surf logos out-of-the-box but can be configured with a specific URL to render any image.
 * 
 * @module alfresco/logo/Logo
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Logo.html",
        "alfresco/core/Core",
        "dojo/dom-construct",
        "dojo/dom-style",
        "dojo/dom-class"], 
        function(declare, _Widget, _Templated, template, Core, domConstruct, domStyle, domClass) {
   
   return declare([_Widget, _Templated, Core], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Logo.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/Logo.properties"}],
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Logo.css"}]
       */
      cssRequirements: [{cssFile:"./css/Logo.css"}],

      /**
       * The CSS class or classes to use to generate the logo
       * @instance
       * @type {string} 
       * @default "alfresco-logo-large"
       */
      logoClasses: "alfresco-logo-large",
      
      /**
       * @instance
       * @type {string} 
       */
      logoSrc: null,

      /**
       * 
       * @instance
       * @type {string}
       * @default "display: none;"
       */
      cssNodeStyle: "display: none;",
      
      /**
       * 
       * @instance
       * @type {string}
       * @default "display: none;"
       */
      imgNodeStyle: "display: none;",
         
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * Some alt text for the logo image.
       *
       * @instance
       * @type {string}
       * @default "logo.alt.text"
       */
      altText: "logo.alt.text",

      /**
       * This controls whether or not the image is rendered with the img element or the div in the template.
       * The default it to use the div because it is controlled via CSS which allows for finer control over the
       * dimensions of the displayed logo. When using the img element the dimensions will be those of the supplied
       * image. 
       * 
       * @instance
       */
      buildRendering: function alfresco_logo_Logo__buildRendering() {
         this.altText = this.encodeHTML(this.message(this.altText));
         if (this.logoSrc)
         {
            this.imgNodeStyle = "display: block;";
         }
         else
         {
            this.cssNodeStyle = "display: block";
         }
         this.inherited(arguments);
      }
   });
});