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
 * <p>Extends the [alfresco/html/Image]{@link module:alfresco/html/Image} widget to
 * provide backwards compatibility (the recommendation would be to use the Image
 * widget instead now), and also adds custom CSS that makes this directly applicable
 * to dropping into Share.</p>
 * 
 * @module alfresco/logo/Logo
 * @extends module:alfresco/html/Image
 * @author Dave Draper
 * @author Martin Doyle
 */
define(["alfresco/enums/urlTypes", 
        "alfresco/html/Image", 
        "dojo/_base/declare", 
        "dojo/dom-class"], 
        function(urlTypes, Image, declare, domClass) {

   return declare([Image], {

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Logo.properties"}]
       */
      i18nRequirements: [{
         i18nFile: "./i18n/Logo.properties"
      }],

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Logo.css"}]
       */
      cssRequirements: [{
         cssFile: "./css/Logo.css"
      }],

      /**
       * Some alt text for the logo image.
       *
       * @instance
       * @type {string}
       * @default
       */
      altText: "logo.alt.text",

      /**
       * The CSS class or classes to use to generate the logo
       *
       * @instance
       * @override
       * @type {string} 
       * @default
       */
      classes: "alfresco-logo-large",

      /**
       * Overrides the [inherited property]{@link module:alfresco/html/Image#isBlockElem} to
       * retain the default block-level styling of the Logo widget.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      isBlockElem: true,

      /**
       * The CSS class or classes to use to generate the logo (while this property exists, it
       * takes priority over the classes property)
       * 
       * @instance
       * @type {string} 
       * @default
       * @deprecated since 1.0.41 Use [classes]{@link module:alfresco/logo/Logo#classes} instead
       */
      logoClasses: null,

      /**
       * The logo src (while this property exists, it takes priority over the src property)
       * 
       * @instance
       * @type {string} 
       * @default
       * @deprecated since 1.0.41 Use [src]{@link module:alfresco/logo/Logo#src} instead
       */
      logoSrc: null,

      /**
       * The logo src
       * 
       * @instance
       * @override
       * @type {string} 
       * @default
       */
      src: null,

      /**
       * Override the [inherited value]{@link module:alfresco/html/Image#srcType} because
       * logo src has historically been the full path.
       *
       * @instance
       * @type {string}
       * @default {@link module:alfresco/enums/urlTypes#FULL_PATH}
       */
      srcType: urlTypes.FULL_PATH,

      /**
       * Called after properties have been mixed into this instance.
       *
       * @instance
       * @override
       * @since 1.0.41
       */
      postMixInProperties: function alfresco_logo_Logo__postMixInProperties() {
         if (this.logoClasses) {
            this.classes = this.logoClasses;
         }
         if (this.logoSrc) {
            this.src = this.logoSrc;
         }
         this.inherited(arguments); // At end of func because inherited func uses this.src
      },

      /**
       * Called after widget created (but child widgets may not have been).
       *
       * @instance
       * @override
       * @since  1.0.41
       */
      postCreate: function alfresco_logo_Logo__postCreate() {
         domClass.add(this.domNode, "alfresco-logo-Logo");
         this.inherited(arguments);
      }
   });
});