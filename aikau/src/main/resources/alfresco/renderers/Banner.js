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
 * @module alfresco/renderers/Banner
 * @extends module:aikau/core/BaseWidget
 * @mixes module:alfresco/renderers/_ItemLinkMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/core/BaseWidget",
        "alfresco/renderers/_ItemLinkMixin",
        "dojo/dom-class"], 
        function(declare, BaseWidget, _ItemLinkMixin, domClass) {

   return declare([BaseWidget, _ItemLinkMixin], {
      
      
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
       * The message to display in the banner
       * @instance
       * @type {string} 
       * @default
       */
      bannerMessage: "",
      
      /**
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.101
       */
      createWidgetDom: function alfresco_renderers_Banner__createWidgetDom() {
         this.bannerNode = this.domNode = document.createElement("span");
         this.domNode.classList.add("alfresco-renderers-Banner");
         this.domNode.classList.add("hidden");
         this.domNode.textContent = this.bannerMessage;
      },

      /**
       * Removes the "hidden" class if there is a message to render
       * 
       * @instance
       */
      postCreate: function alfresco_renderers_Banner__postCreate() {
         /*jshint eqnull:true*/
         if (this.bannerMessage != null && this.bannerMessage !== "")
         {
            domClass.remove(this.bannerNode, "hidden");
         }
      }
   });
});