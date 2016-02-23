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
 * This is a proof-of-concept widget introduced in version 1.0.56 that can be used to render SVG images from externally
 * loaded source files. In future releases a full-suite of icons will be made available out-of-the-box but for the 
 * current version there are only two icons defined and they are not guaranteed to remain available in future releases
 * until the final icon suite has been determined.
 * 
 * @module alfresco/html/SVGImage
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 * @since 1.0.56
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_OnDijitClickMixin",
        "dojo/text!./templates/SVGImage.html",
        "alfresco/renderers/_PublishPayloadMixin",
        "alfresco/core/Core",
        "svg4everybody",
        "dojo/dom-attr",
        "dojo/dom-class",
        "dojo/dom-style"], 
        function(declare, _WidgetBase, _TemplatedMixin, _OnDijitClickMixin, template, _PublishPayloadMixin, AlfCore, 
                 svg4everybody, domAttr, domClass, domStyle) {
   
   return declare([_WidgetBase, _TemplatedMixin, _OnDijitClickMixin, _PublishPayloadMixin, AlfCore], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/SVGImage.css"}]
       */
      cssRequirements: [{cssFile:"./css/SVGImage.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * For accessibility reasons it makes sense to describe what the image looks like. This is particularly important
       * for the visually impaired.
       * 
       * @instance
       * @type {string}
       * @default
       */
      description: "",

      /**
       * The height of the image. This can have any value of units provided, but if no units are set then "px" will
       * be assumed.
       * 
       * @instance
       * @type {string}
       * @default
       */
      height: null,

      /**
       * An external source file can be specified that will load the asynchronously load the SVG data for rendering
       * an image. This source file should have one or more <symbol> elements defined in it. The source file is 
       * expected to start with an AMD package name (e.g. "alfresco/html/svg/core.svg").
       * 
       * @instance
       * @type {string}
       * @default
       */
      source: null,

      /**
       * This is the identifier of the SVG <symbol> element to render.
       *
       * @instance
       * @type {string}
       * @default
       */
      symbolId: null,

      /**
       * 
       * @instance
       */
      postMixInProperties: function alfresco_html_SVGImage__postMixInProperties() {
         // Ensure that the title and description are localized...
         this.description = this.message(this.description);
         this.title = this.message(this.title);

         // Handle the creation of the actual SVG content...
         if (this.symbolId)
         {
            if (this.source)
            {
               this.svg = require.toUrl(this.source) + "#" + this.symbolId;
            }
            else
            {
               this.svg = require.toUrl("alfresco/html/svg/core.svg") + "#" + this.symbolId;
            }
         }
         else
         {
            this.alfLog("warn", "No 'symbolId' was provided so no SVG image could be rendered", this);
         }
      },

      /**
       * 
       * @instance
       */
      postCreate: function alfresco_html_SVGImage__postCreate() {
         if (this.publishTopic)
         {
            // If a publishTopic is provided then this is an actionable image, therefore we need
            // to ensure that it has the appropriate role and that it has the appropriate mouse cursor...
            domClass.add(this.domNode, "alfresco-html-SVGImage--clickable");
            domAttr.set(this.domNode, {
               "tabIndex": 0,
               "role": "button"
            });
         }
         else
         {
            // If not publishTopic is provided then it can be assumed that this image is for presentation
            // purpose only...
            domAttr.set(this.domNode, "role", "presentation");
         }

         domStyle.set(this.svgNode, {
            "height": this.processDimension(this.height),
            "width": this.processDimension(this.width)
         });
      },

      /**
       * 
       * @instance
       * @param  {string|number} value The value to process.
       * @return {strung} The processed value.
       */
      processDimension: function alfresco_html_SVGImage__setDimension(value) {
         if (value)
         {
            if (isNaN(value))
            {
               // Value is NOT a number, so assume measurement of units provided.
            }
            else
            {
               value += "px";
            }
         }
         return value;
      },

      /**
       * Called when the user clicks on the SVG image. 
       *
       * @instance
       * @param {object} evt The click event object
       */
      onClick: function alfresco_renderers_PublishAction__onClick(/*jshint unused:false*/ evt) {
         if (this.publishTopic)
         {
            this.publishPayload = this.getGeneratedPayload();
            this.alfPublish(this.publishTopic, this.publishPayload, !!this.publishGlobal, !!this.publishToParent);
         }
      }
   });
});