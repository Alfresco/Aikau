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
 * @module alfresco/renderers/Banner
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/renderers/_ItemLinkMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Banner.html",
        "alfresco/core/Core",
        "alfresco/renderers/_ItemLinkMixin",
        "dojo/dom-class"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, _ItemLinkMixin, domClass) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore, _ItemLinkMixin], {
      
      
      /**
       * Declare the dependencies on "legacy" JS files that this is wrapping.
       * 
       * @instance
       */
      nonAmdDependencies: ["/yui/yahoo/yahoo.js",
                           "/js/alfresco.js"],
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Banner.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/Banner.properties"}],
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Banner.css"}]
       */
      cssRequirements: [{cssFile:"./css/Banner.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * The message to display in the banner
       * @instance
       * @type {string} 
       * @default ""
       */
      bannerMessage: "",
      
      /**
       * Removes the "hidden" class if there is a message to render
       * 
       * @instance
       */
      postCreate: function alfresco_renderers_Banner__postCreate() {
         if (this.bannerMessage != null && this.bannerMessage != "")
         {
            domClass.remove(this.bannerNode, "hidden");
         }
      }
   });
});