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
 * @mixes module:alfresco/core/_PublishOrLinkMixin
 * @author Martin Doyle
 * @since 1.0.41
 */
define(["alfresco/core/_PublishOrLinkMixin", 
        "alfresco/enums/urlTypes", 
        "alfresco/util/urlUtils",
        "dijit/_TemplatedMixin", 
        "dijit/_WidgetBase", 
        "dojo/_base/declare", 
        "dojo/_base/lang", 
        "dojo/Deferred", 
        "dojo/dom-class", 
        "dojo/dom-style", 
        "dojo/text!./templates/Image.html"], 
        function(_PublishOrLinkMixin, urlTypes, urlUtils, _TemplatedMixin, _WidgetBase, declare, lang, Deferred, domClass, domStyle, template) {

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
       * <p>Whether to enable advanced image natural-size retrieval. If set to false then
       * image natural-size retrieval is only available for modern browsers and for
       * "foreground" images only (i.e. ones specified by src, not background-image
       * property).</p>
       * 
       * <p>By setting this to true, the natural-size of foreground images
       * in IE8 will be enabled, and also the calculation of background images'
       * natural sizes, meaning the widget will be auto-sized according to the size
       * of the background-image, however this will introduce an asynchronous
       * process that will cause the widget to mark itself as "ready" prior to the
       * resizing being completed. This will not be discernable to an end-user, but
       * could affect any programmatic inspection of the image.</p>
       *
       * @instance
       * @type {boolean}
       * @default
       */
      advancedSizeRetrieval: false,

      /**
       * Alt text for the image. This will be encoded and checked against i18n property bundles.
       *
       * @instance
       * @type {string}
       * @default
       */
      altText: null,

      /**
       * <p>An optional aspect ratio that will be used if only one of [width]{@link module:alfresco/html/Image#width}
       * or [height]{@link module:alfresco/html/Image#height} has been specified. This is specified as a floating
       * point number as a ratio to 1.</p>
       *
       * <p>Example from Wikipedia: "Two common videographic aspect ratios are 4:3 (1.33:1), the universal video
       * format of the 20th century, and 16:9 (1.77:1), universal for high-definition television and European digital
       * television". So, the value in these two examples would be 1.33 and 1.77 respectively.</p>
       *
       * @instance
       * @type {number?}
       * @default
       */
      aspectRatio: null,

      /**
       * Any optional classes to be added to the wrapped image element. If a
       * [src]{@link module:alfresco/html/Image#src} property is provided then
       * this property will not be used.
       *
       * @instance
       * @type {string|string[]}
       * @default
       */
      classes: null,

      /**
       * Short-hand property for setting both width and height simultaneously. This
       * will override any individual width/height property setting.
       *
       * @instance
       * @type {object}
       * @property {number} [w] Width
       * @property {number} [h] Height
       * @default
       */
      dimensions: null,

      /**
       * If we can get no other sizes, then rather than having a zero-by-zero image,
       * make it square using this value (treated as pixels).
       *
       * @instance
       * @type {number}
       * @default
       */
      fallbackImageDimensions: 50,

      /**
       * An optional CSS height to apply to the image node in pixels. If height
       * is specified without width then the other will be calculated using the
       * aspectRatio property, or the calculated naturalAspectRatio if not
       * specified.
       *
       * @instance
       * @type {number}
       * @default
       */
      height: 0,

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
       * <p>This will be set to the natural aspect-ratio of the displayed image. This
       * is specified as a floating point number as a ratio to 1.</p>
       *
       * <p>Example from Wikipedia: "Two common videographic aspect ratios are 4:3 (1.33:1),
       * the universal video format of the 20th century, and 16:9 (1.77:1), universal for
       * high-definition television and European digital television". So, the value in
       * these two examples would be 1.33 and 1.77 respectively.</p>
       *
       * @instance
       * @type {number}
       * @readonly
       * @default
       */
      naturalAspectRatio: 0,

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
       * [srcType]{@link module:alfresco/html/Image#srcType} property). If a src
       * is provided, then the [classes]{@link module:alfresco/html/Image#classes}
       * property will not be used.
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
       * We want to set a maximum time for waiting for the widget to be attached to
       * the DOM before trying to setup the widget.
       *
       * @instance
       * @type {number}
       * @default
       */
      timeForDomAttach: 5000,

      /**
       * An optional CSS width to apply to the image node in pixels. If width is
       * specified without height then the other will be calculated using the
       * aspectRatio property, or the calculated naturalAspectRatio if not specified.
       *
       * @instance
       * @type {number}
       * @default
       */
      width: 0,

      /**
       * In order to ensure we don't try forever to setup this widget when it's not
       * being attached to the DOM, note when we first retry the setup.
       *
       * @instance
       * @type {number?}
       */
      _firstAttemptedSetup: null,

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

         // It's possible to provide a dimensions object, so use this if available
         if (this.dimensions) {
            this.width = this.dimensions.w || null;
            this.height = this.dimensions.h || null;
         }

         // Update the src according to the srcType
         this.src = urlUtils.convertUrl(this.src, this.srcType);
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

         // Set the alt attribute value (the JS will make it "safe" automatically)
         if (this.altText) {
            this.imageNode.setAttribute("alt", this.message(this.altText));
         }

         // Add any image classes (but only if no src provided)
         if (this.classes && !this.src) {
            domClass.add(this.imageNode, this.classes);
         }

         // Add "block state"
         if (this.isBlockElem) {
            domClass.add(this.domNode, "alfresco-html-Image--block");
         }

         // Setup the image node (sizing, etc)
         this.setupImageNode();
      },

      /**
       * Prepare the image node
       *
       * @instance
       */
      setupImageNode: function alfresco_html_Image__setupImageNode() {

         // The image-node setup will only work if attached to the DOM, so try again later if necessary
         var nextParent = this.domNode,
            isAttached;
         while((nextParent = nextParent.parentNode) && !isAttached) {
            isAttached = (nextParent === document.body);
         }
         if(!isAttached) {

            // We can't let this run forever, so break out if necessary
            if(!this._firstAttemptedSetup) {
               this._firstAttemptedSetup = Date.now();
            }
            if(Date.now() - this._firstAttemptedSetup < this.timeForDomAttach) {
               setTimeout(lang.hitch(this, this.setupImageNode), 200);
               return;
            }
         }

         // No configured src, so set to blank.gif if a background image is present
         if (!this.src) {
            if (this._getBackgroundImageUrl()) {
               this.imageNode.src = urlUtils.convertUrl(this.pathToBlankGif, urlTypes.REQUIRE_PATH);
            } else {
               this.imageNode.src = this.src;
            }
         }

         // Resize the image node
         if (this.advancedSizeRetrieval) {
            domClass.add(this.domNode, "alfresco-html-Image--advanced-sizing");
            this._updateNaturalDimensions(true).then(lang.hitch(this, this.resize));
         } else {
            this._updateNaturalDimensions();
            this.resize();
         }
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
      getNaturalImageSize: function alfresco_html_Image__getNaturalImageSize() {
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
         /*jshint maxcomplexity:false*/

         // Use configured width/height first
         if ((this.width || this.height) && !forceNatural) {

            // Fill in any missing values (defaults to square if no aspect ratios
            // because could not determine natural dimensions)
            var aspectRatio = this.aspectRatio || this.naturalAspectRatio || 1;
            if (!this.height) {
               this.height = this.width / aspectRatio;
            } else if (!this.width) {
               this.width = this.height * aspectRatio;
            }

            // Just style according to whichever dimension(s) we have
            domStyle.set(this.imageNode, {
               width: this.width + "px",
               height: this.height + "px"
            });

         } else {

            // Are there any CSS dimensions we should leave in-place
            var cssDimensions = this.getCssDimensions(),
               hasCssDimensions = cssDimensions.w || cssDimensions.h;

            // Do the resize only if no CSS dimensions or it's a normal self-sizing image, or if forceNatural is true
            if ((!hasCssDimensions && !this.src) || forceNatural) {

               // Use the natural dimensions if we have them (must have both, as an
               // image with zero width or zero height will not display at all)
               var w = this.naturalWidth,
                  h = this.naturalHeight;
               if (!w || !h) {
                  w = h = this.fallbackImageDimensions;
               }

               // Update the dimensions
               domStyle.set(this.imageNode, {
                  width: w + "px",
                  height: h + "px"
               });
            }
         }
      },

      /**
       * This function assumes that the naturalWidth/naturalHeight properties have already been set,
       * and calculates the resultant natural aspect-ratio, as a floating point ratio to 1.
       *
       * @instance
       */
      _calculateNaturalAspectRatio: function alfresco_html_Image___calculateNaturalAspectRatio() {
         try {
            this.naturalAspectRatio = this.naturalWidth / this.naturalHeight;
         } catch (e) {
            this.naturalAspectRatio = 0;
            this.alfLog("error", "Error calculating aspect ratio (naturalWidth=" + this.naturalWidth + ", naturalHeight=" + this.naturalHeight + ")");
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
       * @returns {external:dojo/promise/Promise} A promise that will resolve once dimensions are retrieved
       */
      _updateNaturalDimensions: function alfresco_html_Image___updateNaturalDimensions() {

         // Setup deferred object
         var useAsync = this.advancedSizeRetrieval,
            dfd = useAsync ? new Deferred() : null;

         // Will this be easy?
         if (this.naturalWidth) {

            // We already have the dimensions
            useAsync && dfd.resolve();

         } else if (this.src && this.imageNode.naturalWidth) {

            // In proper browsers, we have access to naturalWidth/naturalHeight properties
            this.naturalWidth = this.imageNode.naturalWidth;
            this.naturalHeight = this.imageNode.naturalHeight;
            useAsync && dfd.resolve();

         } else if (useAsync) {

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
               newImg.onabort = newImg.onerror = lang.hitch(this, function() {
                  this.alfLog("info", "Unable to load image with src \"" + imageSrc + "\"");
                  dfd.resolve();
               });
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

         // Pass back the promise if this is an async function
         if (useAsync) {
            return dfd.promise.then(lang.hitch(this, function() {
               this._calculateNaturalAspectRatio();
            }));
         } else {
            this._calculateNaturalAspectRatio();
         }
      }
   });
});