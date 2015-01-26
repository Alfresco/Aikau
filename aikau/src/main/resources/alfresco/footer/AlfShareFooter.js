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
 * This module is intended to be placed as the sole widget in the [AlfStickyFooter]{@link module:alfresco/footer/AlfStickyFooter}
 * widget for all Alfresco Share pages. It renders the appropriate logo, license and copyright text for the currently applied
 * license.
 *
 * @module alfresco/footer/AlfShareFooter
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "alfresco/accessibility/_SemanticWrapperMixin",
        "dojo/text!./templates/AlfShareFooter.html",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dojo/dom-construct"], 
        function(declare, _WidgetBase, _TemplatedMixin, _SemanticWrapperMixin, template, AlfCore, lang, domClass) {
   
   return declare([_WidgetBase, _TemplatedMixin, _SemanticWrapperMixin, AlfCore], {

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfStickyFooter.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfShareFooter.properties"}],
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/AlfShareFooter.css"},{cssFile:"/modules/about-share.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfShareFooter.css"},
                        {cssFile:"/modules/about-share.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * The footer widget still uses the legacy Share code for rendering the "About" dialog box.
       * @instance
       * @type {array}
       */
      nonAmdDependencies: ["/js/yui-common.js",
                           "/js/alfresco.js",
                           "/modules/about-share.js"],

      /**
       * The license label that will be displayed
       *
       * @instance
       * @type {string}
       * @default null
       */
      licenseLabel: null,

      /**
       * @instance
       */
      postMixInProperties: function alfresco_footer_AlfShareFooter__postMixInProperties() {

         // Set the 'licensed to' label
         this.licensedToLabel = this.message("label.licensedTo");

         // Get the correct license if available
         if (this.licenseLabel != null && lang.trim(this.licenseLabel) != "" && this.licenseLabel != "UNKNOWN")
         {
            this.licenseLabel = this.message(this.licenseLabel);
         }
         else
         {
            this.licenseLabel = "";
         }

         // Set the appropriate copyright label
         if (this.copyrightLabel != null && lang.trim(this.copyrightLabel) != "")
         {
            this.copyrightLabel = this.message(this.copyrightLabel);
         }
         else
         {
             this.copyrightLabel = this.message("label.copyright");
         }

         // Set the appropriate alt-text for the logo image
         if (this.altText != null && lang.trim(this.altText) != "")
         {
            this.altText = this.message(this.altText);
         }
         else
         {
            // Note: intentionally not translated (nothing to translate!)
            this.altText = "Alfresco Community";
         }

         // Select the correct logo image - use the default if none is provided
         if (this.logoImageSrc == null)
         {
            this.logoImageSrc = "alfresco-share-logo.png";
         }
         if (this.logoImageSrc == "alfresco-share-logo-enterprise.png" ||
             this.logoImageSrc == "alfresco-share-logo-team.png" ||
             this.logoImageSrc == "alfresco-share-logo.png")
         {
            this.logoImageSrc = require.toUrl("alfresco/footer") + "/css/images/" + this.logoImageSrc;
         }
         else
         {
            this.logoImageSrc = this.logoImageSrc;
         }
      },
      
      /**
       * @instance
       */
      postCreate: function alfresco_footer_AlfShareFooter__postCreate() {

         // Set a basic footer class
         domClass.add(this.footerParentNode, "footer");

         // Set the appropriate css class
         if (this.cssClass != null && lang.trim(this.cssClass) != "")
         {
            domClass.add(this.footerParentNode, this.cssClass);
         }
         else
         {
            domClass.add(this.footerParentNode, "footer-com");
         }

         // Hide the license label if not available
         if (this.licenseLabel == null || lang.trim(this.licenseLabel) == "" || this.licenseLabel == "UNKNOWN")
         {
            domClass.add(this.licenseHolderNode, "hidden");
         }

         // Create a semantic wrapper if required
         if(this.semanticWrapper)
         {
            this.generateSemanticWrapper(this.footerParentNode, this.footerContainerNode);
         }
      }
   });
});
