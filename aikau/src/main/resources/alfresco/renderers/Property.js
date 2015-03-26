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
 * Renders the value of a property found in the configured [currentItem]{@link module:alfresco/renderers/Property#currentItem}
 * attribute. The property that will be rendered is determined by the [propertyToRender]{@link module:alfresco/renderers/Property#propertyToRender}
 * attribute which should be defined in "dot-notation" format (e.g. "node.properties.cm:title"). This widget accepts a number
 * of different configuration options that control how the property is ultimately displayed.
 *
 * @module alfresco/renderers/Property
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/renderers/_JsNodeMixin
 * @mixes module:alfresco/renderers/_ItemLinkMixin
 * @mixes module:alfresco/core/ValueDisplayMapMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin", 
        "alfresco/renderers/_JsNodeMixin", 
        "alfresco/core/ValueDisplayMapMixin", 
        "alfresco/core/Core", 
        "dojo/text!./templates/Property.html", 
        "alfresco/core/ObjectTypeUtils", 
        "alfresco/core/UrlUtils", 
        "alfresco/core/TemporalUtils", 
        "dojo/_base/lang", 
        "dojo/dom-class", 
        "dojo/dom-style", 
        "dijit/Tooltip", 
        "dojo/on"], 
        function(declare, _WidgetBase, _TemplatedMixin, _JsNodeMixin, ValueDisplayMapMixin, AlfCore, template, 
            ObjectTypeUtils, UrlUtils, TemporalUtils, lang, domClass, domStyle, Tooltip, on) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore, _JsNodeMixin, ValueDisplayMapMixin, TemporalUtils], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Property.properties"}]
       */
      i18nRequirements: [{
         i18nFile: "./i18n/Property.properties"
      }],

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Property.css"}]
       */
      cssRequirements: [{
         cssFile: "./css/Property.css"
      }],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * This is the object that the property to be rendered will be retrieved from.
       *
       * @instance
       * @type {object}
       * @default null
       */
      currentItem: null,

      /**
       * This should be set to the name of the property to render (e.g. "cm:name"). The property is expected
       * to be in the properties map for the item being rendered.
       *
       * @instance
       * @type {string}
       * @default null
       */
      propertyToRender: null,

      /**
       * This will be set with the rendered value.
       *
       * @instance
       * @type {string}
       * @default null
       */
      renderedValue: null,

      /**
       * This can be set to apply a CSS class to the rendered property value
       *
       * @instance
       * @type {string}
       * @default "alfresco-renderers-Property"
       */
      renderedValueClass: "alfresco-renderers-Property",

      /**
       * A label to go before the rendered value
       * @instance
       * @type {string}
       * @default ""
       */
      renderedValuePrefix: "",

      /**
       * A label to go after the rendered value
       * @instance
       * @type {string}
       * @default ""
       */
      renderedValueSuffix: "",

      /**
       * Indicates whether or not to hide the property if is not available or not set
       * @instance
       * @type {boolean}
       * @default false
       */
      warnIfNotAvailable: false,

      /**
       * This can be either small, medium or large.
       * @instance
       * @type {string}
       * @default "medium"
       */
      renderSize: "medium",

      /**
       * This indicates whether or not the requestes property can be found for the current item
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      renderPropertyNotFound: true,

      /**
       * Indicates that this should only be displayed when the item (note: NOT the renderer) is
       * hovered over.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      onlyShowOnHover: false,

      /**
       * The label for the property. Won't be shown if left as null.
       *
       * @instance
       * @type {string}
       * @default null
       */
      label: null,

      /**
       * Indicates whether or not the property will be rendered on a new line.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      renderOnNewLine: false,

      /**
       * Indicates whether or not the property should be de-emphasized. This will result in a lighter colour
       * being used.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      deemphasized: false,

      /**
       * Specifies a maximum width for the content of the renderer, and will overflow with an ellipsis if necessary
       *
       * @instance
       * @type {string}
       */
      maxWidth: null,

      /**
       * The positions where a tooltip can appear over a truncated value
       *
       * @static
       * @instance
       * @protected
       * @type {string[]}
       */
      _tooltipPositions: ["below-centered", "above-centered"],

      /**
       * Set up the attributes to be used when rendering the template.
       *
       * @instance
       */
      postMixInProperties: function alfresco_renderers_Property__postMixInProperties() {
         if (this.label) {
            this.label = this.message(this.label) + ": ";
         } else {
            this.label = "";
         }

         if (ObjectTypeUtils.isString(this.propertyToRender) &&
            ObjectTypeUtils.isObject(this.currentItem) &&
            lang.exists(this.propertyToRender, this.currentItem)) {
            this.renderPropertyNotFound = false;
            this.originalRenderedValue = this.getRenderedProperty(lang.getObject(this.propertyToRender, false, this.currentItem));
            this.renderedValue = this.mapValueToDisplayValue(this.originalRenderedValue);
         } else {
            this.alfLog("log", "Property does not exist:", this);
         }

         this.renderedValueClass = this.renderedValueClass + " " + this.renderSize;

         if (this.renderOnNewLine === true) {
            this.renderedValueClass = this.renderedValueClass + " block";
         }

         if (this.deemphasized === true) {
            this.renderedValueClass = this.renderedValueClass + " deemphasized";
         }

         // If the renderedValue is not set then display a warning message if requested...
         if (this.renderedValue === null || this.renderedValue === "" || typeof this.renderedValue === "undefined") {
            if (this.warnIfNotAvailable) {
               // Get appropriate message
               // Check message based on propertyToRender otherwise default to sensible alternative
               var warningKey = this.warnIfNoteAvailableMessage,
                  warningMessage = "";
               if (!warningKey) {
                  warningKey = "no." + this.propertyToRender + ".message";
                  warningMessage = this.message(warningKey);
                  if (warningMessage === warningKey) {
                     warningMessage = this.message("no.property.message", {
                        0: this.propertyToRender
                     });
                  }
               } else {
                  warningMessage = this.message(warningKey);
               }
               this.renderedValue = warningMessage;
               this.renderedValueClass += " faded";
            } else {
               // Reset the prefix and suffix if there's no data to display
               this.requestedValuePrefix = this.renderedValuePrefix;
               this.requestedValueSuffix = this.renderedValueSuffix;
               this.renderedValuePrefix = "";
               this.renderedValueSuffix = "";
            }
         }
      },

      /**
       * Determines whether or not the property should only be displayed when the item is hovered over.
       *
       * @instance
       */
      postCreate: function alfresco_renderers_Property__postCreate() {
         if (this.maxWidth) {
            domClass.add(this.domNode, "has-max-width");
            domStyle.set(this.domNode, {
               maxWidth: this.maxWidth
            });
         }
         if (this.onlyShowOnHover === true) {
            domClass.add(this.domNode, "hover-only");
         } else {
            // No action
         }
      },

      /**
       * Called on widget startup
       *
       * @instance
       */
      startup: function alfresco_renderers_Property__startup() {
         this.inherited(arguments);
         if (this.maxWidth && this.domNode.scrollWidth > this.domNode.clientWidth) {
            var target = this.domNode,
               tooltipPositions = this._tooltipPositions;
            this.own(on(target, "focus,mouseover", function() {
               var content = lang.trim(target.textContent || target.innerText || "");
               Tooltip.show(content, target, tooltipPositions);
            }));
            this.own(on(target, "blur,mouseout", function() {
               Tooltip.hide(target);
            }));
         }
      },

      /**
       * Renders a date property.
       *
       * @instance
       */
      renderDate: function(date, format) {
         return this.formatDate(this.fromISO8601(date), format);
      },

      /**
       * @instance
       * @param {string} property The name of the property to render
       */
      getRenderedProperty: function alfresco_renderers_Property__getRenderedProperty(property) {
         /*jshint maxcomplexity:15*/
         var value = "";
         if (property === null || typeof property === "undefined") {
            // No action required if a property isn't supplied
         } else if (ObjectTypeUtils.isString(property)) {
            value = this.encodeHTML(property);
         } else if (ObjectTypeUtils.isArray(property)) {
            value = property.length;
         } else if (ObjectTypeUtils.isBoolean(property)) {
            value = property;
         } else if (ObjectTypeUtils.isNumber(property)) {
            value = property;
         } else if (ObjectTypeUtils.isObject(property)) {
            // TODO: This should probably be moved out into a Node specific sub-class
            if (property.hasOwnProperty("iso8601")) {
               value = this.renderDate(property.iso8601);
            } else if (property.hasOwnProperty("userName") && property.hasOwnProperty("displayName")) {
               value = UrlUtils.userProfileLink(property.userName, property.displayName);
            } else if (property.hasOwnProperty("displayName")) {
               value = this.encodeHTML(property.displayName || "");
            } else if (property.hasOwnProperty("title")) {
               value = this.encodeHTML(property.title || "");
            } else if (property.hasOwnProperty("name")) {
               value = this.encodeHTML(property.name || "");
            }
         }
         return value;
      }
   });
});