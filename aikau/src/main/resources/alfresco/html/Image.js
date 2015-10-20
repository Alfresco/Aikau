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
 * This module provides a simple mechanism for creating image elements on a page. Additionally, it mixes
 * in the [_PublishOrLinkMixin]{@link module:alfresco/core/_PublishOrLinkMixin} class to provide support
 * for clicking to navigate or to publish a topic.
 *
 * @module alfresco/html/Image
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @author Martin Doyle
 */
define([
      "alfresco/core/_PublishOrLinkMixin",
      "alfresco/enums/urlTypes",
      "dijit/_TemplatedMixin",
      "dijit/_WidgetBase",
      "dojo/_base/declare",
      "dojo/_base/lang",
      "dojo/Deferred",
      "dojo/dom-class",
      "dojo/dom-style",
      "dojo/text!./templates/Image.html",
      "service/constants/Default"
   ],
   function(_PublishOrLinkMixin, urlTypes, _TemplatedMixin, _WidgetBase, declare, lang, Deferred, domClass, domStyle, template, AlfConstants) {

      return declare([_WidgetBase, _TemplatedMixin, _PublishOrLinkMixin], {

         /**
          * @instance
          * @typedef {object} Dimensions
          * @property {number} width The width property
          * @property {number} height The height property
          */

         /**
          * An array of the CSS files to use with this widget.
          * 
          * @instance
          * @type {object[]}
          * @default [{cssFile:"./css/Image.css"}]
          */
         cssRequirements: [{
            cssFile: "./css/Image.css"
         }],

         /**
          * The HTML template to use for the widget.
          * 
          * @instance
          * @override
          * @type {string}
          */
         templateString: template,

         /**
          * Any optional classes to be added to the wrapped image element.
          *
          * @instance
          * @type {string|string[]}
          * @default
          */
         classes: null,

         /**
          * Alt text for the image.
          *
          * @instance
          * @type {string}
          * @default
          */
         altText: null,

         /**
          * If we can get no other sizes, then rather than having a zero-by-zero image,
          * make it square using this value (treated as pixels).
          *
          * @instance
          * @type {number}
          * @default
          */
         defaultMinimumSize: 50,

         /**
          * An optional CSS height to apply to the image node (e.g. "10px" or "50%")
          *
          * @instance
          * @type {string}
          * @default
          */
         height: null,

         /**
          * Any optional style rules to be applied to the wrapped image element.
          *
          * @type {String}
          * @default 
          */
         imgStyle: null,

         /**
          * When set to true, the root node (and container of the image node) will be
          * set to be a block level element.
          *
          * @instance
          * @type {boolean}
          * @default
          */
         isBlockElem: false,

         /**
          * This will be set to the natural height of the displayed image.
          *
          * @instance
          * @type {number}
          * @readonly
          * @default
          */
         naturalHeight: 0,

         /**
          * This will be set to the natural width of the displayed image.
          *
          * @instance
          * @type {number}
          * @readonly
          * @default
          */
         naturalWidth: 0,

         /**
          * The path to the default blank gif, using the module pathing system
          *
          * @instance
          * @type {string}
          * @default
          */
         pathToBlankGif: "alfresco/css/images/blank.gif",

         /**
          * The URL of the image to use (this is used in conjunction with the
          * [srcType]{@link module:alfresco/html/Image#srcType} property).
          *
          * @instance
          * @type {string}
          * @default
          */
         src: null,

         /**
          * The type of URL to use (see [urlTypes]{@link module:alfresco/enums/urlTypes}
          * for possible values).
          *
          * @instance
          * @type {string}
          * @default {@link module:alfresco/enums/urlTypes#PAGE_RELATIVE}
          */
         srcType: urlTypes.PAGE_RELATIVE,

         /**
          * An optional CSS width to apply to the image node (e.g. "10px" or "50%")
          *
          * @instance
          * @type {string}
          * @default
          */
         width: null,

         /**
          * This is run after the config has been mixed into this instance.
          *
          * @instance
          * @override
          */
         postMixInProperties: function alfresco_html_Image__postMixInProperties() {
            this.inherited(arguments);

            // If this is being made into a link, try and make sure we have some "title" text
            if (this.targetUrl && !this.label) {
               this.label = this.altText;
            }

            // Encode the alt text, after checking for properties
            if (this.altText) {
               this.altText = this.encodeHTML(this.message(this.altText));
            }

            // If a src is specified, update it according to the srcType
            // NOTE: If anyone uses FULL or HASH, don't alter the src path
            if (this.src) {
               if (this.srcType === urlTypes.PAGE_RELATIVE) {
                  this.src = AlfConstants.URL_PAGECONTEXT + this.src.replace(/^\/+/, "");
               } else if (this.srcType === urlTypes.CONTEXT_RELATIVE) {
                  this.src = AlfConstants.URL_CONTEXT + this.src.replace(/^\/+/, "");
               }
            }
         },

         /**
          * This is run after the widget has been created, but before any sub-widgets
          * have finished being created.
          *
          * @instance
          * @override
          */
         postCreate: function alfresco_html_Image__postCreate() {
            this.inherited(arguments);

            // Add any image classes
            if (this.classes) {
               domClass.add(this.imageNode, this.classes);
            }

            // No configured src, so set to blank.gif if a background image is present
            if (!this.src) {
               if (this._getBackgroundImageUrl()) {
                  this.imageNode.src = require.toUrl(this.pathToBlankGif);
               } else {
                  this.imageNode.src = this.src;
               }
            }

            // Add "block state"
            if (this.isBlockElem) {
               domClass.add(this.domNode, "alfresco-html-Image--block");
            }

            // Resize the image node
            this.resize();
         },

         /**
          * <p>Get the CSS dimensions of the image node (will not differentiate between dimensions
          * specified in style attribute and those in a stylesheet). Unavailable and non-numeric
          * dimensions will be returned as 0.</p>
          *
          * <p><strong>NOTE:</strong> If no [src]{@link module:alfresco/html/Image#src} property
          * has been set, then this will be treated as if no image is present, and so will return
          * empty (zero) dimensions.</p>
          *
          * @instance
          * @returns {module:alfresco/html/Image#Dimensions} A dimensions object
          */
         getCssDimensions: function alfresco_html_Image__getCssDimensions() {
            var imageStyle = this.imageNode.currentStyle || getComputedStyle(this.imageNode), // IE8 || Proper Browser
               w = imageStyle.width,
               h = imageStyle.height;
            return {
               w: (w && parseInt(w, 10)) || 0,
               h: (h && parseInt(h, 10)) || 0
            };
         },

         /**
          * Get the natural size of the currently displayed image.
          *
          * @instance
          * @returns {external:dojo/promise/Promise} A promise that will resolve to a [dimensions]{@link module:alfresco/html/Image#Dimensions} object
          */
         getNaturalDimensions: function alfresco_html_Image__getNaturalDimensions() {
            return this._updateNaturalDimensions().then(lang.hitch(this, function() {
               return {
                  w: this.naturalWidth,
                  h: this.naturalHeight
               };
            }));
         },

         /**
          * Resize the image node based on (in priority order) the configured width/height
          * properties; the current CSS dimensions; or the image's natural width/height.
          *
          * @instance
          * @param {boolean} [forceNatural] Force usage of the image's natural dimensions
          */
         resize: function alfresco_html_Image__resize(forceNatural) {

            // Use configured width/height first
            if ((this.width || this.height) && !forceNatural) {

               // Just style according to whichever dimension(s) we have
               domStyle.set(this.imageNode, {
                  width: this.width || "auto",
                  height: this.height || "auto"
               })

            } else {

               // Are there any CSS dimensions we should leave in-place
               var cssDimensions = this.getCssDimensions(),
                  hasCssDimensions = cssDimensions.w || cssDimensions.h;

               // Do the resize only if no CSS dimensions, or if forceNatural is true
               if (!hasCssDimensions || forceNatural) {
                  this._updateNaturalDimensions().then(lang.hitch(this, function() {

                     // Use the natural dimensions, unless neither exist
                     var w = this.naturalWidth,
                        h = this.naturalHeight;
                     if (!w && !h) {
                        w = h = this.defaultMinimumSize;
                     }

                     // Update the dimensions
                     domStyle.set(this.imageNode, {
                        width: w + "px",
                        height: h + "px"
                     });
                  }));
               }
            }
         },

         /**
          * Get the URL of the background image, which is assumed to be a single image,
          * not surrounded by quotes (which would break in IE).
          *
          * @instance
          * @returns {string} The URL of the background image, or null if not available
          */
         _getBackgroundImageUrl: function alfresco_html_Image___getBackgroundImageUrl() {

            // Setup variables
            var url = null,
               urlRegex = /url\((.+)\)/,
               imageStyle = this.imageNode.currentStyle || getComputedStyle(this.imageNode), // IE8 || Proper Browser
               backgroundImage = imageStyle.backgroundImage,
               regexMatch;

            // If we have a background image property, extract the URL
            if (backgroundImage) {
               regexMatch = urlRegex.exec(backgroundImage);
               if (regexMatch) {
                  url = regexMatch[1];
               }
            }

            // Pass back the URL
            return url;
         },

         /**
          * Get the natural size of the currently displayed image.
          *
          * @instance
          * @param {boolean} [force] Whether to force retrieval if already present
          * @returns {external:dojo/promise/Promise} A promise that will resolve once dimensions are retrieved
          */
         _updateNaturalDimensions: function alfresco_html_Image___updateNaturalDimensions(force) {

            // Setup deferred object
            var dfd = new Deferred();

            // Will this be easy?
            if (this.naturalWidth && !force) {

               // We already have the dimensions
               dfd.resolve();

            } else if (this.src && this.imageNode.naturalWidth) {

               // In proper browsers, we have access to naturalWidth/naturalHeight properties
               this.naturalWidth = this.imageNode.naturalWidth;
               this.naturalHeight = this.imageNode.naturalHeight;
               dfd.resolve();

            } else {

               // Get the image src (and if we can't find one then there is no image)
               var imageSrc = this.src || this._getBackgroundImageUrl();
               if (imageSrc) {

                  // Create a new image and read the dimensions on-load
                  var newImg = new Image();
                  newImg.onload = lang.hitch(this, function() {
                     this.naturalWidth = newImg.width;
                     this.naturalHeight = newImg.height;
                     dfd.resolve();
                  });
                  newImg.onabort = newImg.onerror = function() {
                     console.error("Unable to load image!", arguments);
                  };
                  newImg.src = imageSrc; // NOTE: This must be done AFTER setting onload

                  // This prevents problems with cached images
                  if (newImg.complete || newImg.readyState === 4) {
                     newImg.onload();
                  }

               } else {

                  // No image, no dimensions
                  this.naturalWidth = 0;
                  this.naturalHeight = 0;
                  dfd.resolve();
               }
            }

            // Pass back the promise
            return dfd.promise;
         }
      });
   });